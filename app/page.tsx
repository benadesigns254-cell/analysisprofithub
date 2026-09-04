"use client"

import { useState, useEffect, useMemo } from "react"
import { useDeriv } from "@/hooks/use-deriv"
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, User, AlertTriangle, Menu, TrendingUp, Layers, Eye, Hash, Clock, Activity, LayoutDashboard, Sliders, LineChart, Sparkles, Cpu, Terminal, Radio, Flame, Percent, CheckSquare, XCircle, HelpCircle, BrainCircuit, ArrowUpDown, ExternalLink } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import Image from 'next/image'
import { DigitDistribution } from "@/components/digit-distribution"
import { SignalsTab } from "@/components/tabs/signals-tab"
import { ProSignalsTab } from "@/components/tabs/pro-signals-tab"
import { EvenOddTab } from "@/components/tabs/even-odd-tab"
import { OverUnderTab } from "@/components/tabs/over-under-tab"
import { MoneyMakerTab as AdvancedOverUnderTab } from "@/components/tabs/advanced-over-under-tab"
import { MatchesTab } from "@/components/tabs/matches-tab"
import { DiffersTab } from "@/components/tabs/differs-tab"
import { StatisticalAnalysis } from "@/components/statistical-analysis"
import { LastDigitsChart } from "@/components/charts/last-digits-chart"
import { LastDigitsLineChart } from "@/components/charts/last-digits-line-chart"
import { HeritageSuperSignals } from "@/components/heritage-super-signals"
import { SuperSignalsTab } from "@/components/tabs/super-signals-tab"
import { DerivAuth } from "@/components/deriv-auth"
import { AutoBotTab } from "@/components/tabs/autobot-tab"
import { AutomatedTab } from "@/components/tabs/automated-tab"
import { SmartAuto24Tab } from "@/components/tabs/smartauto24-tab"
import { AdvancedSignalsTab } from "@/components/advanced-signals-tab"
import { useGlobalTradingContext } from "@/hooks/use-global-trading-context"
import { verifier } from "@/lib/system-verifier"
import { ResponsiveTabs } from "@/components/responsive-tabs"
import type { Variants } from 'framer-motion';
import { RiskDisclaimerModal } from "@/components/modals/risk-disclaimer-modal"
import { MarketSelector } from "@/components/market-selector"

