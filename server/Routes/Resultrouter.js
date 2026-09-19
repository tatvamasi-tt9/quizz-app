const { QuizResult, getResultById, reattemptQuiz } = require('../Controllers/Resultcontroller');
const ensureAuthenticated = require('../Middlewares/Auth');
const router = require('express').Router();

router.post('/result', ensureAuthenticated, QuizResult);
router.get("/result/:resultId", ensureAuthenticated, getResultById);
router.post("/reattempt/:quizId", ensureAuthenticated, reattemptQuiz);

module.exports = router;
