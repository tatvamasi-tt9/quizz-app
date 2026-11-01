const crypto = require("crypto");
const Quizmodel = require("../Models/QuizSession");
const Chunk = require("../Models/Chunk");
const { chunkText } = require("../utils/textChunker");
const { embedBatch } = require("../utils/geminiEmbeddings");
const { clusterChunks } = require("../utils/clustering");
const { computeTopicBreakdown, WEAK_THRESHOLD } = require("../utils/topicBreakdown");

const GEMINI_GENERATE_MODEL = "gemini-2.5-flash";
const GEMINI_GENERATE_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_GENERATE_MODEL}:generateContent`;

const NUM_QUESTIONS = 10;

/* -------------------------------------------------------------------- */
/* 1. Chunk the raw text                                                */
/* -------------------------------------------------------------------- */
function buildChunks(input_text) {
  return chunkText(input_text, {
    chunkSize: 1000,
    overlap: 150,
    minChunkLength: 200
  });
}

/* -------------------------------------------------------------------- */
/* 2 & 3. Embed the chunks, persist them, then run clustering-based     */
/*    retrieval - no query involved. We let the document's own          */
/*    embedding geometry reveal its distinct topics/sections, and pick  */
/*    one genuine chunk closest to the center of each cluster. This     */
/*    replaces the old synthetic-query + MMR approach entirely i was trying to do        */
/* -------------------------------------------------------------------- */
async function embedStoreAndRetrieve({ chunks, userId, docId }) {
  const embeddings = await embedBatch(chunks, "RETRIEVAL_DOCUMENT");
/* embeddings = [
  [0.12, -0.45, 0.31, ...], -> for chunk 0
  [0.67,  0.11, -0.22, ...],-> chunk 1 
  [-0.13, 0.55, 0.09, ...] -> chunk 2
  ,...
]
*/
  const chunkRecords = chunks.map((text, i) => ({
    chunkIndex: i,
    text,
    embedding: embeddings[i]
  }));

 

  // Target number of topic clusters - same bounds the old MMR selection
  // used, so context size for the quiz prompt stays in the same range.
  const k = Math.min(16, Math.max(8, Math.ceil(NUM_QUESTIONS * 1.5)));

  const clusters = await clusterChunks(chunkRecords, k, {
    userId: userId,
    sourceDocId: docId
  });

  // One representative chunk per cluster, restored to original document
  // order so the stitched context block reads coherently.
  return clusters
    .map((cluster) => cluster.representative)
    .sort((a, b) => a.chunkIndex - b.chunkIndex);
}

/* -------------------------------------------------------------------- */
/* 4. Feed the retrieved chunks to Gemini for structured quiz JSON      */
/*    Now also asks for a quiz "title" and a per-question "topic" tag,  */
/*    which power the weak-topic breakdown & adaptive re-quiz feature.  */
/* -------------------------------------------------------------------- */
function buildQuizPrompt({ context, difficulty, focusTopics }) {
  const focusInstruction =
    focusTopics && focusTopics.length > 0
      ? `
IMPORTANT FOCUS: This is a targeted practice round for a learner who is weak in these specific topics: ${focusTopics.join(", ")}.
- EVERY question you generate must test one of these exact topics.
- Do NOT generate questions about any other topic, even if it appears in the CONTEXT.
- Reuse one of the topic labels above verbatim in each question's "topic" field.
- If the CONTEXT doesn't contain enough distinct material on a topic, ask the question from a different angle rather than inventing facts, or spend more questions on the topics that do have enough material.
`
      : "";

  return `
You are a quiz-generation engine. Use ONLY the information inside the CONTEXT block below - do not rely on outside knowledge or invent facts that aren't supported by it.

The CONTEXT is made of several passages retrieved from a larger source document, separated by "---". They may not be in their original order and each covers a different part of the material. Spread your questions across as many different passages as possible instead of clustering them all on one passage.
${focusInstruction}
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
 * Parses Gemini's response into { title, questions }.
 * Accepts either the new object shape ({ title, questions: [...] }) or the
 * old bare-array shape (for resilience if the model ever drops "title"),
 * so this keeps working even on a slightly malformed response.
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

