import { Link } from "react-router-dom";

const Introduction = () => {
  return (
    <main>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              AI-powered learning platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-slate-900">
              Turn anything you study into a
              <span className="text-emerald-600"> quiz.</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-500 max-w-xl">
              QUIZZR uses AI to create personalized quizzes from topics,
              PDFs, images and other learning material — helping you learn
              faster and identify what you actually need to improve.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <Link
                to="/login"
                className="
                  inline-flex items-center justify-center
                  px-6 py-3.5
                  rounded-xl
                  bg-emerald-600
                  text-white
                  font-semibold
                  shadow-lg shadow-emerald-600/20
                  hover:bg-emerald-700
                  hover:-translate-y-0.5
                  transition-all duration-200
                "
              >
                Generate a Quiz
                <span className="ml-2">→</span>
              </Link>

              <Link
                to="/signup"
                className="
                  inline-flex items-center justify-center
                  px-6 py-3.5
                  rounded-xl
                  border border-slate-200
                  bg-white
                  text-slate-700
                  font-semibold
                  hover:bg-slate-50
                  transition
                "
              >
                Create Free Account
              </Link>

            </div>

            {/* Small trust text */}
            <div className="flex items-center gap-4 mt-7 text-sm text-slate-400">
              <span>✓ AI-generated quizzes</span>
              <span>✓ Personalized learning</span>
            </div>

          </div>


          {/* Right - Quiz Preview */}
          <div className="relative">

            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-green-50 rounded-full blur-3xl"></div>

            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/60 p-6 max-w-lg mx-auto">

              {/* Top */}
              <div className="flex items-center justify-between mb-6">

                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    AI Generated Quiz
                  </p>

                  <h3 className="text-lg font-bold mt-1">
                    Operating Systems
                  </h3>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                  8 Questions
                </div>

              </div>

              {/* Question */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">

                <p className="text-sm font-semibold text-slate-800 leading-6">
                  Which scheduling algorithm gives each process an equal
                  amount of CPU time?
                </p>

                <div className="space-y-3 mt-5">

                  <div className="border border-slate-200 bg-white rounded-lg px-4 py-3 text-sm text-slate-600">
                    A. FCFS
                  </div>

                  <div className="border border-emerald-500 bg-emerald-50 rounded-lg px-4 py-3 text-sm text-emerald-700 font-medium">
                    B. Round Robin ✓
                  </div>

                  <div className="border border-slate-200 bg-white rounded-lg px-4 py-3 text-sm text-slate-600">
                    C. SJF
                  </div>

                  <div className="border border-slate-200 bg-white rounded-lg px-4 py-3 text-sm text-slate-600">
                    D. Priority Scheduling
                  </div>

                </div>

              </div>

              {/* Bottom stats */}
              <div className="grid grid-cols-3 gap-3 mt-5">

                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-slate-900">92%</p>
                  <p className="text-[11px] text-slate-400">Accuracy</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-slate-900">12</p>
                  <p className="text-[11px] text-slate-400">Quizzes</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-emerald-600">+18%</p>
                  <p className="text-[11px] text-slate-400">Progress</p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>


      {/* Features */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
              Everything you need to learn
            </p>

            <h2 className="text-3xl lg:text-4xl font-bold mt-3 tracking-tight">
              Study smarter, not harder.
            </h2>

            <p className="mt-4 text-slate-500">
              QUIZZR turns your study material into an interactive learning
              experience.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

              <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                📄
              </div>

              <h3 className="text-lg font-bold mt-5">
                Learn from anything
              </h3>

              <p className="text-sm text-slate-500 leading-6 mt-2">
                Generate quizzes from topics, PDFs, images and other learning
                content.
              </p>

            </div>


            {/* Feature 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

              <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
                🧠
              </div>

              <h3 className="text-lg font-bold mt-5">
                Personalized quizzes
              </h3>

              <p className="text-sm text-slate-500 leading-6 mt-2">
                Focus on weak areas and generate quizzes that match your
                learning needs.
              </p>

            </div>


            {/* Feature 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

              <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
                📊
              </div>

              <h3 className="text-lg font-bold mt-5">
                Track your progress
              </h3>

              <p className="text-sm text-slate-500 leading-6 mt-2">
                Review your quiz history and understand where you are
                improving and where you need more practice.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">

        <div className="text-center mb-12">

          <h2 className="text-3xl font-bold">
            How QUIZZR works
          </h2>

          <p className="text-slate-500 mt-3">
            From study material to personalized practice in a few steps.
          </p>

        </div>


        <div className="grid md:grid-cols-3 gap-8">

          <div className="text-center">

            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              1
            </div>

            <h3 className="font-bold mt-4">
              Add your material
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              Enter a topic or upload your study material.
            </p>

          </div>


          <div className="text-center">

            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              2
            </div>

            <h3 className="font-bold mt-4">
              Let AI generate
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              QUIZZR creates questions based on your learning content.
            </p>

          </div>


          <div className="text-center">

            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              3
            </div>

            <h3 className="font-bold mt-4">
              Learn & improve
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              Take the quiz, analyze your performance and practice again.
            </p>

          </div>

        </div>

      </section>


      {/* Final CTA */}
      <section className="px-6 pb-20">

        <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 px-8 py-14 text-center">

          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Ready to test what you know?
          </h2>

          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Create your first AI-powered quiz and turn your study material
            into active learning.
          </p>

          <Link
            to="/login"
            className="
              inline-flex items-center
              mt-7
              px-6 py-3.5
              rounded-xl
              bg-emerald-500
              text-white
              font-semibold
              hover:bg-emerald-400
              transition
            "
          >
            Generate Your First Quiz
            <span className="ml-2">→</span>
          </Link>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">

        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-emerald-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Q</span>
            </div>

            <span className="font-semibold text-sm">
              QUIZZR
            </span>
          </div>

          <p className="text-xs text-slate-400">
            AI-powered learning platform
          </p>

        </div>

      </footer>

    </main>
  );
};

export default Introduction;