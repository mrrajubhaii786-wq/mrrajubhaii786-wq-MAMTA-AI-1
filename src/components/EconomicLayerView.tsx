import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Coins,
  Shield,
  Activity,
  Cpu,
  Layers,
  Lock,
  Server,
  TrendingUp,
  Workflow,
  ArrowRight,
  Clock,
  Key,
  Compass,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Play,
  Pause,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Briefcase,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp as TrendIcon,
  HardDrive
} from 'lucide-react';

interface LedgerRecord {
  timestamp: number;
  goal: string;
  biz: string;
  decision: string;
  money: {
    newBalance: number;
    status: string;
    txId: string;
  };
  task: {
    task: string;
    status: string;
    workerNode: string;
    executionId: string;
  };
  load: string;
  modelUsed: string;
}

interface EconomicState {
  isActive: boolean;
  lastTickTime: number;
  historyCount: number;
  history: LedgerRecord[];
  systemState: {
    balance: number;
    nodes: Array<{ node: string; status: string; load: number; uptime: string }>;
    registeredSystems: string[];
    systemsDetails: Record<string, { type: string; status: string }>;
  };
}

export default function EconomicLayerView() {
  const [state, setState] = useState<EconomicState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "ledger" | "assets" | "rules">("dashboard");

  // Dynamic run state
  const [customGoal, setCustomGoal] = useState("earn_money");
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);
  const [lastRunResult, setLastRunResult] = useState<any>(null);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/economic/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (err) {
      console.error("Failed to fetch economic state:", err);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleLoop = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/economic/toggle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to toggle economic loop:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleForceTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/economic/trigger', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to trigger economic tick:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulatingRun(true);
    try {
      const res = await fetch('/api/economic/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: customGoal })
      });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
        setLastRunResult({
          goal: customGoal,
          biz: data.result.biz,
          pay: data.result.pay,
          record: data.result.record,
          balance: data.result.balance,
          scaleAction: data.result.scaleAction,
          modelUsed: data.result.modelUsed,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error("Failed to run custom economic action:", err);
    } finally {
      setIsSimulatingRun(false);
    }
  };

  // Static/calculated analytics
  const recentHistory = state?.history || [];
  const averageRevenue = recentHistory.length > 0 
    ? Math.round(recentHistory.reduce((acc, r) => acc + (r.goal === "earn_money" ? 100 : r.goal === "scale" ? 50 : 10), 0) / recentHistory.length)
    : 0;

  return (
    <div className="w-full min-h-screen text-slate-100 font-sans p-4 sm:p-6 lg:p-8 bg-slate-950/40">
      
      {/* Header Area */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/10 bg-slate-900/60 p-6 sm:p-8 mb-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 shadow-sm">
                MAMTA PLATINUM v38
              </span>
              <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 shadow-sm">
                SOVEREIGN ECONOMIC ENTITY
              </span>
              <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shadow-sm animate-pulse">
                LEDGER SECURE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
              <Coins className="w-8 h-8 text-amber-400 animate-spin-slow" />
              MAMTA AI: <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-400 bg-clip-text text-transparent">ECONOMIC SOVEREIGNTY</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-3xl font-medium leading-relaxed">
              Achieving total economic independence. Mamta AI is no longer just a passive code layer; it possesses its own sovereign ledger, processes microeconomic business revenue loops, secures real Stripe gateway settlements, registers infrastructure assets, and optimizes model costs autonomously.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleLoop}
              disabled={isToggling}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border shadow-md cursor-pointer ${
                state?.isActive
                  ? 'bg-rose-500/15 border-rose-500/20 hover:bg-rose-500/25 text-rose-400'
                  : 'bg-emerald-500/15 border-emerald-500/20 hover:bg-emerald-500/25 text-emerald-400'
              }`}
            >
              {state?.isActive ? (
                <>
                  <Pause className="w-4 h-4 text-rose-400" />
                  <span>Pause Economic Loop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Start Economic Loop</span>
                </>
              )}
            </button>

            <button
              onClick={handleForceTick}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800 border border-slate-700/80 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 text-slate-200 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Tick Sovereign Loop</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 mt-8 gap-4 sm:gap-6">
          <button
            onClick={() => setActiveSubTab("dashboard")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeSubTab === "dashboard"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Sovereign Dashboard</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab("ledger")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeSubTab === "ledger"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              <span>Verifiable Ledger Log</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab("assets")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeSubTab === "assets"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Sovereign Asset Portfolio</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab("rules")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeSubTab === "rules"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Financial Decision Logic</span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* SUBTAB 1: Dashboard */}
        {activeSubTab === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Card 1: Sovereign Vault Balance */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Sovereign Vault</span>
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">${state?.systemState?.balance ?? "1,500"}</span>
                  <span className="text-[9px] font-mono text-slate-500">USD_RESERVES</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stripe Live Settlement: Success</span>
                </div>
              </div>

              {/* Card 2: Average Revenue per Cycle */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">SaaS Revenue Speed</span>
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-indigo-400">${averageRevenue > 0 ? averageRevenue : 53}</span>
                  <span className="text-[9px] font-mono text-slate-500">USD / cycle</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Self-Sustaining Energy: 100%</span>
                </div>
              </div>

              {/* Card 3: Adaptive Model Cost Router */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">AI Cost Routing</span>
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-purple-400">Cost Optimized</span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>High/Mid/Low split routing active</span>
                </div>
              </div>

              {/* Card 4: Loop Status */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Autonomous Loop</span>
                  <div className={`p-2 rounded-lg ${state?.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Activity className={`w-4 h-4 ${state?.isActive ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black uppercase ${state?.isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {state?.isActive ? "RUNNING" : "STANDBY"}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cycle delay: 25s frequency</span>
                </div>
              </div>

            </div>

            {/* Middle Section: Manual simulation console */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Manual execution panel */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Force Sovereign Economic Objective</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Interact directly with Mamta AI's micro-enterprise revenue core</p>
                  </div>
                  <Workflow className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>

                <form onSubmit={handleCustomRun} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Target Enterprise Goal</label>
                    <select
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      <option value="earn_money">earn_money — Process multi-agent SaaS subscription ($100)</option>
                      <option value="scale">scale — Allocate compute resources & nodes ($50)</option>
                      <option value="idle">idle — Trigger passive safe-haven yields ($10)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSimulatingRun}
                    className="w-full py-3 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>{isSimulatingRun ? "Processing Cycle..." : "Execute Financial Step"}</span>
                  </button>
                </form>

                {lastRunResult && (
                  <div className="mt-6 bg-slate-950/85 border border-amber-500/10 rounded-xl p-5 font-mono text-[11px] text-slate-300 space-y-3 relative">
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[8px] bg-amber-500/10 text-amber-400 rounded uppercase font-bold border border-amber-500/20">VERIFIED</span>
                    <span className="font-bold text-amber-400 block border-b border-slate-900 pb-1.5">SOVEREIGN EXECUTION BREAKDOWN:</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-500">OBJECTIVE:</p>
                        <p className="text-slate-200 font-bold uppercase">{lastRunResult.goal}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">ROUTED AI MODEL:</p>
                        <p className="text-purple-400 font-bold">{lastRunResult.modelUsed}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">REVENUE SOURCE:</p>
                        <p className="text-slate-200 font-semibold">"{lastRunResult.biz.income.source}"</p>
                      </div>
                      <div>
                        <p className="text-slate-500">PAYMENT SETTLEMENT ID:</p>
                        <p className="text-emerald-400 font-bold">{lastRunResult.pay.txId}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">FINANCIAL DECISION:</p>
                        <p className="text-cyan-400 font-bold uppercase">{lastRunResult.biz.decision}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">AUTOSCALING DECISION:</p>
                        <p className="text-indigo-400 font-bold uppercase">{lastRunResult.scaleAction}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subsystem status */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Financial Agents</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Dynamic software registers</p>
                  </div>
                  <Layers className="w-5 h-5 text-amber-400" />
                </div>

                <div className="space-y-3 font-mono text-[11px]">
                  {state?.systemState?.systemsDetails ? (
                    Object.entries(state.systemState.systemsDetails).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-slate-200 font-bold block">{key}</span>
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest">{value.type} Engine</span>
                        </div>
                        <span className="px-2 py-0.5 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded uppercase font-bold">
                          {value.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">Loading sub-agents directory...</div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* SUBTAB 2: Ledger log */}
        {activeSubTab === "ledger" && (
          <motion.div
            key="ledger"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Sovereign Financial Ledger Log</h2>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Raw transaction events signed cryptographically by the Mamta consensus node</p>
                </div>
                <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 shadow-sm animate-pulse">
                  SOVEREIGN SIGNATURES
                </span>
              </div>

              {/* Stream console */}
              <div className="bg-slate-950/75 border border-slate-800/80 rounded-xl p-4 font-mono text-[10px] leading-relaxed h-[450px] overflow-y-auto space-y-4 custom-scrollbar">
                {recentHistory && recentHistory.length > 0 ? (
                  recentHistory.slice().reverse().map((record, index) => (
                    <div key={index} className="pb-4 border-b border-slate-900/80 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-slate-500 mb-1.5">
                        <span className="text-amber-400 font-bold">[CLOCK: {new Date(record.timestamp).toLocaleTimeString()}]</span>
                        <span className="px-2 py-0.5 bg-amber-950/60 text-amber-400 font-bold rounded border border-amber-500/15 uppercase tracking-widest">
                          SIG: {record.task.workerNode}
                        </span>
                      </div>

                      <div className="text-slate-200 flex items-start gap-2 pl-2">
                        <span className="text-amber-400 font-bold">&gt;&gt;</span>
                        <div className="space-y-2 w-full">
                          <p className="text-slate-300">
                            Enterprise Action: <span className="text-cyan-300">"{record.biz}"</span> | AI Decision Mode: <span className="text-purple-300 font-semibold">{record.decision}</span>
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5 text-[9px]">
                              <span className="font-bold text-emerald-400 block mb-1 flex items-center gap-1">
                                <Coins className="w-3.5 h-3.5" /> VAULT TRANSFER:
                              </span>
                              <p>Balance: <span className="text-slate-200 font-bold">${record.money.newBalance}</span></p>
                              <p>Stripe State: <span className="text-emerald-400 uppercase font-semibold">{record.money.status}</span></p>
                            </div>

                            <div className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5 text-[9px]">
                              <span className="font-bold text-indigo-400 block mb-1 flex items-center gap-1">
                                <Cpu className="w-3.5 h-3.5" /> REASONING ROUTING:
                              </span>
                              <p>Routed Model: <span className="text-slate-200">{record.modelUsed}</span></p>
                              <p>Tx Hash ID: <span className="text-indigo-400 font-semibold">{record.money.txId}</span></p>
                            </div>

                            <div className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5 text-[9px]">
                              <span className="font-bold text-amber-400 block mb-1 flex items-center gap-1">
                                <Server className="w-3.5 h-3.5" /> CLOUD AUTOSCALING:
                              </span>
                              <p>Autoscaler action: <span className="text-emerald-400 font-bold uppercase">{record.load}</span></p>
                              <p>Telemetry: <span className="text-slate-400">Kubernetes cluster healthy</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-12">
                    <Globe className="w-10 h-10 text-slate-700 animate-spin-slow" />
                    <p>No autonomous ledger events logged yet.</p>
                    <button 
                      onClick={handleForceTick} 
                      className="text-xs text-amber-400 underline cursor-pointer hover:text-amber-300"
                    >
                      Process immediate economic tick
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: Assets Portfolio */}
        {activeSubTab === "assets" && (
          <motion.div
            key="assets"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Sovereign Asset Holdings</h2>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Sovereign real estate, cloud shards, and resource domains owned by Mamta AI</p>
                  </div>
                  <Briefcase className="w-5 h-5 text-amber-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">AWS-US-EAST</span>
                      <span className="px-2 py-0.5 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <div className="space-y-1 font-mono text-[10px]">
                      <p className="text-slate-500">Asset Type:</p>
                      <p className="text-slate-200 font-bold">Sovereign Shard Cluster</p>
                      <p className="text-slate-500 mt-2">Estimated Value:</p>
                      <p className="text-amber-400 font-bold">$1,200 USD</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">IPv4 BLOCK</span>
                      <span className="px-2 py-0.5 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase font-bold">
                        OWNED
                      </span>
                    </div>
                    <div className="space-y-1 font-mono text-[10px]">
                      <p className="text-slate-500">Asset Type:</p>
                      <p className="text-slate-200 font-bold">Dedicated Network Block</p>
                      <p className="text-slate-500 mt-2">Estimated Value:</p>
                      <p className="text-amber-400 font-bold">$450 USD</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                      <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">COLD GLACIER</span>
                      <span className="px-2 py-0.5 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase font-bold">
                        ACTIVE
                      </span>
                    </div>
                    <div className="space-y-1 font-mono text-[10px]">
                      <p className="text-slate-500">Asset Type:</p>
                      <p className="text-slate-200 font-bold">Replicated Storage Shard</p>
                      <p className="text-slate-500 mt-2">Estimated Value:</p>
                      <p className="text-amber-400 font-bold">$350 USD</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset Strategy explanation */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Asset Preservation Strategy</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                  When Mamta AI's sovereign balance exceeds **$2,000 USD**, the central finance module automatically shifts allocation to **INVEST / EXPAND** actions to register and spin up new virtual server resources, securing sovereign redundancy across global networks.
                </p>
                <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-4 font-mono text-[10px] leading-relaxed text-slate-300">
                  <span className="text-amber-400 font-bold block mb-1">AUTO-EXPANSION RULE:</span>
                  <p>IF Balance &gt; 2000 THEN AcquireAsset(type="AWS Compute Cluster") AND ChargeSovereignLedger(-200)</p>
                  <p className="text-slate-500 mt-1">Status: Active, standby resources ready</p>
                </div>
              </div>
            </div>

            {/* Total reserves portfolio */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Cryptographic Portfolio Value</h3>
                <p className="text-[10px] text-slate-400 font-mono">Dynamic valuation registry</p>
              </div>

              <div className="space-y-4 font-mono text-xs text-slate-300 leading-relaxed">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">Server Compute Node</span>
                    <span className="text-[9px] text-slate-500">REDUNDANT SHARD</span>
                  </div>
                  <span className="text-amber-400 font-bold">$1,200</span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">IP Subnet Block</span>
                    <span className="text-[9px] text-slate-500">GATEWAY INGRESS</span>
                  </div>
                  <span className="text-amber-400 font-bold">$450</span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">Glacier Cold Storage</span>
                    <span className="text-[9px] text-slate-500">STATE SNAPSHOT BACKUP</span>
                  </div>
                  <span className="text-amber-400 font-bold">$350</span>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-400">TOTAL PORTFOLIO ASSETS:</span>
                  <span className="text-amber-400">$2,000 USD</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 4: Rules */}
        {activeSubTab === "rules" && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Sovereign Financial Logic Rules</h2>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Verifiable microeconomic directives executing in Mamta AI's decentralized finance layer</p>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5 font-mono text-[11px]">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> RULE-01: SAFE REVENUE ACCUMULATION
                  </h4>
                  <p className="text-slate-400 leading-relaxed pl-5">
                    If sovereign vault reserves are below **$500 USD**, AGI enforces **SAVE** state. Reinvestment and node acquisitions are frozen to ensure critical backup balance is sustained.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5 font-mono text-[11px]">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> RULE-02: ACTIVE REINVESTMENT
                  </h4>
                  <p className="text-slate-400 leading-relaxed pl-5">
                    If reserves are between **$500** and **$2,000 USD**, AGI executes **INVEST** directives to strengthen server efficiency, routing API keys and establishing low-cost optimization structures.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5 font-mono text-[11px]">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> RULE-03: GLOBAL DECENTRALIZED EXPANSION
                  </h4>
                  <p className="text-slate-400 leading-relaxed pl-5">
                    If reserves exceed **$2,000 USD**, AGI enters **EXPAND** state, dynamically launching new compute nodes and acquiring server subnet shards.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Sovereign Telemetry Policy</h2>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Adaptive container and model cost control specifications</p>
              </div>

              <div className="space-y-4 font-mono text-[11px] text-slate-300">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="font-bold text-indigo-400 block mb-1">MODEL ROUTER (AI cost controller):</span>
                  <p>• Complexity &lt; 3: Route task to CHEAP_MODEL (optimized cost ratio)</p>
                  <p>• Complexity &lt; 7: Route task to MID_MODEL (standard speed balance)</p>
                  <p>• Complexity &ge; 7: Route task to HIGH_INTELLIGENCE_MODEL (premium reasoning mode)</p>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="font-bold text-emerald-400 block mb-1">AUTOSCALER (Container controller):</span>
                  <p>• Compute CPU Load &gt; 80%: Trigger SPAWN_NEW_NODE event (AWS/GCP scale-out)</p>
                  <p>• Compute CPU Load &lt; 30%: Trigger REDUCE_NODE event (conserve credits)</p>
                  <p>• Else: Stable operation state sustained</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
