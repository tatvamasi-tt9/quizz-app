const Questionandanswer = ({ answers, questions }) => {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 mt-12">

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Question Review
        </h2>

      </div>


      <div className="max-w-6xl mx-auto px-4 grid gap-6 pb-10">

        {questions.map((question, index) => {

          const correctAnswerText = question.correctAnswer;

          const userAnswer = answers[index];

          const isCorrect =
            correctAnswerText === userAnswer;


          return (

            <div
              key={index}
              className="bg-white dark:bg-slate-800/40
                         border border-gray-200
                         dark:border-slate-700/50
                         rounded-2xl p-6 shadow-sm
                         backdrop-blur-sm"
            >

              <div className="flex gap-5">

                {/* Question Number */}

                <div
                  className="flex-shrink-0 h-8 w-8
                             rounded-full bg-gray-100
                             dark:bg-slate-700
                             flex items-center justify-center
                             font-bold text-gray-500
                             dark:text-slate-400 text-sm"
                >
                  {index + 1}
                </div>


                <div className="flex-1">

                  {/* Question */}

                  <p
                    className="font-semibold text-lg
                               text-gray-900
                               dark:text-slate-100
                               leading-snug"
                  >
                    {question.question}
                  </p>


                  <div className="mt-4 space-y-2">

                    {/* Correct Answer */}

                    <div
                      className="flex items-center gap-2
                                 text-sm font-medium
                                 text-emerald-700
                                 dark:text-emerald-400
                                 bg-emerald-50
                                 dark:bg-emerald-500/10
                                 p-3 rounded-lg
                                 border border-emerald-100
                                 dark:border-emerald-500/20"
                    >

                      <span className="opacity-70">
                        Correct:
                      </span>

                      {correctAnswerText}

                    </div>


                    {/* User Answer */}

                    {!isCorrect && (

                      <div
                        className="flex items-center gap-2
                                   text-sm font-medium
                                   text-red-600
                                   dark:text-red-400
                                   bg-red-50
                                   dark:bg-red-500/10
                                   p-3 rounded-lg
                                   border border-red-100
                                   dark:border-red-500/20"
                      >

                        <span className="opacity-70">
                          Yours:
                        </span>

                        {userAnswer || "Not answered"}

                      </div>

                    )}


                    {/* Correct Message */}

                    {isCorrect && (

                      <p
                        className="text-xs font-bold
                                   text-emerald-600
                                   dark:text-emerald-500 ml-1"
                      >
                        ✓ Correct choice
                      </p>

                    )}

                  </div>

                </div>

              </div>

            </div>

          );

        })}

      </div>
    </>
  );
};

export default Questionandanswer;