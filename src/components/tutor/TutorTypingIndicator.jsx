import React from 'react';

export default function TutorTypingIndicator({ deepThink = false }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      {/* AI avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
        I
      </div>

      {/* Thinking bubble */}
      <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/90">
        <div className="flex items-center gap-3">
          {deepThink ? (
            <>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-xs text-white">
                ✦
              </div>

              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Thinking deeply
                </div>

                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Working through the problem...
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" />
              </div>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                InnoSpeak is thinking...
              </span>
            </>
          )}
        </div>

        {/* Animated progress line */}
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full w-1/3 animate-[tutor-progress_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />
        </div>
      </div>
    </div>
  );
}