import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Mcq from "./Mcq";
import { handleError, handleSuccess } from "../loginandsignup/toast";
import { ImExit } from "react-icons/im";

const Question = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  // ------------------ QUESTIONS ------------------

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizMeta, setQuizMeta] = useState({ title: "", focusTopics: [] });

  // ------------------ QUIZ PROGRESS ------------------

  const [question_no, setquestion_no] = useState(0);
  const [answers, setanswers] = useState([]);
  const [selected, setselected] = useState(null);
  const [submitted, setsubmitted] = useState(false);

  // Session-specific localStorage keys
  const PROGRESS_KEY = `quiz_progress_${sessionId}`;
  const START_TIME_KEY = `quiz_start_time_${sessionId}`;

  /* ------------------ FETCH QUIZ ------------------ */

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/fetchquiz/${sessionId}`,
          {
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch quiz");
        }

        console.log("Quiz received:", result);

        /*
          Backend response:

          {
            quiz: {
              _id: "...",
              userId: "...",
              questions: [
                {
                  question: "...",
                  options: ["A", "B", "C", "D"]
                }
              ]
            }
          }

          correctAnswer is NOT sent to frontend.
        */

        setQuestions(result.quiz.questions);
        setQuizMeta({
          title: result.quiz.title || "",
          focusTopics: result.quiz.focusTopics || [],
        });

      } catch (err) {
        console.error(err);
        handleError(err.message || "Unable to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [sessionId]);

  /* ------------------ START TIME ------------------ */

  useEffect(() => {
    if (!sessionId) return;

    if (!localStorage.getItem(START_TIME_KEY)) {
      localStorage.setItem(
        START_TIME_KEY,
        Date.now().toString()
      );
    }
  }, [sessionId]);

  /* ------------------ RESTORE PROGRESS ------------------ */

  useEffect(() => {
    if (!sessionId) return;

    const savedProgress = JSON.parse(
      localStorage.getItem(PROGRESS_KEY) || "null"
    );

    if (savedProgress) {
      setquestion_no(savedProgress.question_no ?? 0);
      setanswers(savedProgress.answers ?? []);
    }
  }, [sessionId]);

  /* ------------------ CURRENT QUESTION ------------------ */

  const currentQuestion = questions[question_no];

  /* ------------------ SAVE PROGRESS ------------------ */

  useEffect(() => {
    if (!sessionId) return;

    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        question_no,
        answers,
      })
    );
  }, [question_no, answers, sessionId]);

  /* ------------------ RESTORE SELECTED OPTION ------------------ */

  useEffect(() => {
    setselected(answers[question_no] ?? null);
  }, [question_no, answers]);

  /* ------------------ NEXT ------------------ */

  function handleNext() {
  const updatedAnswers = [...answers];

  // Save answer only if user selected something
  if (selected !== null) {
    updatedAnswers[question_no] = selected;
    setanswers(updatedAnswers);
  }

  // Last question → submit
  if (question_no + 1 === questions.length) {
    submitResult(updatedAnswers);
  } else {
    setselected(null);
    setquestion_no((prev) => prev + 1);
  }
}

  /* ------------------ PREVIOUS ------------------ */

  function handlePrev() {
  const updatedAnswers = [...answers];

  // Save current answer if one was selected
  if (selected !== null) {
    updatedAnswers[question_no] = selected;
    setanswers(updatedAnswers);
  }

  if (question_no === 0) return;

  setquestion_no((prev) => prev - 1);
}

  /* ------------------ SUBMIT RESULT ------------------ */

  async function submitResult(finalAnswers) {
    if (submitted) return;

    setsubmitted(true);

    const startTime = Number(
      localStorage.getItem(START_TIME_KEY)
    );

    const endTime = Date.now();

    const timeTaken = Math.floor(
      (endTime - startTime) / 1000
    );

    try {
      const response = await fetch(
        "http://localhost:8080/login/result",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          /*

            Backend already has:
              questions
              correctAnswer

            in MongoDB.

            We only send:
              sessionId
              answers
              timeTaken
          */

          body: JSON.stringify({
            sessionId,
            answers: finalAnswers,
            timeTaken,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to submit quiz"
        );
      }

      console.log("Result:", result);

      if (result.success) {
        handleSuccess(result.message);

        // Remove this quiz's local progress
        localStorage.removeItem(PROGRESS_KEY);
        localStorage.removeItem(START_TIME_KEY);

        navigate(`/login/result/${result.resultId}`);
      } else {
        handleError(result.message);
        setsubmitted(false);
      }

    } catch (err) {
      console.error(err);

      handleError(
        err.message || "Unable to submit quiz"
      );

      setsubmitted(false);
    }
  }

  /* ------------------ LOADING ------------------ */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading quiz...</p>
      </div>
    );
  }

  /* ------------------ NO QUESTIONS ------------------ */

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No questions found.</p>
      </div>
    );
  }

  /* ------------------ UI ------------------ */

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">

      {/* Quiz Title / Practice Badge */}

      {(quizMeta.title || quizMeta.focusTopics.length > 0) && (
        <div className="w-full max-w-3xl mt-6 flex items-center gap-2 flex-wrap">
          {quizMeta.title && (
            <h2 className="text-lg font-semibold text-gray-800">
              {quizMeta.title}
            </h2>
          )}

          {quizMeta.focusTopics.length > 0 && (
            <span className="text-xs font-medium text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
              Practice: {quizMeta.focusTopics.join(", ")}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}

      <div className="w-full max-w-3xl mt-4">

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-black transition-all duration-300"
            style={{
              width: `${
                ((question_no + 1) / questions.length) * 100
              }%`,
            }}
          />

        </div>

      </div>


      {/* Exit Button */}

      <div className="w-full max-w-3xl flex justify-end mt-10">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black border border-black transition-all duration-200"
        >
          <ImExit className="text-xl" />

          <span className="text-sm font-medium">
            Exit
          </span>
        </button>

      </div>


      {/* Question Card */}

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-200 mt-6 p-6">

        {/* Question */}

        <div className="flex gap-4 items-start text-lg font-medium mb-6">

          <span className="flex items-center justify-center w-12 h-7 rounded-full bg-black text-white text-sm">
            {question_no + 1}
          </span>

          <h1 className="text-gray-900 leading-relaxed">
            {currentQuestion.question}
          </h1>

        </div>


        {/* Options */}

        <div>

          {currentQuestion.options.map((option, index) => (

            <Mcq
              key={index}
              no={index}
              option={option}
              selected={selected === option}
              select={() => setselected(option)}
            />

          ))}

        </div>

      </div>


      {/* Navigation Buttons */}

      <div className="w-full max-w-3xl flex justify-between mt-6">

        {/* Previous */}

        <button
          disabled={question_no === 0}
          onClick={handlePrev}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            question_no === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-900"
          }`}
        >
          Previous
        </button>


        {/* Next / Submit */}

        <button
          onClick={handleNext}
          disabled={submitted}
          className="px-6 py-2 rounded-lg font-medium bg-black text-white hover:bg-white hover:text-black border border-black transition-all"
        >
          {question_no + 1 === questions.length
            ? "Submit"
            : "Next"}
        </button>

      </div>

    </div>
  );
};

export default Question;