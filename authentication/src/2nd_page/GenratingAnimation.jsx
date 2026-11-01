
 const GenratingAnimation = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">

      <div className="w-full max-w-5xl px-6">

        {/* ================= ANIMATION ================= */}

        <div className="relative h-[360px] w-full">

          {/* ================= INPUT CARDS ================= */}

          <div className="absolute left-[5%] top-8 w-24 h-20
                          rounded-xl border border-gray-200 bg-white
                          shadow-sm flex flex-col items-center
                          justify-center gap-1">
            <div className="text-2xl text-violet-500">▤</div>
            <span className="text-xs text-gray-600">Text</span>
          </div>

          <div className="absolute left-[5%] top-[140px] w-24 h-20
                          rounded-xl border border-gray-200 bg-white
                          shadow-sm flex flex-col items-center
                          justify-center gap-1">
            <div className="text-2xl font-semibold text-indigo-500">
              Aa
            </div>
            <span className="text-xs text-gray-600">Content</span>
          </div>

          <div className="absolute left-[5%] top-[252px] w-24 h-20
                          rounded-xl border border-gray-200 bg-white
                          shadow-sm flex flex-col items-center
                          justify-center gap-1">
            <div className="text-2xl text-emerald-500">▧</div>
            <span className="text-xs text-gray-600">Image</span>
          </div>


          {/* ================= SVG NETWORK ================= */}

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 360"
            fill="none"
          >

            {/* Input → Network */}

            <path
              d="M150 68 C210 68 220 100 300 100"
              stroke="#a78bfa"
              strokeWidth="2"
              strokeDasharray="6 8"
            />

            <path
              d="M150 180 C220 180 230 180 300 180"
              stroke="#818cf8"
              strokeWidth="2"
              strokeDasharray="6 8"
            />

            <path
              d="M150 292 C210 292 220 255 300 255"
              stroke="#4ade80"
              strokeWidth="2"
              strokeDasharray="6 8"
            />


            {/* Network */}

            <g stroke="#c4b5fd" strokeWidth="1.5">

              <line x1="300" y1="100" x2="390" y2="70" />
              <line x1="300" y1="100" x2="390" y2="180" />

              <line x1="300" y1="180" x2="390" y2="70" />
              <line x1="300" y1="180" x2="390" y2="180" />
              <line x1="300" y1="180" x2="390" y2="260" />

              <line x1="300" y1="255" x2="390" y2="180" />
              <line x1="300" y1="255" x2="390" y2="260" />

              <line x1="390" y1="70" x2="480" y2="120" />
              <line x1="390" y1="70" x2="480" y2="220" />

              <line x1="390" y1="180" x2="480" y2="120" />
              <line x1="390" y1="180" x2="480" y2="220" />

              <line x1="390" y1="260" x2="480" y2="120" />
              <line x1="390" y1="260" x2="480" y2="220" />

            </g>


            {/* Network → AI */}

            <line
              x1="480"
              y1="120"
              x2="585"
              y2="180"
              stroke="#8b5cf6"
              strokeWidth="2"
            />

            <line
              x1="480"
              y1="220"
              x2="585"
              y2="180"
              stroke="#8b5cf6"
              strokeWidth="2"
            />


            {/* AI → Quiz */}

            <line
              x1="625"
              y1="180"
              x2="760"
              y2="180"
              stroke="#8b5cf6"
              strokeWidth="2"
            />

          </svg>


          {/* ================= NODES ================= */}

          <div className="absolute left-[29%] top-[92px]
                          w-5 h-5 rounded-full bg-indigo-400
                          border-4 border-indigo-100
                          shadow-lg shadow-indigo-300
                          animate-pulse" />

          <div className="absolute left-[38%] top-[62px]
                          w-5 h-5 rounded-full bg-violet-400
                          border-4 border-violet-100
                          shadow-lg shadow-violet-300
                          animate-pulse" />

          <div className="absolute left-[38%] top-[172px]
                          w-5 h-5 rounded-full bg-indigo-400
                          border-4 border-indigo-100
                          shadow-lg shadow-indigo-300
                          animate-pulse" />

          <div className="absolute left-[38%] top-[252px]
                          w-5 h-5 rounded-full bg-indigo-400
                          border-4 border-indigo-100
                          shadow-lg shadow-indigo-300
                          animate-pulse" />

          <div className="absolute left-[47%] top-[112px]
                          w-5 h-5 rounded-full bg-indigo-400
                          border-4 border-indigo-100
                          shadow-lg shadow-indigo-300
                          animate-pulse" />

          <div className="absolute left-[47%] top-[212px]
                          w-5 h-5 rounded-full bg-indigo-400
                          border-4 border-indigo-100
                          shadow-lg shadow-indigo-300
                          animate-pulse" />


          {/* Green node */}

          <div className="absolute left-[29%] top-[247px]
                          w-5 h-5 rounded-full bg-emerald-400
                          border-4 border-emerald-100
                          shadow-lg shadow-emerald-300
                          animate-pulse" />


          {/* ================= AI CORE ================= */}

          <div className="absolute left-[56%] top-[132px]
                          w-24 h-24 rounded-full
                          bg-violet-100
                          flex items-center justify-center
                          animate-pulse">

            <div className="w-16 h-16 rounded-full
                            bg-gradient-to-br from-violet-500
                            to-indigo-500
                            shadow-xl shadow-violet-300
                            flex items-center justify-center">

              <span className="text-3xl text-white">
                ✦
              </span>

            </div>

          </div>


          {/* ================= QUIZ CARD ================= */}

          <div className="absolute right-[3%] top-[62px]
                          w-52 p-4 rounded-2xl
                          bg-white border border-gray-200
                          shadow-xl shadow-violet-100
                          animate-pulse">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 rounded-lg
                              bg-violet-500
                              flex items-center justify-center
                              text-white text-xl font-bold">
                ?
              </div>

              <div className="flex-1 space-y-2">

                <div className="h-2 w-24
                                bg-gray-200 rounded-full" />

                <div className="h-2 w-16
                                bg-gray-100 rounded-full" />

              </div>

            </div>


            {/* Options */}

            <div className="space-y-2">

              <div className="h-8 rounded-lg
                              border border-gray-200
                              flex items-center px-3 gap-2">

                <div className="w-4 h-4 rounded-full
                                bg-emerald-400
                                flex items-center justify-center
                                text-white text-[10px]">
                  ✓
                </div>

                <div className="h-2 w-20
                                bg-gray-200 rounded-full" />

              </div>


              <div className="h-8 rounded-lg
                              border border-gray-200
                              flex items-center px-3 gap-2">

                <div className="w-4 h-4 rounded-full
                                border-2 border-gray-300" />

                <div className="h-2 w-16
                                bg-gray-200 rounded-full" />

              </div>


              <div className="h-8 rounded-lg
                              border border-gray-200
                              flex items-center px-3 gap-2">

                <div className="w-4 h-4 rounded-full
                                border-2 border-gray-300" />

                <div className="h-2 w-20
                                bg-gray-200 rounded-full" />

              </div>


              <div className="h-8 rounded-lg
                              border border-gray-200
                              flex items-center px-3 gap-2">

                <div className="w-4 h-4 rounded-full
                                border-2 border-gray-300" />

                <div className="h-2 w-14
                                bg-gray-200 rounded-full" />

              </div>

            </div>

          </div>


          {/* ================= PARTICLES ================= */}

          <div className="absolute left-[52%] top-[75px]
                          w-2 h-2 rounded-full
                          bg-violet-300 animate-ping" />

          <div className="absolute left-[54%] top-[245px]
                          w-2 h-2 rounded-full
                          bg-indigo-300 animate-ping" />

          <div className="absolute right-[20%] top-[50px]
                          text-violet-400 text-xl animate-pulse">
            ✦
          </div>

        </div>


        {/* ================= TEXT ================= */}

        <div className="text-center">

          <h1 className="text-4xl font-bold text-slate-900">
            Creating your quiz
          </h1>

          <p className="mt-3 text-xl text-violet-500 font-medium">
            Generating questions
            <span className="ml-1">

              <span className="animate-pulse">.</span>

              <span className="animate-pulse delay-150">.</span>

              <span className="animate-pulse delay-300">.</span>

            </span>
          </p>


          {/* Progress bar */}

          <div className="w-[500px] max-w-[90%]
                          h-1 bg-gray-200
                          rounded-full mx-auto mt-7
                          overflow-hidden">

            <div className="h-full w-2/3
                            bg-gradient-to-r
                            from-indigo-500
                            to-violet-500
                            rounded-full
                            animate-pulse" />

          </div>


          <p className="mt-5 text-sm text-slate-400">
            Analyzing your content .....
          </p>

        </div>

      </div>

    </div>
  )
}


export default GenratingAnimation;