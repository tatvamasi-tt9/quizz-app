/**
 * clusterTopicNaming.js
 * -----------------------------------------------------------------------
 * Takes representative chunks from clusters and generates meaningful topic
 * names for each cluster using an LLM.
 * -----------------------------------------------------------------------
 */

const GEMINI_GENERATE_MODEL = "gemini-2.5-flash";
const GEMINI_GENERATE_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_GENERATE_MODEL}:generateContent`;

/**
 * Builds a prompt asking the LLM to generate topic names for multiple chunks
 */
function buildTopicNamingPrompt(representativeChunks) {
  const chunksText = representativeChunks
    .map((chunk) => `Cluster ${chunk.clusterId}:\n${chunk.text}`)
    .join("\n\n---\n\n");

  return `
You are a topic naming engine. Below are several text passages, each representing a distinct topic cluster from a larger document.

For each cluster, generate a SHORT, DESCRIPTIVE topic name (2-5 words) that captures the main concept or theme of that passage.

Return ONLY a valid JSON array using EXACTLY this structure:

[
  {
    "clusterId": 0,
    "topicName": "Short Topic Name"
  },
  {
    "clusterId": 1,
    "topicName": "Another Topic Name"
  }
]

IMPORTANT RULES:
- Topic names should be 2-5 words maximum
- Be specific and descriptive
- Use title case (e.g., "Machine Learning Basics", "Database Indexing")
- Return ONLY the JSON array
- Do NOT include any explanation
- Do NOT use markdown
- Do NOT wrap the JSON in \`\`\`json or \`\`\`

PASSAGES:
${chunksText}
`;
}

/**
 * Calls Gemini API to generate content
 */
async function callGemini(prompt) {
  const response = await fetch(`${GEMINI_GENERATE_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  return response.json();
}

/**
 * Extracts topic names from Gemini's response
 */
function extractTopicNamesFromResponse(data) {
  if (!data.candidates || data.candidates.length === 0) {
    throw Object.assign(new Error("Gemini returned no candidates"), { status: 502 });
  }

  const parts = data.candidates[0].content?.parts || [];
  const textOutput = parts
    .filter((p) => p.text)
    .map((p) => p.text)
    .join("\n");

  if (!textOutput) {
    throw Object.assign(new Error("Gemini returned no text"), { status: 502 });
  }

  const jsonMatch = textOutput.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw Object.assign(new Error("Invalid JSON from Gemini"), { status: 502 });
  }

  const parsed = JSON.parse(jsonMatch[0]);

  if (!Array.isArray(parsed)) {
    throw Object.assign(new Error("Expected an array of topic names"), { status: 502 });
  }

  return parsed.map((item) => ({
    clusterId: item.clusterId,
    topicName: String(item.topicName || "").trim() || "Untitled Topic"
  }));
}

/**
 * Generate topic names for clusters
 * @param {Array<{clusterId: number, representative: object, members: Array}>} clusters
 * @returns {Promise<Array<{clusterId: number, topicName: string}>>}
 */
async function generateClusterTopicNames(clusters) {
  if (!clusters || clusters.length === 0) {
    return [];
  }

  // Prepare representative chunks with clusterId for the prompt
  const representativeChunks = clusters.map((cluster) => ({
    clusterId: cluster.clusterId,
    text: cluster.representative.text
  }));

  const prompt = buildTopicNamingPrompt(representativeChunks);
  const data = await callGemini(prompt);
  const topicNames = extractTopicNamesFromResponse(data);

  return topicNames;
}

module.exports = { generateClusterTopicNames };
