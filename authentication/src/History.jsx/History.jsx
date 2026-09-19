import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../loginandsignup/1st_page/Navbar";

function getScoreStyle(accuracy) {
  if (accuracy < 40) return "text-red-600 bg-red-50 border-red-200";
  if (accuracy < 70) return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-emerald-600 bg-emerald-50 border-emerald-200";
}

const History = () => {
  const [history, setHistory] = useState(null);
  const [reattemptingId, setReattemptingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await fetch("http://localhost:8080/login/history", {
  method: "GET",
  credentials: "include"
});

if (!response.ok) {
  throw new Error(`HTTP error ${response.status}`);
}

const data = await response.json();
setHistory(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  }

  async function handleReattempt(quizId) {
    try {
      setReattemptingId(quizId);

      const response = await fetch(
        `http://localhost:8080/login/reattempt/${quizId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start reattempt");
      }

      navigate(`/questions/${data.sessionId}`);

    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to reattempt this quiz");
      setReattemptingId(null);
    }
  }



if (history === null) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm">
        <p className="text-gray-600 text-sm animate-pulse">
          Loading your quiz history…
        </p>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-50  dark:bg-slate-900">
  <Navbar />

  {/* Page Header */}
  <div className="max-w-5xl mx-auto px-4 mt-10">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200">
      Explore Your Quizzes
    </h1>
    <p className="text-gray-500 mt-2">
      Review your past attempts and track your progress
    </p>
  </div>

  {/* Quiz History */}
  <div className="max-w-5xl mx-auto px-4 grid gap-5 mt-10 pb-16">
    {history.map((quiz) => (
      <div
        key={quiz._id}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 dark:bg-slate-300"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold text-gray-900">
                {quiz.title || "Untitled Quiz"}
              </h2>

              {quiz.isPractice && (
                <span className="text-xs font-medium text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                  Practice
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1 dark:text-gray-700">
              Created on {new Date(quiz.createdAt).toLocaleString()}
            </p>

            {quiz.isPractice && quiz.focusTopics?.length > 0 && (
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-600">
                Focused on: {quiz.focusTopics.join(", ")}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getScoreStyle(
                quiz.accuracy
              )}`}
            >
              {quiz.accuracy}%
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/login/result/${quiz._id}`)}
                className="text-sm font-medium text-black border border-black px-4 py-1.5 rounded-lg hover:bg-black hover:text-white transition-all"
              >
                View Result
              </button>

              <button
                onClick={() => handleReattempt(quiz._id)}
                disabled={reattemptingId === quiz._id}
                className="text-sm font-medium text-white bg-black px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reattemptingId === quiz._id ? "Starting…" : "Reattempt"}
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}

    {/* Empty State */}
    {history.length === 0 && (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No quizzes attempted yet</p>
        <p className="text-sm mt-2">
          Start a quiz to see your progress here 🚀
        </p>
      </div>
    )}
  </div>
</div>

  );
};

export default History;
