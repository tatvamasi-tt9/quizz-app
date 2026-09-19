const router = require("express").Router();
const ensureAuthenticated = require("../Middlewares/Auth");
const { generateQuestions, generateWeakAreaQuiz } = require("../Controllers/quizController");

// RAG pipeline lives in Controllers/quizController.js:
// chunk -> embed -> store -> semantic retrieval (MMR) -> Gemini generation
router.post("/generate-questions", ensureAuthenticated, generateQuestions);

// Weak-topic adaptive re-quiz: builds a new quiz focused on the topics the
// user scored below WEAK_THRESHOLD on in a completed quiz.
router.post("/practice-weak-areas", ensureAuthenticated, generateWeakAreaQuiz);

module.exports = router;
