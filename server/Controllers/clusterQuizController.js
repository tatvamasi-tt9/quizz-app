const Quizmodel = require("../Models/QuizSession");
const ClusterModel = require("../Models/Cluster");

const GEMINI_GENERATE_MODEL = "gemini-2.5-flash";
const GEMINI_GENERATE_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_GENERATE_MODEL}:generateContent`;

const NUM_QUESTIONS = 10;

/**
 * Build quiz prompt from context
 */
function buildQuizPrompt({ context, difficulty }) {
  return `
You are a quiz-generation engine. Use ONLY the information inside the CONTEXT block below - do not rely on outside knowledge or invent facts that aren't supported by it.

The CONTEXT is made of several passages retrieved from a larger source document, separated by "---". They may not be in their original order and each covers a different part of the material. Spread your questions across as many different passages as possible instead of clustering them all on one passage.

Generate exactly ${NUM_QUESTIONS} multiple choice questions from the CONTEXT.

Each question must have:
1. "question" - the question text
2. "options" - exactly 4 answer options
3. "correctAnswer" - the correct answer
4. "topic" - a short (1-4 word) label naming the specific concept this question tests (e.g. "Deadlock", "Paging", "Process Scheduling"). Reuse the EXACT SAME label on every question that tests the same concept, so questions can be grouped by topic afterwards.

Also come up with:
"title" - a short, descriptive title (3-6 words) for a quiz covering this material.

Difficulty: ${difficulty}

Return ONLY a valid JSON OBJECT (not an array) using EXACTLY this structure:

{
  "title": "Short Quiz Title",
  "questions": [
    {
      "question": "What is ...?",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correctAnswer": "Option 1",
      "topic": "Topic Name"
    }
  ]
}

IMPORTANT RULES:
- "options" MUST contain exactly 4 strings.
- "correctAnswer" MUST exactly match one of the strings inside "options".
- Generate exactly ${NUM_QUESTIONS} question objects.
- Do not write two questions about the same narrow fact.
- Keep "topic" labels short and consistent across questions on the same concept.
- Return ONLY the JSON object.
- Do NOT include any explanation.
- Do NOT use markdown.
- Do NOT wrap the JSON in \`\`\`json or \`\`\`.

CONTEXT:
${context}
`;
}

/**
 * Call Gemini API
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
 * Extract quiz from Gemini response
 */
function extractQuizFromGeminiResponse(data) {
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

  const jsonMatch = textOutput.match(/\{[\s\S]*\}/) || textOutput.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw Object.assign(new Error("Invalid JSON from Gemini"), { status: 502 });
  }

  const parsed = JSON.parse(jsonMatch[0]);

  const rawQuestions = Array.isArray(parsed) ? parsed : parsed.questions;
  const title = Array.isArray(parsed) ? null : parsed.title;

  if (!Array.isArray(rawQuestions)) {
    throw Object.assign(new Error("Gemini response did not include a questions array"), { status: 502 });
  }

  const questions = rawQuestions.map((q) => ({
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer ?? q.answer,
    topic: (q.topic && String(q.topic).trim()) || "General"
  }));

  return { title: title ? String(title).trim() : null, questions };
}

/**
 * Generate fallback title
 */
function deriveFallbackTitle(clusters) {
  if (!clusters || clusters.length === 0) return "Untitled Quiz";
  const topicNames = clusters.map(c => c.topicName).slice(0, 3).join(", ");
  return `Quiz: ${topicNames}`;
}

/**
 * Route handler: Generate quiz from selected cluster topics
 */
