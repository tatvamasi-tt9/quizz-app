import { useState } from "react";

export const Uploadtext = ({ close, select }) => {
  const [input_text, setinput_text] = useState("");

  function handleSubmit() {
    if (!input_text.trim()) return;
    select(input_text);
    close();
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 mb-10 animate-fadeIn" >
      
      <div className="
                       dark:bg-gray-900
                      rounded-2xl  transition-colors">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Paste your text
          </h2>

          
        </div>

        {/* Textarea */}
        <textarea
          className="w-full min-h-[260px]
                     border border-gray-300 dark:border-gray-700
                     bg-gray-50 dark:bg-gray-800
                     text-gray-800 dark:text-gray-100
                     rounded-xl p-4 outline-none
                      dark:focus:ring-gray-500
                     transition"
          placeholder="Paste or write your text here..."
          value={input_text}
          onChange={(e) => setinput_text(e.target.value)}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={close}
            className="px-4 py-2 rounded-lg
                       border border-gray-300 dark:border-gray-600
                       text-gray-600 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg
                       bg-black dark:bg-white
                       text-white dark:text-black
                       font-semibold
                       hover:opacity-90 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