/** Fallback title if Gemini ever omits one - first few words of the source text. */
function deriveFallbackTitle(input_text) {
  const words = input_text.trim().split(/\s+/);
  const snippet = words.slice(0, 6).join(" ");
  if (!snippet) return "Untitled Quiz";
  return `Quiz: ${snippet}${words.length > 6 ? "…" : ""}`;
}

/* -------------------------------------------------------------------- */
/* Route handler: generate a new quiz from uploaded text/pdf/link/image */
/* -------------------------------------------------------------------- */
const generateQuestions = async (req, res) => {
  let docId;

  try {
    const { input_text, difficulty } = req.body;

    if (!input_text || input_text.trim().length < 20) {
      return res.status(400).json({ error: "Input text is too short" });
    }

    // ---------- 1. CHUNKING ----------
    const chunks = buildChunks(input_text);
    

    // chunks will be an array of strings  ['sdfdfdfdf','dfduhf dhfdif'...]
    
    if (chunks.length === 0) {
      return res.status(400).json({ error: "Could not extract any content to work with" });
    }

    docId = crypto.randomUUID();

    // ---------- 2 & 3. EMBED + STORE + CLUSTER (topic-representative) ----------
    const selectedChunks = await embedStoreAndRetrieve({
      chunks,
      userId: req.userId,
      docId
    });
   
    const context = selectedChunks.map((c) => c.text).join("\n\n---\n\n"); //  merging all the chunks text and seperating each text chunk by -------

    // ---------- 4. GENERATE STRUCTURED QUIZ JSON ----------
    const prompt = buildQuizPrompt({ context, difficulty: difficulty || "medium" });
    const data = await callGemini(prompt);
    const { title, questions } = extractQuizFromGeminiResponse(data);

    const quiz = await Quizmodel.create({
      userId: req.userId,
      questions,
      sourceDocId: docId,
      // Kept so a later "practice weak areas" round can regenerate from the
      // same material even after the transient Chunk collection expires.
      sourceContext: selectedChunks.map((c) => c.text),
      title: title || deriveFallbackTitle(input_text),
      difficulty: difficulty || "medium"
    });

    return res.status(201).json({ sessionId: quiz._id });
  } catch (err) {
    console.error("Quiz generation error:", err);


    if (!res.headersSent) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
};

/* -------------------------------------------------------------------- */
/* Route handler: generate a focused practice quiz on a completed       */
/* quiz's weak topics (< WEAK_THRESHOLD% accuracy).                     */
/* -------------------------------------------------------------------- */
const generateWeakAreaQuiz = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    const quiz = await Quizmodel.findById(sessionId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (String(quiz.userId) !== String(req.userId)) {
      return res.status(403).json({ message: "You do not have access to this quiz" });
    }

    if (quiz.status !== "completed") {
      return res.status(400).json({ message: "Finish this quiz before practicing weak areas" });
    }

    if (!quiz.sourceContext || quiz.sourceContext.length === 0) {
      return res.status(400).json({
        message:
          "This quiz was created before practice mode was added, so its source material isn't saved. Generate a new quiz to use this feature."
      });
    }

    const breakdown = computeTopicBreakdown(quiz);
    const weakTopics = breakdown
      .filter((t) => t.accuracy < WEAK_THRESHOLD)
      .map((t) => t.topic);

    if (weakTopics.length === 0) {
      return res.status(400).json({
        message: `No weak areas found — every topic is at ${WEAK_THRESHOLD}% or above. Great job!`,
        topicBreakdown: breakdown
      });
    }

    const context = quiz.sourceContext.join("\n\n---\n\n");
    const prompt = buildQuizPrompt({
      context,
      difficulty: quiz.difficulty || "medium",
      focusTopics: weakTopics
    });

    const data = await callGemini(prompt);
    const { questions } = extractQuizFromGeminiResponse(data);

    const practiceQuiz = await Quizmodel.create({
      userId: req.userId,
      questions,
      sourceDocId: quiz.sourceDocId,
      sourceContext: quiz.sourceContext,
      title: `Practice: ${weakTopics.join(", ")}`,
      difficulty: quiz.difficulty || "medium",
      focusTopics: weakTopics,
      parentQuizId: quiz._id
    });

    return res.status(201).json({
      sessionId: practiceQuiz._id,
      weakTopics
    });
  } catch (err) {
    console.error("Weak-area quiz generation error:", err);

    if (!res.headersSent) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  }
};

module.exports = { generateQuestions, generateWeakAreaQuiz };