const Quizmodel = require('../Models/QuizSession');
const { computeTopicBreakdown } = require('../utils/topicBreakdown');

const QuizResult = async (req, res) => {
  try {
    //  userId MUST come from JWT middleware
    const {sessionId,answers,timeTaken} = req.body;

    const quiz=await Quizmodel.findById(sessionId);
    if(!quiz){
      return res.status(400).json({
        message:'quiz session not found',
        success:false
      })
    }
    
    quiz.answers=answers;
    quiz.timeTaken=timeTaken;
    quiz.status='completed';
    quiz.updatedAt=new Date();
    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Quiz Result stored successfully",
      resultId: quiz._id
    });

  } catch (err) {
    console.error("QuizResult error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const getResultById = async (req, res) => {
  try {
    const result = await Quizmodel.findById(req.params.resultId);       //result is not a plain JSON object. It is a Mongoose document.when we do res.json(result) than A Mongoose document can also generally be passed to res.json(), because Mongoose provides JSON serialization, so you don't normally need toObject() just to send the result as JSON.

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    if (String(result.userId) !== String(req.userId)) {
      return res.status(403).json({ message: "You do not have access to this result" });
    }

    // Attach per-topic accuracy so the result page can render the weak-area
    // breakdown without duplicating the grouping logic on the client.
    const payload = result.toObject();                            // converting the mongooes document to object to apply manipulatin on it
    payload.topicBreakdown = computeTopicBreakdown(result);

    res.json(payload);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creates a fresh, in-progress copy of an existing quiz (same questions,
// same source material) so the user can retake it from the History page.
const reattemptQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const original = await Quizmodel.findById(quizId);

    if (!original) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (String(original.userId) !== String(req.userId)) {
      return res.status(403).json({ message: "You do not have access to this quiz" });
    }

    const fresh = await Quizmodel.create({
      userId: req.userId,
      questions: original.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        topic: q.topic
      })),
      sourceDocId: original.sourceDocId,
      sourceContext: original.sourceContext,
      title: original.title,
      difficulty: original.difficulty,
      focusTopics: original.focusTopics,
      parentQuizId: original._id
    });

    return res.status(201).json({ sessionId: fresh._id });

  } catch (err) {
    console.error("Reattempt error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { QuizResult, getResultById, reattemptQuiz };
