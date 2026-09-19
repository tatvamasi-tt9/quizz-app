const Mcq = ({ no, option, selected, select }) => {
  return (
    <div
      onClick={select}
      className={`border rounded-xl px-5 py-4 my-3 cursor-pointer flex gap-4 items-center transition-all duration-200
        ${
          selected
            ? "bg-black text-white border-black shadow"
            : "bg-white border-gray-300 hover:border-black hover:bg-gray-50"
        }
      `}
    >
      <span
        className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold
          ${
            selected
              ? "bg-white text-black"
              : "bg-gray-100 text-gray-700"
          }
        `}
      >
        {no + 1}
      </span>
      <p className="text-base">{option}</p>
    </div>
  );
};

export default Mcq;
