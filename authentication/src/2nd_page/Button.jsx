
const Button = ({ select, heading, para, value,icon:Icon }) => {
  const handleClick = () => {
    if (typeof select === "function") {
      select(heading);
    } else if (typeof value === "function") {
      value();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="border-2 border-gray-200 rounded-xl w-70 h-[170px] shadow-sm
                 transition-all duration-300 hover:-translate-y-2
                 hover:ring-2 hover:ring-blue-500 cursor-pointer
                 /* Dark Mode Styles */
                 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-400 dark:shadow-2xl"
    >
       {Icon && <Icon className="text-3xl mx-4 mt-6 text-blue-600 dark:text-blue-400" />}

      <div className="mx-4 mt-4">
        <h1 className="text-xl font-bold dark:text-white">{heading}</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Upload a source file</p>
      </div>
    </div>
  );
};

export default Button;