import { FloatingAIScanner } from "@/components/floating-ai-scanner"
import { LiveChat } from "@/components/live-chat"
import { ApiTokenModal } from "@/components/api-token-modal"
import { useDerivAuth } from "@/hooks/use-deriv-auth"
import { SignalsHubTab } from "@/components/tabs/signals-hub-tab"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function DerivAnalysisApp() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [activeTab, setActiveTab] = useState("smart-analysis")
  const [digitChartRange, setDigitChartRange] = useState(25)
  const [initError, setInitError] = useState<string | null>(null)
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false)
  const [showRiskModal, setShowRiskModal] = useState(false)
  const [showAIScanner, setShowAIScanner] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [watchedDigits, setWatchedDigits] = useState<number[]>(() => {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem("deriv_watched_digits")
    return saved ? JSON.parse(saved) : []
  })
  const globalContext = useGlobalTradingContext()
  const { showTokenModal, submitApiToken, loginWithDeriv, loginWithDerivLegacy } = useDerivAuth()

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  // Wrapper to ensure OAuth login is properly triggered
  const handleOAuthLogin = () => {
    console.log("[v0] 🔐 Page: Triggering OAuth login...")
    try {
      loginWithDeriv()
    } catch (error) {
      console.error("[v0] ❌ Page: OAuth login error:", error)
    }
  }

  const {
    connectionStatus,
    currentPrice,
    currentDigit,
    tickCount,
    analysis,
    signals,
    proSignals,
    symbol,
    maxTicks,
    availableSymbols,
    connectionLogs,
    changeSymbol,
    changeMaxTicks,
    getRecentDigits,
  } = useDeriv("R_100")

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  useEffect(() => {
    try {
      document.documentElement.classList.add("dark")
      console.log("[v0] App initialization started")
      verifier.markComplete("Core System")
      console.log("[v0] App initialization completed successfully")
    } catch (error) {
      console.error("[v0] Initialization error:", error)
      setInitError(error instanceof Error ? error.message : "Unknown error")
    }

    // Risk modal is hidden on load, user can manually open it from header

    // Fetch site config
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(setSiteConfig)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("deriv_watched_digits", JSON.stringify(watchedDigits))
    }
  }, [watchedDigits])

  // Defensive filtering to prevent `.toString()` crashes in chart components
  const recent100DigitsRaw = getRecentDigits(100)
  const recent100Digits = useMemo(
    () => recent100DigitsRaw.filter((d: any) => d !== undefined && d !== null),
    [recent100DigitsRaw],
  )

  const recent50Digits = recent100Digits.length >= 50 ? recent100Digits.slice(-50) : recent100Digits
  const recent40Digits = recent100Digits.length >= 40 ? recent100Digits.slice(-40) : recent100Digits
  const recentDigits = recent100Digits.length >= 20 ? recent100Digits.slice(-20) : recent100Digits
  const chartDigits = useMemo(
    () => recent100Digits.slice(-digitChartRange),
    [recent100Digits, digitChartRange],
  )

  const activeSignals = (signals || []).filter((s) => s.status !== "NEUTRAL")
  const powerfulSignalsCount = activeSignals.filter((s) => s.status === "TRADE NOW").length

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-900 to-red-950">
        <div className="text-center p-8 bg-red-800/50 rounded-xl border border-red-500 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Initialization Error</h2>
          <p className="text-red-200 mb-6">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }


  return (
    <div
      className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-linear-to-br from-[#0a0e27] via-[#0f1629] to-[#1a1f3a]" : "bg-linear-to-br from-gray-50 via-white to-gray-100"}`}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col relative">
        {!siteConfig?.headerHidden && (
          <header
             className={`fixed top-0 left-0 right-0 z-[100] shrink-0 w-full transition-all duration-500 border-b ${theme === "dark"
               ? "bg-[#0a0a0a]/95 border-white/8"
               : "bg-white/98 border-gray-200"
               } backdrop-blur-xl`}
          >
            <div className="mx-auto w-full px-1 sm:px-3 lg:px-4">
              <div className="flex flex-nowrap items-center h-10 sm:h-12 gap-2 sm:gap-3 w-full justify-between overflow-hidden">

                {/* Left Sidebar Toggle */}
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 rounded-lg transition-all hidden sm:flex ${
                        theme === "dark" 
                          ? "bg-white/5 text-white hover:bg-white/10" 
                          : "bg-black/5 text-slate-900 hover:bg-black/10"
                      }`}
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className={`w-64 border-r overflow-y-auto ${
                      theme === "dark" 
                        ? "bg-[#0b0f19] text-white border-white/10" 
                        : "bg-white text-slate-900 border-slate-200"
                    } p-0`}
                  >
                    <div className="p-6 border-b border-white/5">
                      <SheetTitle className={theme === "dark" ? "text-white text-xl font-black uppercase tracking-tight" : "text-slate-900 text-xl font-black uppercase tracking-tight"}>
                        Navigation
                      </SheetTitle>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="p-4 border-b border-white/5 flex flex-col gap-2">
                      <Link href="/account" className="w-full">
                        <Button
                          variant="ghost"
                          className={`justify-start gap-3 w-full ${
                            theme === "dark"
                              ? "text-slate-300 hover:bg-white/5"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <User className="h-4 w-4" />
                          <span className="text-sm font-semibold">Account</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className={`justify-start gap-3 w-full ${
                          theme === "dark"
                            ? "text-slate-300 hover:bg-white/5"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                        onClick={() => setShowRiskModal(true)}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-semibold">Risk</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className={`justify-start gap-3 w-full ${
                          theme === "dark"
                            ? "text-slate-300 hover:bg-white/5"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                        onClick={toggleTheme}
                      >
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        <span className="text-sm font-semibold">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                      </Button>
                    </div>

                    {/* Navigation tabs in sidebar */}
                    <div className="flex flex-col gap-2 p-4">
                      {[
                        { id: "smart-analysis", label: "Smart Analysis", icon: LineChart },
                        { id: "smartauto24", label: "SmartAuto24", icon: Sparkles },
                        { id: "autobot", label: "Auto Bot", icon: Cpu },
                        { id: "automated", label: "Automated", icon: Terminal },
                        { id: "signals-hub", label: "Signals Hub", icon: Flame },
                        { id: "even-odd", label: "Even/Odd", icon: Hash },
                        { id: "over-under", label: "Over/Under", icon: ArrowUpDown },
                        { id: "advanced-over-under", label: "Advanced Over/Under", icon: Percent },
                        { id: "matches", label: "Matches", icon: CheckSquare },
                        { id: "differs", label: "Differs", icon: XCircle },
                      ].map(({ id, label, icon: IconComponent }) => (
                        <Button
                          key={id}
                          variant={activeTab === id ? "default" : "ghost"}
                          className={`justify-start gap-3 h-10 ${
                            activeTab === id
                              ? theme === "dark"
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                              : theme === "dark"
                                ? "text-slate-300 hover:bg-white/5"
                                : "text-slate-600 hover:bg-slate-100"
                          }`}
                          onClick={() => {
                            setActiveTab(id)
                            setSidebarOpen(false)
                          }}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm font-semibold">{label}</span>
                        </Button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex-1" />

                <div className="flex items-center gap-2 shrink-0">
                  {/* Network Status Bars */}
                  <div className="flex items-center gap-0.5">
                    <div className={`h-2 w-0.5 rounded-sm transition-all ${theme === "dark" ? "bg-green-500/60" : "bg-green-600/60"}`} />
                    <div className={`h-2.5 w-0.5 rounded-sm transition-all ${theme === "dark" ? "bg-green-500/80" : "bg-green-600/80"}`} />
                    <div className={`h-3 w-0.5 rounded-sm transition-all ${theme === "dark" ? "bg-green-500" : "bg-green-600"}`} />
                  </div>

                  <DerivAuth theme={theme} />
                </div>
              </div>

              <div className="px-1 sm:px-3 flex items-center justify-start gap-1 py-0 overflow-x-auto no-scrollbar bg-[#0b1b33]">
                {/* Navigation Tabs */}
                <ResponsiveTabs theme={theme} value={activeTab} onValueChange={setActiveTab}>
                        {[
                          "smart-analysis",
                          "smartauto24",
                          "autobot",
                          "automated",
                          "signals-hub",
                          "even-odd",
                          "over-under",
                          "advanced-over-under",
                          "matches",
                          "differs",
                        ].filter(tab => !siteConfig?.hiddenTabs?.includes(tab)).map((tab) => {
                          const tabLabels: Record<string, string> = {
                            "smart-analysis": "Smart Analysis",
                            "smartauto24": "SmartAuto24",
                            "autobot": "Auto Bot",
                            "automated": "Automated",
                            "signals-hub": "Signals Hub",
                            "even-odd": "Even/Odd",
                            "over-under": "Over/Under",
                            "advanced-over-under": "Advanced Over/Under",
                            "matches": "Matches",
                            "differs": "Differs",
                          }
                          const tabIcons: Record<string, any> = {
                            "smart-analysis": LineChart,
                            "smartauto24": Sparkles,
                            "autobot": Cpu,
                            "automated": Terminal,
                            "signals-hub": Flame,
                            "even-odd": Hash,
                            "over-under": ArrowUpDown,
                            "advanced-over-under": Percent,
                            "matches": CheckSquare,
                            "differs": XCircle,
                          }
                          const IconComponent = tabIcons[tab]
                          return (
                          <TabsTrigger
                            key={tab}
                            value={tab}
                            className={`shrink-0 rounded-md text-[10px] h-10 px-4 whitespace-nowrap transition-colors duration-200 font-semibold flex items-center gap-2 border border-transparent ${activeTab === tab
                              ? theme === "dark"
                                ? tab === "signals-hub"
                                  ? "bg-[#17345b] text-cyan-300 font-bold shadow-sm"
                                  : "bg-[#17345b] text-white shadow-sm"
                                : "bg-[#17345b] text-white shadow-sm"
                              : "text-slate-400 hover:text-white hover:bg-white/10"
                              }`}
                            onClick={(e) => {
                              e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
                            }}
                          >
                            {IconComponent && <IconComponent className="h-3 w-3 shrink-0" />}
                            <span className={`hidden sm:inline ${tab === "over-under" ? "text-white" : ""}`}>{tabLabels[tab] || tab}</span>
                          </TabsTrigger>
                        )
                        })}
                </ResponsiveTabs>
              </div>

              {/* Floating market price card beneath the tabs */}
              <div className="flex w-full justify-center px-2 py-1">
                <div className={`flex max-w-full items-center justify-center gap-2 rounded-xl border p-1 shadow-lg ${theme === "dark"
                  ? "border-blue-400/25 bg-[#0b1428]/95 shadow-blue-950/30"
                  : "border-slate-200 bg-white shadow-slate-200/70"
                  }`}>
                  {/* Market Selection */}
                  {availableSymbols.length > 0 && (
                    <div className={`flex h-8 min-w-[150px] items-center rounded-lg border px-2 ${theme === "dark"
                      ? "border-cyan-400/25 bg-cyan-400/[0.06]"
                      : "border-cyan-200 bg-cyan-50"
                      }`}>
                      <MarketSelector
                        symbols={availableSymbols}
                        currentSymbol={symbol}
                        onSymbolChange={changeSymbol}
                        theme={theme}
                      />
                    </div>
                  )}

                  {/* Price */}
                  <div className={`flex h-8 items-center rounded-lg border px-3 ${theme === "dark"
                    ? "border-blue-400/25 bg-blue-500/[0.08]"
                    : "border-blue-200 bg-blue-50"
                    }`}>
                    <span className={`text-sm font-black tabular-nums ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>
                      {currentPrice?.toFixed(4) || "0.0000"}
                    </span>
                  </div>

                  {/* Last Digit */}
                  <div className={`flex h-8 min-w-9 items-center justify-center rounded-lg border px-3 ${theme === "dark"
                    ? "border-orange-400/35 bg-orange-500/[0.12]"
                    : "border-orange-200 bg-orange-50"
                    }`}>
                    <span className={`text-base font-black ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>
                      {currentDigit ?? "0"}
                    </span>
                  </div>

                {/* Ticks */}
                <div className={`flex items-center gap-1 px-1.5 h-6 rounded-md border shrink-0 ${theme === "dark"
                  ? "bg-white/[0.03] border-white/10"
                  : "bg-gray-50 border-gray-200"
                  }`}>
                  <span className={`text-xs font-black tabular-nums ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                    {(tickCount || 0).toLocaleString()}
                  </span>
                  <select
                    value={maxTicks}
                    onChange={(e) => changeMaxTicks(Number(e.target.value))}
                    className={`bg-transparent text-[7px] font-black focus:outline-hidden cursor-pointer appearance-none ml-0.5 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {[25, 60, 100, 250, 500, 1000, 2500, 5000].map(v => (
                      <option key={v} value={v} className={theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* Watch */}
                <div className={`flex items-center gap-0.5 px-1.5 h-7 rounded-md border shrink-0 ${theme === "dark"
                  ? "bg-white/[0.03] border-white/10"
                  : "bg-gray-50 border-gray-200"
                  }`}>
                  <Eye className="h-2.5 w-2.5 text-amber-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="D"
                    className={`bg-transparent text-[7px] font-black w-[18px] focus:outline-hidden text-center placeholder:text-slate-600 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}
                    value={watchedDigits.join(',')}
                    onChange={(e) => {
                      const val = e.target.value;
                      const digits = val.split(',')
                        .map(d => parseInt(d.trim()))
                        .filter(d => !isNaN(d) && d >= 0 && d <= 9);
                      setWatchedDigits([...new Set(digits)]);
                    }}
                  />
                </div>
              </div>
            </div>
            </div>
          </header>
        )}

        <main className="flex-1 pt-12 sm:pt-16 pb-4 px-1 sm:px-4 space-y-2 sm:space-y-4 max-w-7xl mx-auto w-full">
          {connectionStatus === "disconnected" && tickCount === 0 ? (
            <div className="text-center py-12 sm:py-20 md:py-32">
              <h2
                className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Connection Failed
              </h2>
              <p className={`text-sm sm:text-base md:text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Unable to connect to Deriv. Please check your internet connection and refresh the page.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold"
              >
                Retry Connection
              </Button>
            </div>
          ) : (
            <>
              {connectionStatus === "reconnecting" && (
                <div className="absolute top-0 left-0 right-0 z-50 bg-yellow-500/20 backdrop-blur-md p-2 text-center text-xs font-bold text-yellow-500 border-b border-yellow-500/30 animate-pulse">
                  Reconnecting to Deriv API... Some data may be delayed.
                </div>
              )}
              <TabsContent value="smart-analysis" className="mt-0 space-y-2 sm:space-y-3 md:space-y-4">

                {analysis && analysis.digitFrequencies && (
                  <div
                    className={`rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border ${theme === "dark" ? "bg-linear-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "bg-white border-gray-200 shadow-lg"}`}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3">
                      <h3
                        className={`text-sm sm:text-lg md:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        Digits Distribution
                      </h3>
                    </div>

                    <DigitDistribution
                      frequencies={analysis.digitFrequencies}
                      currentDigit={currentDigit}
                      theme={theme}
                      watchedDigits={watchedDigits}
                    />
                  </div>
                )}

                {analysis && recent100Digits.length > 0 && recentDigits.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-4">
                    <div
                    className={`lg:col-span-2 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border ${theme === "dark" ? "bg-linear-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-purple-500/25 shadow-[0_0_30px_rgba(139,92,246,0.18)]" : "bg-white border-gray-200 shadow-lg"}`}
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className={`text-sm sm:text-base md:text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Last Digits Line Chart</h3>
                        <p className={`mt-1 text-xs ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>Showing the latest {digitChartRange} digits</p>
                      </div>
                      <div className="flex items-center gap-3 sm:w-56">
                        <span className="text-xs font-bold text-cyan-400">25</span>
                        <input
                          type="range"
                          min="25"
                          max="50"
                          step="25"
                          value={digitChartRange}
                          onChange={(event) => setDigitChartRange(Number(event.target.value))}
                          aria-label="Choose digit chart range"
                          className="h-2 flex-1 cursor-pointer accent-cyan-400"
                        />
                        <span className="text-xs font-bold text-cyan-400">50</span>
                      </div>
                    </div>
                    <LastDigitsLineChart digits={chartDigits} />

                    <div className="mt-5 border-t border-white/10 pt-5">
                      <h3 className={`mb-3 text-sm sm:text-base md:text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Last 50 Digits Chart</h3>
                      <LastDigitsChart digits={recent50Digits} />
                    </div>
                  </div>
                  </div>
                )}

                {analysis && recent100Digits.length > 0 && (
                  <div
                    className={`rounded-lg sm:rounded-xl p-6 border ${theme === "dark" ? "bg-linear-to-br from-[#0f1629]/80 to-[#1a2235]/80 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : "bg-white border-gray-200 shadow-lg"}`}
                  >
                    <StatisticalAnalysis analysis={analysis} recentDigits={recent100Digits} theme={theme} />
                  </div>
                )}

                {analysis && analysis.digitFrequencies && analysis.powerIndex && (
                  <div
                    className={`rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border ${theme === "dark" ? "bg-linear-to-br from-green-500/10 to-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "bg-green-50 border-green-200 shadow-lg"}`}
                  >
                    <h3
                      className={`text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      Frequency Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div
                        className={`text-center rounded-lg p-2 sm:p-3 md:p-4 border ${theme === "dark" ? "bg-blue-500/10" : "bg-blue-50"}`}
                      >
                        <div
                          className={`text-xs sm:text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Most Frequent
                        </div>
                        <div
                          className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                        >
                          {analysis.powerIndex.strongest}
                        </div>
                        <div
                          className={`mt-1 text-xs sm:text-sm md:text-base font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                        >
                          {analysis.digitFrequencies[analysis.powerIndex.strongest]?.percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div
                        className={`text-center rounded-lg p-2 sm:p-3 md:p-4 border ${theme === "dark" ? "bg-red-500/10" : "bg-red-50"}`}
                      >
                        <div
                          className={`text-xs sm:text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Least Frequent
                        </div>
                        <div
                          className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
                        >
                          {analysis.powerIndex.weakest}
                        </div>
                        <div
                          className={`mt-1 text-xs sm:text-sm md:text-base font-bold ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
                        >
                          {analysis.digitFrequencies[analysis.powerIndex.weakest]?.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="signals-hub" className="mt-0">
                <SignalsHubTab
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
                  onMaxTicksChange={changeMaxTicks}
                  onSymbolChange={changeSymbol}
                  recentDigits={recentDigits}
                />
              </TabsContent>

              <TabsContent value="even-odd" className="mt-0">
                {analysis && (
                  <EvenOddTab
                    analysis={analysis}
                    signals={signals}
                    currentDigit={currentDigit}
                    currentPrice={currentPrice}
                    recentDigits={recent40Digits}
                    theme={theme}
                    symbol={symbol}
                    availableSymbols={availableSymbols}
                    onSymbolChange={changeSymbol}
                    tickCount={tickCount}
                  />
                )}
              </TabsContent>

              <TabsContent value="over-under" className="mt-0">
                {analysis && (
                  <OverUnderTab
                    analysis={analysis}
                    signals={signals}
                    currentDigit={currentDigit}
                    currentPrice={currentPrice}
                    recentDigits={recent50Digits}
                    theme={theme}
                    symbol={symbol}
                    availableSymbols={availableSymbols}
                    onSymbolChange={changeSymbol}
                    tickCount={tickCount}
                  />
                )}
              </TabsContent>

              <TabsContent value="advanced-over-under" className="mt-0">
                {analysis && (
                  <AdvancedOverUnderTab
                    theme={theme}
                    recentDigits={recent50Digits}
                  />
                )}
              </TabsContent>

              <TabsContent value="matches" className="mt-0">
                {analysis && (
                  <MatchesTab analysis={analysis} signals={signals} recentDigits={recentDigits} theme={theme} symbol={symbol} currentPrice={currentPrice} currentDigit={currentDigit} tickCount={tickCount} maxTicks={maxTicks} onMaxTicksChange={changeMaxTicks} />
                )}
              </TabsContent>

              <TabsContent value="differs" className="mt-0">
                {analysis && (
                  <DiffersTab analysis={analysis} signals={signals} recentDigits={recentDigits} theme={theme} symbol={symbol} currentPrice={currentPrice} currentDigit={currentDigit} tickCount={tickCount} maxTicks={maxTicks} onMaxTicksChange={changeMaxTicks} />
                )}
              </TabsContent>

              <TabsContent value="autobot" className="mt-0">
                <AutoBotTab theme={theme} symbol={symbol} />
              </TabsContent>

              <TabsContent value="automated" className="mt-0">
                <AutomatedTab theme={theme} symbol={symbol} />
              </TabsContent>

              <TabsContent value="smartauto24" className="mt-0">
                <SmartAuto24Tab
                  theme={theme}
                  symbol={symbol}
                  onSymbolChange={changeSymbol}
                  availableSymbols={availableSymbols}
                  maxTicks={maxTicks}
                  onMaxTicksChange={changeMaxTicks}
                />
              </TabsContent>

            </>
          )}
        </main>
      </Tabs>

      {!siteConfig?.footerHidden && (
        <footer
          className={`mt-4 py-3 transition-all duration-300 border-t ${theme === "dark"
            ? "bg-[#0a0a0a] border-white/8"
            : "bg-gray-50 border-gray-200"
            }`}
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-bold text-slate-800 dark:text-gray-400">analysistoolpro © 2026</span>
                <button onClick={() => setIsDisclaimerOpen(true)} className="hover:text-blue-500 transition-colors">Risk Disclaimer</button>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Unified Risk Disclaimer Modal */}
      <RiskDisclaimerModal
        isOpen={isDisclaimerOpen || showRiskModal}
        onClose={() => {
          setIsDisclaimerOpen(false)
          setShowRiskModal(false)
        }}
        onAccept={() => {
          localStorage.setItem("deriv_risk_accepted", "true")
          setIsDisclaimerOpen(false)
          setShowRiskModal(false)
        }}
        theme={theme}
      />

      {/* Floating AI Scanner */}
      {showAIScanner && (
        <FloatingAIScanner 
          theme={theme} 
          availableSymbols={availableSymbols}
          onScanComplete={(results) => {
            console.log("[v0] AI Scanner results:", results)
          }}
        />
      )}

      {/* API Token Modal */}
      <ApiTokenModal
        open={showTokenModal}
        onSubmit={submitApiToken}
        onOAuthLogin={handleOAuthLogin}
        onLegacyOAuthLogin={loginWithDerivLegacy}
        theme={theme}
      />
    </div>
  )
}
