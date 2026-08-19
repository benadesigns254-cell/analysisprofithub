"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startedAt = Date.now()
    const duration = 2400
    const interval = window.setInterval(() => {
      const nextProgress = Math.min(((Date.now() - startedAt) / duration) * 100, 100)
      setProgress(nextProgress)

      if (nextProgress >= 100) {
        window.clearInterval(interval)
        onComplete()
      }
    }, 40)

    return () => window.clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#030508] px-6 select-none">
      <div className="flex w-full max-w-md flex-col items-center text-center" role="status" aria-label="Loading Profithub">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">Welcome to Profithubanalysis</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">Advanced trading and analysis tool</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">With 80% accuracy and Signals</p>

        <div className="mt-10 w-full">
          <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
            <span>Loading updates</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800" aria-hidden="true">
            <div
              className="h-full rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.8)] transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-7 flex items-center gap-3" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)] animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_14px_rgba(129,140,248,0.9)] animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)] animate-bounce" />
        </div>
        <span className="sr-only">Loading Profithub</span>
      </div>
    </div>
  )
}
