/**
 * geminiEmbeddings.js
 */

const EMBED_MODEL = "gemini-embedding-001";
const EMBED_DIMENSION = 768;

const EMBED_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`;

const EMBED_BATCH_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:batchEmbedContents`;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalize(vector) {
  const magnitude =
    Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;

  return vector.map(v => v / magnitude);
}

// Extract retry delay from HTTP header or Gemini error details
function getRetryDelay(response, data, attempt) {
  const retryAfter = response.headers.get("retry-after");

  if (retryAfter) {
    const seconds = Number(retryAfter);

    if (Number.isFinite(seconds) && seconds > 0) {
      return seconds * 1000;
    }

    const date = Date.parse(retryAfter);

    if (Number.isFinite(date)) {
      return Math.max(0, date - Date.now());
    }
  }

  const details = data?.error?.details || [];

  const retryInfo = details.find(
    item => item["@type"]?.includes("RetryInfo")
  );

  if (retryInfo?.retryDelay) {
    const seconds = parseFloat(retryInfo.retryDelay);

    if (Number.isFinite(seconds)) {
      return seconds * 1000;
    }
  }

  // Exponential backoff + jitter
  const base = Math.min(1000 * 2 ** attempt, 60000);

  return base + Math.random() * 1000;
}

async function makeRequest(url, body) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const maxAttempts = 6;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let response;

    try {
      response = await fetch(`${url}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
    } catch (err) {
      if (attempt === maxAttempts - 1) throw err;

      await sleep(Math.min(1000 * 2 ** attempt, 60000));
      continue;
    }

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return data;
    }

    const retryable =
      response.status === 429 ||
      response.status === 408 ||
      response.status >= 500;

    const message =
      data?.error?.message || `HTTP ${response.status}`;

    if (!retryable) {
      throw new Error(`Gemini API error ${response.status}: ${message}`);
    }

    if (attempt === maxAttempts - 1) {
      throw new Error(
        `Gemini API failed after ${maxAttempts} attempts. ` +
        `Status: ${response.status}. Message: ${message}`
      );
    }

    const delay = getRetryDelay(response, data, attempt);

    console.warn(
      `Gemini API ${response.status}. Retry ${attempt + 1}/${maxAttempts} ` +
      `in ${(delay / 1000).toFixed(1)} seconds. ${message}`
    );

    await sleep(delay);
  }
}

async function embedText(text, taskType) {
  const body = {
    model: `models/${EMBED_MODEL}`,
    content: {
      parts: [{ text }]
    },
    taskType,
    outputDimensionality: EMBED_DIMENSION
  };

  const data = await makeRequest(EMBED_URL, body);

  const values = data?.embedding?.values;

  if (!Array.isArray(values)) {
    throw new Error("Gemini returned no embedding vector");
  }

  return normalize(values);
}

async function embedBatch(texts, taskType) {
  if (!texts.length) return [];

  // Smaller batches to reduce burst pressure
  const MAX_BATCH_SIZE = 20;

  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    const batchTexts = texts.slice(i, i + MAX_BATCH_SIZE);

    console.log(
      `Embedding batch ${Math.floor(i / MAX_BATCH_SIZE) + 1}: ` +
      `${batchTexts.length} chunks`
    );

    const body = {
      requests: batchTexts.map(text => ({
        model: `models/${EMBED_MODEL}`,
        content: {
          parts: [{ text }]
        },
        taskType,
        outputDimensionality: EMBED_DIMENSION
      }))
    };

    const data = await makeRequest(EMBED_BATCH_URL, body);

    const embeddings = data?.embeddings;

    if (
      !Array.isArray(embeddings) ||
      embeddings.length !== batchTexts.length
    ) {
      throw new Error("Unexpected Gemini batch embedding response");
    }

    allEmbeddings.push(
      ...embeddings.map(e => normalize(e.values))
    );

    // Give the API some breathing room
    if (i + MAX_BATCH_SIZE < texts.length) {
      await sleep(1500);
    }
  }

  return allEmbeddings;
}

module.exports = {
  embedText,
  embedBatch,
  normalize,
  EMBED_DIMENSION,
  EMBED_MODEL
};