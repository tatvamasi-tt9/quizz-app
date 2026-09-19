import Navbar from "../loginandsignup/1st_page/Navbar";
import Questionandanswer from "./Questionandanswer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Score from "./Score";
import WeakAreas from "./WeakAreas";
import GenratingAnimation from "../2nd_page/GenratingAnimation";

const Result = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  // ------------------ PRACTICE WEAK AREAS ------------------
  const [practicing, setPracticing] = useState(false);
  const [practiceError, setPracticeError] = useState(null);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  async function fetchResult() {
    try {
      const response = await fetch(
        `http://localhost:8080/login/result/${resultId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch result"
        );
      }

      console.log("Result:", data);

      setResult(data);

    } catch (err) {
      console.error(err);
    }
  }

  async function handlePracticeWeakAreas() {
    try {
      setPracticing(true);
      setPracticeError(null);

      const response = await fetch(
        "http://localhost:8080/practice-weak-areas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ sessionId: resultId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate practice quiz");
      }

      navigate(`/questions/${data.sessionId}`);

    } catch (err) {
      console.error(err);
      setPracticeError(err.message || "Unable to generate a practice quiz");
      setPracticing(false);
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading result...
      </div>
    );
  }

  /*
    Expected backend response:

    {
      answers: [...],

      questions: [
        {
          question: "...",
          options: ["A", "B", "C", "D"],
          correctAnswer: "A",
          topic: "..."
        }
      ],

      title: "...",
      timeTaken: 120,
      status: "completed",
      topicBreakdown: [
        { topic: "...", total: 3, correct: 1, accuracy: 33 }
      ]
    }
  */

  const questions = result.questions || [];
  const answers = result.answers || [];

  const correctCount = questions.reduce(
    (count, question, index) => {
      return question.correctAnswer === answers[index]
        ? count + 1
        : count;
    },
    0
  );

  const accuracy =
    questions.length > 0
      ? Math.round(
          (correctCount / questions.length) * 100
        )
      : 0;

  // Backend computes and attaches this; fall back to an empty array so an
  // older cached response never breaks the page.
  const topicBreakdown = result.topicBreakdown || [];

  return (
    <>
      {practicing && <GenratingAnimation />}

      <Navbar />

      <div
        className="min-h-screen py-10 transition-colors duration-300
                   bg-white
                   dark:bg-slate-900"
      >

        {/* Header */}

        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">

          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Statistics
            </h1>

            {result.title && (
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                {result.title}
              </p>
            )}
          </div>

        </div>


        {/* Result Card */}

        <div className="max-w-6xl mx-auto px-6 mt-8">

          <div
            className="bg-white dark:bg-slate-800/50
                       border border-emerald-200
                       dark:border-emerald-500/20
                       rounded-2xl shadow-sm p-8
                       backdrop-blur-sm"
          >

            <h1 className="font-semibold text-2xl mb-6 dark:text-white">
              Result Summary
            </h1>

            <Score accuracy={accuracy} />

          </div>

        </div>


        {/* Stats Grid */}

        <div className="max-w-6xl mx-auto px-6 mt-8 flex gap-6">

          {/* Accuracy */}

          <div
            className="flex-1 bg-white dark:bg-slate-800
                       border border-blue-200
                       dark:border-blue-500/20
                       rounded-xl p-4 shadow-sm"
          >

            <h1
              className="text-xs text-blue-600
                         dark:text-blue-400
                         uppercase tracking-wide font-bold"
            >
              Accuracy
            </h1>

            <h2
              className="text-2xl font-bold mt-1
                         text-gray-900 dark:text-white"
            >
              {accuracy}%
            </h2>

          </div>


          {/* Time Taken */}

          <div
            className="flex-1 bg-white dark:bg-slate-800
                       border border-purple-200
                       dark:border-purple-500/20
                       rounded-xl p-4 shadow-sm"
          >

            <h1
              className="text-xs text-purple-600
                         dark:text-purple-400
                         uppercase tracking-wide font-bold"
            >
              Time Taken
            </h1>

            <h2
              className="text-2xl font-bold mt-1
                         text-gray-900 dark:text-white"
            >
              {Math.floor(result.timeTaken / 60)}m{" "}
              {result.timeTaken % 60}s
            </h2>

          </div>

        </div>


        {/* Weak Areas / Adaptive Re-quiz */}

        <div className="max-w-6xl mx-auto px-6 mt-8">
          <WeakAreas
            topicBreakdown={topicBreakdown}
            onPractice={handlePracticeWeakAreas}
            practicing={practicing}
            practiceError={practiceError}
          />
        </div>


        {/* Question Review */}

        <div className="mt-12">

          <Questionandanswer
            answers={answers}
            questions={questions}
          />

        </div>

      </div>
    </>
  );
};

export default Result;
