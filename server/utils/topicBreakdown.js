/**
 * topicBreakdown.js
 * -----------------------------------------------------------------------
 * Groups a completed quiz's questions by their "topic" tag and computes
 * per-topic accuracy. Shared by:
 *   - Resultcontroller.js  -> attaches breakdown to the result page payload
 *   - quizController.js    -> decides which topics count as "weak" when
 *                             generating a practice re-quiz
 * -----------------------------------------------------------------------
 */

// A topic below this accuracy (%) is considered a "weak area".
const WEAK_THRESHOLD = 70;

/**
 * @param {{questions: Array<{topic?: string, correctAnswer: string}>, answers: string[]}} quiz
 * @returns {Array<{topic: string, total: number, correct: number, accuracy: number}>}
 *   Sorted ascending by accuracy (weakest topics first).
 */
function computeTopicBreakdown(quiz) {
  const questions = quiz.questions || [];
  const answers = quiz.answers || [];

  const map = new Map();

  questions.forEach((q, index) => {
    // Older quizzes generated before this feature won't have a topic tag.
    const topic = (q.topic && String(q.topic).trim()) || "General";

    if (!map.has(topic)) {
      map.set(topic, { topic, total: 0, correct: 0 });
    }

    const entry = map.get(topic);
    entry.total += 1;

    if (answers[index] !== undefined && answers[index] === q.correctAnswer) {
      entry.correct += 1;
    }
  });

  return Array.from(map.values())
    .map((entry) => ({
      topic: entry.topic,
      total: entry.total,
      correct: entry.correct,
      accuracy: entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

module.exports = { computeTopicBreakdown, WEAK_THRESHOLD };
