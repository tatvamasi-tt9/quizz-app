const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const Quizmodel = require('../Models/QuizSession'); //  import model

router.get("/history", ensureAuthenticated, async (req, res) => {
  try {
    const history = await Quizmodel.find({
      userId: req.userId,
      status: "completed"
    })
      .sort({ updatedAt: -1 })
      .select("_id title createdAt timeTaken status questions answers focusTopics parentQuizId");

    // Shape each entry with a display-ready title + score, and strip the
    // full question/answer payload back out (only needed it to compute
    // accuracy here) so the history list stays lightweight.
    const shaped = history.map((quiz) => {
      const totalQuestions = quiz.questions.length;

      const correctCount = quiz.questions.reduce((count, q, index) => {
        return q.correctAnswer === quiz.answers[index] ? count + 1 : count;
      }, 0);

      const accuracy =
        totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

      return {
        _id: quiz._id,
        title: quiz.title || "Untitled Quiz",
        createdAt: quiz.createdAt,
        timeTaken: quiz.timeTaken,
        status: quiz.status,
        accuracy,
        totalQuestions,
        isPractice: !!quiz.parentQuizId,
        focusTopics: quiz.focusTopics || []
      };
    });

    res.status(200).json(shaped);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
