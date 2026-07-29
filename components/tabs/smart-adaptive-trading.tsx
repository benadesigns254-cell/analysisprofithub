"use client"

import { AnalysisData, Signal } from "@/types/analysis"

interface SmartAdaptiveTradingTabProps {
  signals: Signal[]
  analysis: AnalysisData
  symbol: string
  theme: "light" | "dark"
  currentPrice: number | null
  currentDigit: number | null
  tickCount: number
}

export default function SmartAdaptiveTradingTab({
  signals,
  analysis,
  symbol,
  theme,
  currentPrice,
  currentDigit,
  tickCount,
}: SmartAdaptiveTradingTabProps) {
  return (
    <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-slate-900/50 text-white" : "bg-gray-100 text-slate-900"}`}>
      <h2 className="text-2xl font-bold mb-4">Smart Adaptive Trading</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm opacity-70">Current Symbol</p>
          <p className="text-lg font-semibold">{symbol}</p>
        </div>
        <div>
          <p className="text-sm opacity-70">Current Price</p>
          <p className="text-lg font-semibold">{currentPrice?.toFixed(2) || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm opacity-70">Current Digit</p>
          <p className="text-lg font-semibold">{currentDigit ?? "N/A"}</p>
        </div>
        <div>
          <p className="text-sm opacity-70">Tick Count</p>
          <p className="text-lg font-semibold">{tickCount}</p>
        </div>
      </div>
    </div>
  )
}
