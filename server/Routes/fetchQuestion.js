const router=require('express').Router();
const QuizModel=require('../Models/QuizSession')
router.get("/fetchquiz/:sessionId", async (req, res) => {
  try {
    const quiz = await QuizModel.findById(req.params.sessionId).select('-questions.correctAnswer');

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.status(200).json({
      quiz
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});

module.exports=router;