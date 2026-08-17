"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import type { Signal, AnalysisResult } from "@/lib/analysis-engine"
import type { DerivSymbol } from "@/hooks/use-deriv"
import { SignalsTab } from "@/components/tabs/signals-tab"
import { ProSignalsTab } from "@/components/tabs/pro-signals-tab"
import { HeritageSuperSignals } from "@/components/heritage-super-signals"
import { AdvancedSignalsTab } from "@/components/advanced-signals-tab"

interface SignalsHubTabProps {
  signals: Signal[]
  proSignals: Signal[]
  analysis: AnalysisResult | null
  theme?: "light" | "dark"
  symbol: string
  availableSymbols?: DerivSymbol[]
  currentPrice?: number | null
  currentDigit?: number | null
  tickCount?: number
  maxTicks?: number
  onMaxTicksChange?: (ticks: number) => void
  onSymbolChange?: (symbol: string) => void
  recentDigits: number[]
}

export function SignalsHubTab({
  signals,
  proSignals,
  analysis,
  theme = "dark",
  symbol,
  availableSymbols = [],
  currentPrice,
  currentDigit,
  tickCount,
  maxTicks,
  onMaxTicksChange,
  onSymbolChange,
  recentDigits,
}: SignalsHubTabProps) {
  const [activeSection, setActiveSection] = useState<string>("standard")


  return (
    <div className="space-y-0">
      <Card className={`rounded-3xl border gap-0 py-0 ${theme === "dark" ? "bg-slate-950/90 border-white/10" : "bg-white border-slate-200"}`}>
        <div className="flex flex-col gap-0 px-0 py-0 border-b border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div />
          <div className="flex flex-wrap items-center gap-2" />
        </div>

        <div className="p-4 pr-0 pb-0">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-0">
            <TabsContent value="standard" className="mt-4">
              <SignalsTab
                signals={signals}
                proSignals={proSignals}
                analysis={analysis}
                theme={theme}
                symbol={symbol}
                availableSymbols={availableSymbols}
                currentPrice={currentPrice}
                currentDigit={currentDigit}
                tickCount={tickCount}
                maxTicks={maxTicks}
                onMaxTicksChange={onMaxTicksChange}
              />
            </TabsContent>

            <TabsContent value="pro" className="mt-4">
              <ProSignalsTab
                proSignals={proSignals}
                analysis={analysis}
                theme={theme}
                symbol={symbol}
                availableSymbols={availableSymbols}
                currentPrice={currentPrice}
                currentDigit={currentDigit}
                tickCount={tickCount}
                onSymbolChange={onSymbolChange}
              />
            </TabsContent>

            <TabsContent value="super" className="mt-4">
              <HeritageSuperSignals
                theme={theme}
                symbol={symbol}
                availableSymbols={availableSymbols}
                maxTicks={maxTicks}
                analysis={analysis}
                recentDigits={recentDigits}
                tickCount={tickCount}
              />
            </TabsContent>

            <TabsContent value="advanced" className="mt-4">
              <AdvancedSignalsTab theme={theme} availableSymbols={availableSymbols} />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}
