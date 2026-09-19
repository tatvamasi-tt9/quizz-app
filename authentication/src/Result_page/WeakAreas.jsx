import { FaArrowRight } from "react-icons/fa";

/**
 * Accuracy -> emoji / color mapping used across the weak-area breakdown.
 *   < 40%        -> red    (weak)
 *   40% - 69%    -> orange (needs work)
 *   >= 70%       -> green  (solid)
 */
function getTopicStyle(accuracy) {
  if (accuracy < 40) {
    return {
      emoji: "🔴",
      text: "text-red-600 dark:text-red-400",
      bar: "bg-red-500",
      track: "bg-red-100 dark:bg-red-500/10"
    };
  }
  if (accuracy < 70) {
    return {
      emoji: "🟠",
      text: "text-orange-600 dark:text-orange-400",
      bar: "bg-orange-500",
      track: "bg-orange-100 dark:bg-orange-500/10"
    };
  }
  return {
    emoji: "🟢",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    track: "bg-emerald-100 dark:bg-emerald-500/10"
  };
}

const WeakAreas = ({ topicBreakdown, onPractice, practicing, practiceError }) => {
  if (!topicBreakdown || topicBreakdown.length === 0) return null;

  const weakTopics = topicBreakdown.filter((t) => t.accuracy < 70);
  const hasWeakTopics = weakTopics.length > 0;

  return (
    <div
      className="bg-white dark:bg-slate-800/50
                 border border-gray-200
                 dark:border-slate-700/50
                 rounded-2xl shadow-sm p-8
                 backdrop-blur-sm"
    >
      <h2 className="font-semibold text-2xl mb-1 dark:text-white">
        Your Weak Areas
      </h2>

      <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
        Accuracy by topic for this quiz
      </p>

      <div className="space-y-4">
        {topicBreakdown.map((t) => {
          const style = getTopicStyle(t.accuracy);

          return (
            <div key={t.topic}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-medium text-gray-800 dark:text-slate-200 flex items-center gap-2">
                  <span>{style.emoji}</span>
                  <span>{t.topic}</span>
                </span>

                <span className={`text-sm font-bold ${style.text}`}>
                  {t.accuracy}%{" "}
                  <span className="font-normal text-gray-400 dark:text-slate-500">
                    ({t.correct}/{t.total})
                  </span>
                </span>
              </div>

              <div className={`h-2.5 w-full rounded-full overflow-hidden ${style.track}`}>
                <div
                  className={`h-full rounded-full ${style.bar} transition-all duration-500`}
                  style={{ width: `${t.accuracy}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/50">
        {hasWeakTopics ? (
          <>
            <button
              onClick={onPractice}
              disabled={practicing}
              className="w-full sm:w-auto flex items-center justify-center gap-2
                         bg-black dark:bg-white
                         text-white dark:text-slate-900
                         font-semibold px-6 py-3 rounded-xl
                         hover:bg-white hover:text-black
                         dark:hover:bg-slate-200
                         border border-black dark:border-transparent
                         transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {practicing ? (
                "Generating your practice quiz..."
              ) : (
                <>
                  Practice Weak Areas <FaArrowRight />
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
              We'll build a fresh quiz focused on{" "}
              {weakTopics.map((t) => t.topic).join(", ")}.
            </p>
          </>
        ) : (
          <p className="text-emerald-600 dark:text-emerald-400 font-medium">
            🎉 Great job! Every topic is at 70% or above.
          </p>
        )}

        {practiceError && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-3">
            {practiceError}
          </p>
        )}
      </div>
    </div>
  );
};

export default WeakAreas;
