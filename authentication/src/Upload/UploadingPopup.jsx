const UploadingPopup = ({ message = "Uploading your file..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* popup */}
      <div className="relative z-10 bg-white dark:bg-gray-900
                      rounded-2xl px-10 py-8 shadow-xl
                      flex flex-col items-center gap-4
                      w-[320px]">

        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {message}
        </p>

        {/* progress bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-blue-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default UploadingPopup;
