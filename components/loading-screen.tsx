"use client"

import { useEffect } from "react"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 1800)
    return () => window.clearTimeout(timeout)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#030508] select-none">
      <div className="flex items-center gap-3" role="status" aria-label="Loading">
        <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)] animate-bounce [animation-delay:-0.3s]" />
        <span className="h-3 w-3 rounded-full bg-indigo-400 shadow-[0_0_14px_rgba(129,140,248,0.9)] animate-bounce [animation-delay:-0.15s]" />
        <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)] animate-bounce" />
        <span className="sr-only">Loading Profithub</span>
      </div>
    </div>
  )
}
