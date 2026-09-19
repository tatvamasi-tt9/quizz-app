/**
 * geminiEmbeddings.js
 * -----------------------------------------------------------------------
 * Thin wrapper around Gemini's embedContent REST endpoints. No extra SDK
 * dependency - just the built-in `fetch`.
 *
 * Docs: https://ai.google.dev/api/embeddings
 * -----------------------------------------------------------------------
 */

const EMBED_MODEL = "gemini-embedding-001";
const EMBED_DIMENSION = 768; // good accuracy/speed/storage tradeoff for a single-doc use case
const EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`;
const EMBED_BATCH_URL = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:batchEmbedContents`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / magnitude);
}

/** Exponential backoff with jitter, honoring Retry-After when present. */
async function waitBeforeRetry(response, attempt) {
  const retryAfterHeader = response?.headers?.get?.("retry-after");
  const retryAfterSeconds = Number(retryAfterHeader);

  const wait =
    retryAfterSeconds > 0
      ? retryAfterSeconds * 1000
      : 1000 * 2 ** attempt + Math.random() * 300;

  await sleep(wait);
}

/**
 * Embed a single piece of text. Used for the one-off query embedding.
 */
async function embedText(text, taskType) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  //This checks whether my API key exists.

  const body = {
    model: `models/${EMBED_MODEL}`,
    content: { parts: [{ text }] },
    taskType,
    outputDimensionality: EMBED_DIMENSION
  };

  let lastErr;
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`${EMBED_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.status === 429 || response.status >= 500) {
        lastErr = new Error(`Embedding API returned ${response.status}`);
        await waitBeforeRetry(response, attempt);
        continue;
      }

      const data = await response.json();
      const values = data?.embedding?.values;

      if (!values || !Array.isArray(values)) {
        throw new Error(`Embedding API returned no vector: ${JSON.stringify(data).slice(0, 300)}`);
      }

      return normalize(values);
    } catch (err) {
      lastErr = err;
      await sleep(400 * (attempt + 1));
    }
  }

  throw lastErr || new Error("Failed to generate embedding");
}

/**
 * Embed many chunks in a SINGLE request via batchEmbedContents, instead of
 * firing one request per chunk. This is the important part for avoiding
 * 429s: a quiz with, say, 12 chunks used to mean 12 (5-at-a-time
 * concurrent) embedding requests hitting the API; now it's 1 request
 * regardless of chunk count, which stays well under the per-minute
 * request-count rate limit on the free tier.
 */
async function embedBatch(texts, taskType) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  if (texts.length === 0) return [];

  const body = {
    requests: texts.map((text) => ({
      model: `models/${EMBED_MODEL}`,
      content: { parts: [{ text }] },
      taskType,
      outputDimensionality: EMBED_DIMENSION
    }))
  };

  // here we have made whole chunks array into 1 batch , with chunks.size() request in the batch . // i could also have divide into many batches

  let lastErr;
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {

      //sending to gemini api, to create embedding for each request
      const response = await fetch(`${EMBED_BATCH_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.status === 429 || response.status >= 500) {
        lastErr = new Error(`Embedding API returned ${response.status}`);
        await waitBeforeRetry(response, attempt);
        continue;
      }

      const data = await response.json();
      const embeddings = data?.embeddings;

      if (!Array.isArray(embeddings) || embeddings.length !== texts.length) {
        throw new Error(`Embedding API returned unexpected batch shape: ${JSON.stringify(data).slice(0, 300)}`);
      }

      return embeddings.map((e) => normalize(e.values));        // we are normalizing the embeddings vector data for better cosine similarity calculation 
    } catch (err) {
      lastErr = err;
      await sleep(500 * (attempt + 1));
    }
  }

  throw lastErr || new Error("Failed to generate embeddings");
}

module.exports = { embedText, embedBatch, normalize, EMBED_DIMENSION, EMBED_MODEL };