const generateQuestionsFromClusters = async (req, res) => {
  try {
    const { docId, selectedClusterIds, difficulty } = req.body;

    if (!docId) {
      return res.status(400).json({ error: "docId is required" });
    }

    if (!selectedClusterIds || !Array.isArray(selectedClusterIds) || selectedClusterIds.length === 0) {
      return res.status(400).json({ error: "At least one cluster must be selected" });
    }

    // ---------- 1. FETCH SELECTED CLUSTERS FROM MONGODB ----------
    const clusters = await ClusterModel.find({
      sourceDocId: docId,
      clusterId: { $in: selectedClusterIds }
    }).sort({ clusterId: 1 });

    if (clusters.length === 0) {
      return res.status(404).json({ error: "No clusters found for the given docId and cluster selection" });
    }

    // Verify ownership
    if (String(clusters[0].userId) !== String(req.userId)) {
      return res.status(403).json({ error: "You do not have access to these clusters" });
    }

    // ---------- 2. BUILD CONTEXT FROM SELECTED CLUSTERS ----------
    // Dynamic chunk distribution: aim for 10-15 total chunks
    const TARGET_TOTAL_CHUNKS = 15;
    const MIN_TOTAL_CHUNKS = 10;

    // Calculate chunks per cluster based on selection
    const numSelectedClusters = clusters.length;
    const chunksPerCluster = Math.max(
      1,
      Math.floor(TARGET_TOTAL_CHUNKS / numSelectedClusters)
    );

    // Collect chunks from each selected cluster
    const selectedChunks = [];

    clusters.forEach((cluster) => {
      // Take up to chunksPerCluster from this cluster
      const chunksToTake = Math.min(chunksPerCluster, cluster.chunks.length);

      // Sort cluster's chunks by chunkIndex first
      const sortedClusterChunks = [...cluster.chunks].sort((a, b) => a.chunkIndex - b.chunkIndex);

      // Take the first N chunks (which includes the representative)
      selectedChunks.push(...sortedClusterChunks.slice(0, chunksToTake));
    });

    // If we didn't reach minimum, distribute remaining slots to clusters with more chunks
    if (selectedChunks.length < MIN_TOTAL_CHUNKS) {
      const remainingSlots = MIN_TOTAL_CHUNKS - selectedChunks.length;
      let slotsDistributed = 0;

      for (const cluster of clusters) {
        if (slotsDistributed >= remainingSlots) break;

        const alreadyTaken = chunksPerCluster;
        const available = cluster.chunks.length - alreadyTaken;

        if (available > 0) {
          const sortedClusterChunks = [...cluster.chunks].sort((a, b) => a.chunkIndex - b.chunkIndex);
          const additionalChunks = Math.min(available, remainingSlots - slotsDistributed);

          selectedChunks.push(...sortedClusterChunks.slice(alreadyTaken, alreadyTaken + additionalChunks));
          slotsDistributed += additionalChunks;
        }
      }
    }

    // Sort all selected chunks by original document order for coherent reading
    selectedChunks.sort((a, b) => a.chunkIndex - b.chunkIndex);

    const context = selectedChunks.map((chunk) => chunk.text).join("\n\n---\n\n");

    if (!context || context.trim().length < 20) {
      return res.status(400).json({ error: "Selected clusters contain insufficient content" });
    }

    console.log(`Quiz generation: ${numSelectedClusters} clusters selected, using ${selectedChunks.length} chunks (${chunksPerCluster} per cluster)`);


    // ---------- 3. GENERATE QUIZ ----------
    const prompt = buildQuizPrompt({ context, difficulty: difficulty || "medium" });
    const data = await callGemini(prompt);
    const { title, questions } = extractQuizFromGeminiResponse(data);

    // ---------- 4. SAVE QUIZ SESSION ----------
    const quiz = await Quizmodel.create({
      userId: req.userId,
      questions,
      sourceDocId: docId,
      sourceContext: selectedChunks.map((c) => c.text),
      title: title || deriveFallbackTitle(clusters),
      difficulty: difficulty || "medium"
    });

    return res.status(201).json({ sessionId: quiz._id });

  } catch (err) {
    console.error("Cluster quiz generation error:", err);

    if (!res.headersSent) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
};

module.exports = { generateQuestionsFromClusters };
