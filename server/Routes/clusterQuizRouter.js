const router = require("express").Router();
const { generateQuestionsFromClusters } = require("../Controllers/clusterQuizController");
const ensureAuthenticated = require("../Middlewares/Auth");

// POST /generate-quiz-from-clusters - Generate quiz from selected cluster topics
router.post(
  "/generate-quiz-from-clusters",
  ensureAuthenticated,
  generateQuestionsFromClusters
);

module.exports = router;
