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
  HelpCircle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  CheckCircle,
  Play,
  Pause,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign
} from 'lucide-react';

interface EcoLoopRecord {
  timestamp: number;
  goal: string;
  biz: string;
  money: {
    newBalance: number;
    timestamp: number;
    status: string;
  };
  task: {
    task: string;
    status: string;
    workerNode: string;
    executionId: string;
  };
  load: string;
}

interface EcosystemState {
  isActive: boolean;
  lastTickTime: number;
  historyCount: number;
  history: EcoLoopRecord[];
  systemState: {
    balance: number;
    nodes: Array<{ node: string; status: string; load: number; uptime: string }>;
    registeredSystems: string[];
    systemsDetails: Record<string, { type: string; status: string }>;
  };
}

export default function EcosystemLayerView() {
  const [state, setState] = useState<EcosystemState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "loop" | "credentials" | "nodes">("dashboard");

  // Production connector input state
  const [targetService, setTargetService] = useState("gemini_api");
  const [prodApiKey, setProdApiKey] = useState("");
  const [connResult, setConnResult] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Production OAuth Validation state
  const [targetDomain, setTargetDomain] = useState("https://mamta-ai-saas.com");
  const [oauthResult, setOauthResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Manual transaction simulation input
  const [customGoal, setCustomGoal] = useState("earn_money");
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/ecosystem/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (err) {
      console.error("Failed to fetch ecosystem state:", err);
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
      const res = await fetch('/api/ecosystem/toggle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to toggle ecosystem loop:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleForceTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ecosystem/trigger', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to trigger ecosystem tick:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulatingRun(true);
    try {
      const res = await fetch('/api/ecosystem/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: customGoal })
      });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
        // Alert of result
        setConnResult({
          type: "ECO_SIMULATION_SUCCESS",
          message: `Ecosystem executed goal [${customGoal}]. Resulting biz action: "${data.result.biz}". Ledger status: ${data.result.money.status}.`
        });
      }
    } catch (err) {
      console.error("Failed to run ecosystem custom action:", err);
    } finally {
      setIsSimulatingRun(false);
    }
  };

  const handleConnectLive = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setConnResult(null);
    try {
      const res = await fetch('/api/ecosystem/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: targetService, apiKey: prodApiKey })
      });
      if (res.ok) {
        const data = await res.json();
        setConnResult(data);
      }
    } catch (err) {
      console.error("Failed to connect live service:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleValidateOAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setOauthResult(null);
    try {
      const res = await fetch('/api/ecosystem/oauth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: targetDomain })
      });
      if (res.ok) {
        const data = await res.json();
        setOauthResult(data);
      }
    } catch (err) {
      console.error("Failed to validate oauth domain:", err);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full min-h-screen text-slate-100 font-sans p-4 sm:p-6 lg:p-8 bg-slate-950/40">
      
      {/* Header Area */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/10 bg-slate-900/60 p-6 sm:p-8 mb-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 shadow-sm">
                MAMTA CORE SYSTEM v37
              </span>
              <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shadow-sm">
                SELF-GOVERNING AGI ECOSYSTEM
              </span>
              <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 shadow-sm animate-pulse">
                AUTONOMOUS SYSTEM ONLINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
              <Globe className="w-8 h-8 text-indigo-400 animate-spin-slow" />
              MAMTA AI: <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">ECOSYSTEM CORE</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-3xl font-medium">
              Evolving past assistive workflows. Mamta AI operates as a self-sustaining ecosystem administrator: managing cloud server load, processing microeconomic transaction loops, triggering business automation plans, and securing live production endpoints dynamically.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleLoop}
              disabled={isToggling}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border shadow-md cursor-pointer ${
                state?.isActive
                  ? 'bg-amber-500/15 border-amber-500/20 hover:bg-amber-500/25 text-amber-400'
                  : 'bg-emerald-500/15 border-emerald-500/20 hover:bg-emerald-500/25 text-emerald-400'
              }`}
            >
              {state?.isActive ? (
                <>
                  <Pause className="w-4 h-4 text-amber-400" />
                  <span>Pause Eco Loop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Start Eco Loop</span>
                </>
              )}
            </button>

            <button
              onClick={handleForceTick}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800 border border-slate-700/80 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 text-slate-200 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Force Ecosystem Run</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 mt-8 gap-4 sm:gap-6">
          <button
            onClick={() => setActiveSubTab("dashboard")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeSubTab === "dashboard"
                ? "border-indigo-400 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Ecosystem Dashboard</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab("loop")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeSubTab === "loop"
                ? "border-indigo-400 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              <span>Ecosystem Stream Logs</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab("nodes")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeSubTab === "nodes"
                ? "border-indigo-400 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>Multi-Cloud Node Clusters</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab("credentials")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeSubTab === "credentials"
                ? "border-indigo-400 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Production Connectors</span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* SUBTAB 1: Ecosystem Dashboard */}
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
              
              {/* Card 1: Microeconomy Balance */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Ecosystem Vault</span>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-emerald-400">${state?.systemState?.balance ?? "1,000"}</span>
                  <span className="text-[9px] font-mono text-slate-500">MAMTA_CREDITS</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+$100 transaction loop cycle</span>
                </div>
              </div>

              {/* Card 2: Registry systems */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Subsystem Registry</span>
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-indigo-400">
                    {state?.systemState?.registeredSystems?.length ?? 3}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Sub-Agents Live</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>100% Core Systems Healthy</span>
                </div>
              </div>

              {/* Card 3: Active cloud regions */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Cloud Node Shards</span>
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <Server className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-purple-400">3</span>
                  <span className="text-[9px] font-mono text-slate-500">Multi-Cloud Regions</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span>Averaged Load: 28.5%</span>
                </div>
              </div>

              {/* Card 4: Loop status */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Autonomous Loop</span>
                  <div className={`p-2 rounded-lg ${state?.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Activity className={`w-4 h-4 ${state?.isActive ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black uppercase ${state?.isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {state?.isActive ? "ACTIVE" : "STANDBY"}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cycle rate: 20s tick frequency</span>
                </div>
              </div>

            </div>

            {/* Middle Section: Manual Simulation & Registry status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form: Simulating Custom Ecosystem Goal */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Trigger Custom Ecosystem Objective</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Force the orchestrator and economy core to process unique market tasks</p>
                  </div>
                  <Workflow className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>

                <form onSubmit={handleCustomRun} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Ecosystem Objective / Goal</label>
                    <select
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-400 transition cursor-pointer"
                    >
                      <option value="earn_money">earn_money — Launch micro SaaS and collect Mamta Credits</option>
                      <option value="scale">scale — Expand server sharding & services</option>
                      <option value="idle">idle — Remain standby with healthy telemetry checks</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSimulatingRun}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 hover:text-indigo-200 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span>{isSimulatingRun ? "Executing Goal..." : "Run Ecosystem Loop Step"}</span>
                  </button>
                </form>

                {connResult && connResult.type === "ECO_SIMULATION_SUCCESS" && (
                  <div className="mt-6 bg-slate-950/80 border border-indigo-500/10 rounded-xl p-4 font-mono text-[11px] text-slate-300 relative">
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-[8px] bg-indigo-500/10 text-indigo-400 rounded uppercase font-bold border border-indigo-500/20">SUCCESS</span>
                    <span className="font-bold text-indigo-400 block mb-1">RUN LOG:</span>
                    <p>{connResult.message}</p>
                  </div>
                )}
              </div>

              {/* Subsystem Registry Status Details */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Registered Subsystems</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Centralized system registry index</p>
                  </div>
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>

                <div className="space-y-3 font-mono text-[11px]">
                  {state?.systemState?.systemsDetails ? (
                    Object.entries(state.systemState.systemsDetails).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-slate-200 font-bold block">{key}</span>
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest">{value.type} system</span>
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

        {/* SUBTAB 2: Ecosystem Stream Logs */}
        {activeSubTab === "loop" && (
          <motion.div
            key="loop"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Ecosystem Execution Loop Logs</h2>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Capturing raw ledger transfers, business operations, and load evaluations</p>
                </div>
                <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 shadow-sm animate-pulse">
                  AUTO-TELEMETRY
                </span>
              </div>

              {/* Stream Console */}
              <div className="bg-slate-950/75 border border-slate-800/80 rounded-xl p-4 font-mono text-[10px] leading-relaxed h-[450px] overflow-y-auto space-y-4 custom-scrollbar">
                {state?.history && state.history.length > 0 ? (
                  state.history.slice().reverse().map((record, index) => (
                    <div key={index} className="pb-4 border-b border-slate-900/80 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-slate-500 mb-1.5">
                        <span className="text-indigo-400 font-bold">[CLOCK: {new Date(record.timestamp).toLocaleTimeString()}]</span>
                        <span className="px-2 py-0.5 bg-indigo-950/60 text-indigo-400 font-bold rounded border border-indigo-500/15 uppercase tracking-widest">
                          OBJECTIVE: {record.goal}
                        </span>
                      </div>

                      <div className="text-slate-200 flex items-start gap-2 pl-2">
                        <span className="text-indigo-400 font-bold">&gt;&gt;</span>
                        <div className="space-y-2 w-full">
                          <p className="text-slate-300">
                            1. Business Core state: <span className="text-cyan-300">"{record.biz}"</span>
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5 text-[9px]">
                              <span className="font-bold text-emerald-400 block mb-1 flex items-center gap-1">
                                <Coins className="w-3.5 h-3.5" /> ECONOMY TRANSACTION:
                              </span>
                              <p>Credits Balance: <span className="text-slate-200 font-bold">${record.money.newBalance}</span></p>
                              <p>Ledger Status: <span className="text-emerald-400 uppercase font-semibold">{record.money.status}</span></p>
                            </div>

                            <div className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5 text-[9px]">
                              <span className="font-bold text-indigo-400 block mb-1 flex items-center gap-1">
                                <Cpu className="w-3.5 h-3.5" /> ORCHESTRATION EXECUTION:
                              </span>
                              <p>Worker node: <span className="text-slate-200">{record.task.workerNode}</span></p>
                              <p>Task: <span className="text-cyan-300 font-semibold">"{record.task.task}"</span></p>
                              <p>Execution ID: <span className="text-indigo-400">{record.task.executionId}</span></p>
                            </div>

                            <div className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5 text-[9px]">
                              <span className="font-bold text-amber-400 block mb-1 flex items-center gap-1">
                                <Server className="w-3.5 h-3.5" /> SHARD BALANCER:
                              </span>
                              <p>Resource Allocation: <span className="text-emerald-400 font-bold uppercase">{record.load}</span></p>
                              <p>Telemetry: <span className="text-slate-400">Stable, CPU healthy</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-12">
                    <Globe className="w-10 h-10 text-slate-700 animate-spin-slow" />
                    <p>No autonomous ecosystem cycles processed yet.</p>
                    <button 
                      onClick={handleForceTick} 
                      className="text-xs text-indigo-400 underline cursor-pointer hover:text-indigo-300"
                    >
                      Trigger immediate ecosystem tick
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: Multi-Cloud Node Clusters */}
        {activeSubTab === "nodes" && (
          <motion.div
            key="nodes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Real Cloud node grids */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Autonomous Server Node Clusters</h2>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Real-time status of multi-region sovereign nodes hosted globally</p>
                  </div>
                  <Server className="w-5 h-5 text-indigo-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {state?.systemState?.nodes ? (
                    state.systemState.nodes.map((n, idx) => (
                      <div key={idx} className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                          <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">{n.node}</span>
                          <span className="px-2 py-0.5 text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase font-bold">
                            {n.status}
                          </span>
                        </div>

                        <div className="space-y-2 font-mono text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Region:</span>
                            <span className="text-slate-300 uppercase">{n.node.split("-")[1]} Cluster</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">SLA Guarantee:</span>
                            <span className="text-slate-300">{n.uptime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Active Load:</span>
                            <span className="text-indigo-400 font-bold">{n.load}%</span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden mt-2">
                          <div 
                            className="bg-indigo-500 h-1 rounded-full transition-all duration-500" 
                            style={{ width: `${n.load}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">Loading sovereign multi-cloud node arrays...</div>
                  )}
                </div>
              </div>

              {/* Shard reallocation strategy explanation */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Dynamic Load Balancing Policy</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                  When any node's resource allocation load exceeds 70%, Mamta AI's auto-orchestrator automatically triggers **REDISTRIBUTE** events to shift heavy consensus and financial microeconomic loops to standby node shards:
                </p>
                <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-4 font-mono text-[10px] leading-relaxed text-slate-300">
                  <span className="text-emerald-400 font-bold block mb-1">BYZANTINE SHARD COHERENCE RULE:</span>
                  <p>IF Load &gt; 70% THEN MigrateTransactionHistory(targetNode="Azure-Asia-Standby")</p>
                  <p className="text-slate-500 mt-1">Status: Operational, 0 congestion drops detected</p>
                </div>
              </div>
            </div>

            {/* Microeconomic architecture details */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Global Infrastructure Overview</h3>
                <p className="text-[10px] text-slate-400 font-mono">Decentralized network design</p>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
                <p>
                  To secure global enterprise workloads, Mamta AI utilizes a **redundant multi-cloud cluster topology**. No single failure in any region can cause service disruption or state loss:
                </p>

                <div className="space-y-3 font-mono text-[11px] bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-slate-400">
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-200">AWS North America Shards:</strong> High throughput gateway routing 64% of incoming client queries.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-200">GCP European Union Shards:</strong> Secondary computation core processing AI-driven transactions.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-200">Azure Asia Pacific Standby:</strong> Deep state database replicator providing high-availability disaster recovery.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 4: Live Production Connectors */}
        {activeSubTab === "credentials" && (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Live API Key Connector Form */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Production Key Connector</h2>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Connect your active production service credentials securely for real AGI integrations</p>
              </div>

              <form onSubmit={handleConnectLive} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Target Service Name</label>
                  <select
                    value={targetService}
                    onChange={(e) => setTargetService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-400 transition cursor-pointer"
                  >
                    <option value="gemini_api">Gemini Developer Key — AI Logic</option>
                    <option value="google_cloud_run">Google Cloud Run API — Scale & Infra</option>
                    <option value="postgresql_db">Relational Database SSL — Structured State</option>
                    <option value="stripe_live">Stripe Secret Key — Real Microeconomics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Production Secret Key</label>
                  <input
                    type="password"
                    value={prodApiKey}
                    onChange={(e) => setProdApiKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-400 transition font-mono"
                    placeholder="Enter production API key (never stored or leaked)"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isConnecting}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 hover:text-indigo-200 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-4 h-4 text-indigo-400 ${isConnecting ? 'animate-spin' : ''}`} />
                  <span>{isConnecting ? "Establishing Live Link..." : "Securely Link Live API Credentials"}</span>
                </button>
              </form>

              {connResult && connResult.status && (
                <div className="bg-slate-950/80 border border-emerald-500/15 rounded-xl p-4 font-mono text-[11px] text-slate-300">
                  <span className="font-bold text-emerald-400 block mb-1">CONNECTOR STATUS:</span>
                  <div className="space-y-1">
                    <p>Service: <span className="text-slate-200 font-bold uppercase">{connResult.service}</span></p>
                    <p>Status: <span className="text-emerald-400 font-bold">{connResult.status}</span></p>
                    <p>Mode: <span className="text-cyan-400 font-bold uppercase">{connResult.mode}</span></p>
                    <p className="text-[10px] text-slate-500">Linked secure stamp: {new Date(connResult.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Production OAuth Redirection Domain verification */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">OAuth SSL Domain verification</h2>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Verify that your application redirect domain satisfies production grade SSL security</p>
              </div>

              <form onSubmit={handleValidateOAuth} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">Redirect Redirect URI / Domain</label>
                  <input
                    type="text"
                    value={targetDomain}
                    onChange={(e) => setTargetDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-400 transition font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isValidating}
                  className="w-full py-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 hover:text-purple-200 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>{isValidating ? "Validating Domain SSL..." : "Verify Domain Security"}</span>
                </button>
              </form>

              {oauthResult && (
                <div className="bg-slate-950/80 border border-indigo-500/15 rounded-xl p-4 font-mono text-[11px] text-slate-300">
                  <span className="font-bold text-indigo-400 block mb-1">SECURITY REPORT:</span>
                  <div className="space-y-1">
                    <p>SSL Protocol check: <span className="text-slate-200 font-bold uppercase">{oauthResult.protocol}</span></p>
                    <p>Verified status: <span className={oauthResult.verified ? "text-emerald-400 font-bold" : "text-rose-500 font-bold"}>
                      {oauthResult.verified ? "VERIFIED (SECURE FOR PRODUCTION REDIRECTS)" : "DENIED (HTTPS IS ABSOLUTELY REQUIRED)"}
                    </span></p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
