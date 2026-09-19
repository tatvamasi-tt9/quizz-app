import { useState, useRef, useEffect } from "react";

export default function Difficulty({select, placeholder}) {
  const [open, setOpen] = useState(false);
  
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-64 mt-10">
      <p className="ml-4 text-l text-gray-600 mb-2 ml-5">Set ,Level of questions</p>
      <div className="flex items-center rounded-md border-2 border-gray-300 bg-white px-3 py-2 
             cursor-pointer w-100 ml-4 
             dark:bg-slate-800 dark:border-slate-700 dark:text-white">
      {/* Input */}
      
      <input
        type="text"
        readOnly
        onClick={() => setOpen(!open)}
        placeholder={placeholder==''?'select difficulty':placeholder}
        className="flex-1 bg-transparent text-sm outline-none cursor-pointer placeholder-gray-400 dark:placeholder-slate-500"
      />
       <svg onClick={() => setOpen(!open)}
      className="ml-2 h-4 w-4 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg></div>

      {/* Floating options */}
      {open && (
        <div className="absolute z-10 mt-1 w-90 ml-10 rounded-md border border-gray-200 bg-white shadow-lg 
                  dark:bg-slate-800 dark:border-slate-700 dark:shadow-2xl animate-fadeIn">
          {["Easy", "Medium", "Hard"].map((item) => (
            <div
              key={item}
              onClick={() => {
                select(item)
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700 dark:text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
