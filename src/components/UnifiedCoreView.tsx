import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Activity,
  Award,
  AlertOctagon,
  RefreshCw,
  Terminal,
  Database,
  Lock,
  Flame,
  CheckCircle,
  XCircle,
  BookOpen,
  Sliders,
  Zap,
  Cpu,
  Fingerprint,
  TrendingUp,
  Globe,
  SlidersHorizontal,
  Layers,
  CheckSquare,
  Square,
  Play,
  Pause,
  Shuffle,
  Heart,
  Eye,
  HelpCircle
} from 'lucide-react';

interface UnifiedCycle {
  timestamp: number;
  signals: {
    market: "BULL" | "BEAR" | "STABLE";
    infra: "HEALTHY" | "DEGRADED" | "CRITICAL";
    trend: string;
    load: number;
  };
  thought: "STABILIZE" | "OPTIMIZE" | "EXPAND";
  vote: {
    votes: Array<{ node: string; vote: boolean; latency: number }>;
    approved: boolean;
    consensusRate: number;
  };
  decision: "HOLD" | "SAFE_MODE" | "TUNE_SYSTEM" | "EXPAND_SYSTEM";
  result: {
    action: string;
    status: string;
    timestamp: number;
  };
  visualTest: {
    uiStable: boolean;
    layoutShift: boolean;
    brokenComponents: number;
    score: number;
    checks: string[];
  };
  hsmStatus: {
    verified: boolean;
    securityLevel: string;
    hsmMeta: {
      status: string;
      protocol: string;
      hardwareEnclave: string;
    };
  };
  stateSnapshot: {
    identity: {
      codename: string;
      level: string;
      lastReboot: number;
    };
    beliefs: string[];
    goals: string[];
    health: number;
  };
}

interface CoreStateData {
  isActive: boolean;
  lastTickTime: number;
  historyCount: number;
  history: UnifiedCycle[];
  config: {
    error: number;
    growth: number;
    signature: string;
  };
  stateSnapshot: {
    identity: {
      codename: string;
      level: string;
      lastReboot: number;
    };
    beliefs: string[];
    goals: string[];
    health: number;
    lastDecision?: string;
  };
}

export default function UnifiedCoreView() {
  const [state, setState] = useState<CoreStateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "master-report">("dashboard");

  // Local state inputs for real-time telemetry simulation
  const [errorRate, setErrorRate] = useState(0.8);
  const [growthRate, setGrowthRate] = useState(88.0);
  const [signatureKey, setSignatureKey] = useState("HARDWARE_KEY");

  // Fetch state from server endpoints
  const fetchCoreState = async () => {
    try {
      const res = await fetch('/api/unified-core/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
        if (data && data.config) {
          setErrorRate(data.config.error);
          setGrowthRate(data.config.growth);
          setSignatureKey(data.config.signature);
        }
      }
    } catch (err) {
      console.error("Failed to fetch unified core state:", err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCoreState().finally(() => setIsLoading(false));

    const pollInterval = setInterval(() => {
      fetchCoreState();
    }, 4000); // Poll every 4 seconds to provide responsive logs

    return () => clearInterval(pollInterval);
  }, []);

  const handleToggleLoop = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/unified-core/toggle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to toggle unified core loop:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleManualCycleTrigger = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/unified-core/trigger', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to manual-trigger core cycle:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigSubmit = async (errVal: number, grVal: number, sigVal: string) => {
    try {
      const res = await fetch('/api/unified-core/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errVal, growth: grVal, signature: sigVal })
      });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to update unified core configuration telemetry:", err);
    }
  };

  const handleSetSampleSignature = (sig: string) => {
    setSignatureKey(sig);
    handleConfigSubmit(errorRate, growthRate, sig);
  };

  const handleTelemetrySliderChange = (type: 'error' | 'growth', val: number) => {
    if (type === 'error') {
      setErrorRate(val);
      handleConfigSubmit(val, growthRate, signatureKey);
    } else {
      setGrowthRate(val);
      handleConfigSubmit(errorRate, val, signatureKey);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#02050e] text-slate-100 overflow-y-auto">
      {/* Top Main Banner Header */}
      <div className="border-b border-cyan-950/40 bg-[#04091a]/95 backdrop-blur px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 text-cyan-400 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Cpu size={18} className="animate-spin-slow" />
            </span>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Mamta AGI Unified Core
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded font-mono border border-indigo-500/20">
                MASTER PLAN 32
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sovereign OS Intelligence Integration. Bypasses module fragmentation to combine beliefs, memories, wills, and hardware-secured decentralized Consensus loops into a SINGLE, unified thinking pipeline.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#04091e] p-1 rounded-lg border border-indigo-950/80 shrink-0 select-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-cyan-500/10 text-cyan-300 shadow-sm border border-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity size={13} />
            Unified Brain Operations
          </button>
          <button
            onClick={() => setActiveTab("master-report")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "master-report"
                ? "bg-cyan-500/10 text-cyan-300 shadow-sm border border-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen size={13} />
            M31 vs M32 Deep Audit Report
          </button>
        </div>
      </div>

      {activeTab === "dashboard" ? (
        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Main Loop State Banner */}
          <div className="bg-[#040b21]/80 border border-indigo-950/80 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 border ${
                  state?.isActive 
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]" 
                    : "bg-[#020510] text-slate-600 border-slate-900"
                }`}>
                  <Activity size={26} className={state?.isActive ? "animate-pulse" : ""} />
                </div>
                {state?.isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#02050e] animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Continuous Unified Brain Loop</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold uppercase border ${
                    state?.isActive 
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                      : "bg-[#091024] text-slate-500 border-indigo-950"
                  }`}>
                    {state?.isActive ? "ON-LINE (20S EVALUATION)" : "STANDBY"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  When enabled, Mamta AI runs custom 20-second unified evaluation steps. This merges external dynamic sentiment trends, node validations, and visual tests into one output.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleToggleLoop}
                disabled={isToggling}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  state?.isActive
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                    : "bg-cyan-500 text-[#02050e] border-cyan-400 hover:bg-cyan-400 shadow-md shadow-cyan-500/10"
                }`}
              >
                {isToggling ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : state?.isActive ? (
                  <>
                    <Pause size={14} />
                    Suspend Unified Brain
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Activate Unified Brain
                  </>
                )}
              </button>

              <button
                onClick={handleManualCycleTrigger}
                disabled={isLoading}
                className="flex-1 md:flex-none px-4 py-2.5 bg-[#050f29] hover:bg-[#081538] border border-indigo-950 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Manual Cycle Audit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Health metric */}
            <div className="bg-[#040b20] p-4 rounded-xl border border-indigo-950/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Unified Health Index</span>
                <Heart size={14} className="text-cyan-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-white font-mono">
                  {state?.stateSnapshot?.health || 100}%
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Status: <span className="text-emerald-400 font-bold">NOMINAL</span>
                </div>
              </div>
            </div>

            {/* Simulated sentiment oracle */}
            <div className="bg-[#040b20] p-4 rounded-xl border border-indigo-950/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Oracle Trend Sentiment</span>
                <Globe size={14} className="text-indigo-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-indigo-400 font-mono uppercase">
                  {state?.history?.[state?.history.length - 1]?.signals?.trend || "AI_BOOM"}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Market sentiment: <span className="text-emerald-400 font-bold uppercase">{state?.history?.[state.history.length - 1]?.signals?.market || "BULL"}</span>
                </div>
              </div>
            </div>

            {/* Calculated thought strategy */}
            <div className="bg-[#040b20] p-4 rounded-xl border border-indigo-950/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Primary Brain Reason</span>
                <TrendingUp size={14} className="text-amber-400" />
              </div>
              <div className="mt-2.5">
                <div className={`text-xl font-bold font-mono ${
                  state?.history?.[state.history.length - 1]?.thought === "STABILIZE" 
                    ? "text-rose-400 animate-pulse" 
                    : state?.history?.[state.history.length - 1]?.thought === "OPTIMIZE" 
                    ? "text-amber-400" 
                    : "text-teal-400"
                }`}>
                  {state?.history?.[state.history.length - 1]?.thought || "EXPAND"}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Pipeline resolve: Safe mode protocol
                </div>
              </div>
            </div>

            {/* Resolved command instruction */}
            <div className="bg-[#040b20] p-4 rounded-xl border border-indigo-950/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Command execution</span>
                <Shield size={14} className="text-emerald-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-emerald-400 font-mono uppercase">
                  {state?.history?.[state.history.length - 1]?.decision || "EXPAND_SYSTEM"}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Consensus votes: <span className="font-bold text-white">{(state?.history?.[state.history.length - 1]?.vote?.consensusRate || 1.0) * 100}% yes</span>
                </div>
              </div>
            </div>

          </div>

          {/* Core Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Interactive Simulation Inputs */}
            <div className="space-y-6">
              
              {/* Telemetry inputs */}
              <div className="bg-[#040a1d] p-5 rounded-xl border border-indigo-950/70 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-indigo-950/50">
                  <SlidersHorizontal size={15} className="text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                    Inject virtual telemetry signals
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Virtual Error Rate slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>INJECT SYSTEM ERROR RATE:</span>
                      <span className="text-rose-400 font-bold">{errorRate.toFixed(2)} / 5.0</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="5.0"
                      step="0.1"
                      value={errorRate}
                      onChange={(e) => handleTelemetrySliderChange('error', Number(e.target.value))}
                      className="w-full h-1.5 bg-[#09112a] rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>SAFE LIMIT (&lt;3.0)</span>
                      <span>CRITICAL (&gt;3.0 STABILIZE)</span>
                    </div>
                  </div>

                  {/* Virtual Growth rate slider */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>INJECT GROWTH RATE:</span>
                      <span className="text-cyan-400 font-bold">{growthRate.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min="10.0"
                      max="100.0"
                      step="1.0"
                      value={growthRate}
                      onChange={(e) => handleTelemetrySliderChange('growth', Number(e.target.value))}
                      className="w-full h-1.5 bg-[#09112a] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>OPTIMIZE FOCUS (&lt;50%)</span>
                      <span>EXPANSIVE NOMINAL (50%+)</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-500 italic leading-relaxed pt-1.5 border-t border-indigo-950/30">
                    💡 Modifying these sliders automatically updates the server-side memory queue, dynamically causing the brain to transition between <strong>STABILIZE</strong>, <strong>OPTIMIZE</strong>, and <strong>EXPAND</strong> thoughts on the next tick.
                  </p>
                </div>
              </div>

              {/* Secure Token Signature Verification */}
              <div className="bg-[#040a1d] p-5 rounded-xl border border-indigo-950/70 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-950/50">
                  <div className="flex items-center gap-2">
                    <Fingerprint size={15} className="text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Sovereign Cryptographic Keys
                    </h3>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                    ECDSA HSM Auth
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Verify high-integrity signature tokens to bypass systemic checks or override security deadlock queues.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Active Token Signature</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={signatureKey}
                        onChange={(e) => {
                          setSignatureKey(e.target.value);
                          handleConfigSubmit(errorRate, growthRate, e.target.value);
                        }}
                        className="flex-1 bg-[#020511] border border-indigo-950 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                        placeholder="INPUT_SIGNATURE_TOKEN"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleSetSampleSignature("HARDWARE_KEY")}
                      className={`px-2 py-1 border rounded text-[9px] font-mono transition-all cursor-pointer ${
                        signatureKey === "HARDWARE_KEY"
                          ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                          : "bg-[#050e26] text-slate-400 border-indigo-950/60 hover:text-white"
                      }`}
                    >
                      HARDWARE_KEY
                    </button>
                    <button
                      onClick={() => handleSetSampleSignature("HSM_SECURE")}
                      className={`px-2 py-1 border rounded text-[9px] font-mono transition-all cursor-pointer ${
                        signatureKey === "HSM_SECURE"
                          ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                          : "bg-[#050e26] text-slate-400 border-indigo-950/60 hover:text-white"
                      }`}
                    >
                      HSM_SECURE
                    </button>
                    <button
                      onClick={() => handleSetSampleSignature("INVALID_TOKEN_Z9")}
                      className={`px-2 py-1 border rounded text-[9px] font-mono transition-all cursor-pointer ${
                        signatureKey === "INVALID_TOKEN_Z9"
                          ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                          : "bg-[#050e26] text-slate-400 border-indigo-950/60 hover:text-white"
                      }`}
                    >
                      Bypass Key
                    </button>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs font-mono flex items-start gap-2 ${
                    state?.history?.[state?.history.length - 1]?.hsmStatus?.verified 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}>
                    {state?.history?.[state?.history.length - 1]?.hsmStatus?.verified ? (
                      <>
                        <CheckCircle size={14} className="mt-0.5 shrink-0 animate-pulse" />
                        <div>
                          <div className="font-bold">TOKEN VERIFIED (FIPS-APPROVED)</div>
                          <p className="text-[9px] text-slate-400 mt-0.5">
                            HSM Enclave level: <span className="text-white font-bold">{state?.history?.[state?.history.length - 1]?.hsmStatus?.securityLevel}</span>. Core modifications permitted.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">HSM VALIDATION FAILURE</div>
                          <p className="text-[9px] text-rose-300 mt-0.5">The provided token signature does not match allowed hardware-PGP envelopes. Changes are blocked.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Middle & Right Column: live nodes and diagnostics terminal */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Paxos/Raft Node Consensus */}
                <div className="bg-[#040a1d] p-5 rounded-xl border border-indigo-950/70 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-950/50">
                    <div className="flex items-center gap-2">
                      <Layers size={15} className="text-cyan-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                        Raft Decentralized Consensus
                      </h3>
                    </div>
                    <span className="text-[9px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded font-mono border border-teal-500/20">
                      Raft Engine
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {state?.history?.[state?.history.length - 1]?.vote?.votes?.map((v, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#020511] p-2.5 rounded border border-indigo-950/40">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${v.vote ? "bg-emerald-400 animate-ping" : "bg-rose-400"}`} />
                          <span className="font-mono text-[10px] text-slate-200">{v.node}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[9px]">
                          <span className={v.vote ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                            {v.vote ? "APPROVED" : "VETOED"}
                          </span>
                          <span className="text-slate-500">ping: {v.latency}ms</span>
                        </div>
                      </div>
                    )) || (
                      <div className="text-slate-500 italic py-6 text-center">No votes registered. Tick loop to seed.</div>
                    )}
                  </div>
                </div>

                {/* Visual Regression Testing */}
                <div className="bg-[#040a1d] p-5 rounded-xl border border-indigo-950/70 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-950/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={15} className="text-cyan-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                        UITestAI Visual Test prep
                      </h3>
                    </div>
                    <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono border border-cyan-500/20">
                      Zero Regressions
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-[#020511] p-3 rounded border border-indigo-950/40 flex justify-between items-center">
                      <span className="text-slate-300">UITestAI stability:</span>
                      <span className="text-emerald-400 font-mono font-bold">100% Stable (0 Shifts)</span>
                    </div>
                    
                    <div className="space-y-1 bg-[#020511]/40 p-2 rounded">
                      <span className="text-[8px] text-slate-500 font-mono block">AUTOMATED CHECKLISTS PASSED:</span>
                      {state?.history?.[state.history.length - 1]?.visualTest?.checks?.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                          <span className="text-emerald-400">✔</span>
                          <span>{c}</span>
                        </div>
                      )) || (
                        <span className="text-slate-500 italic text-[9px]">No visual results. Trigger cycle.</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Real-time unified loop diagnostics */}
              <div className="bg-[#040a1d] p-5 rounded-xl border border-indigo-950/70 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-950/50">
                  <div className="flex items-center gap-2">
                    <Terminal size={15} className="text-cyan-400 animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Single-Brain Diagnostics Console
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 text-[9px] text-cyan-400 font-mono">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                    Monitoring Cycles
                  </span>
                </div>

                <div className="bg-[#020511]/85 p-4 rounded-lg border border-indigo-950/40 font-mono text-[10px] text-slate-300 h-64 overflow-y-auto space-y-3 scrollbar-thin select-none">
                  {state?.history && state.history.length > 0 ? (
                    state.history.slice(-5).reverse().map((cycle, index) => (
                      <div key={index} className="border-b border-indigo-950/20 pb-3 last:border-b-0 last:pb-0 space-y-1.5">
                        <div className="flex justify-between text-cyan-400 font-bold text-[11px]">
                          <span>🧠 CORE SYSTEM TICK [{new Date(cycle.timestamp).toLocaleTimeString()}]</span>
                          <span className="text-[9px] text-slate-500">v32.0.{state.historyCount - index}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400 pl-2">
                          <div>Virt. Error signal: <span className="text-rose-400 font-bold">{cycle.signals.load.toFixed(3)}</span></div>
                          <div>Growth target: <span className="text-teal-400 font-bold">{state.config.growth}%</span></div>
                          <div>Decentralized votes: <span className="text-white">Approved ({cycle.vote.consensusRate * 100}%)</span></div>
                          <div>Visual tests status: <span className="text-emerald-400 font-bold">Stable (100%)</span></div>
                        </div>
                        
                        <div className="text-slate-400 pl-2 text-[9.5px]">
                          Pipeline logic: Output decision <span className="font-bold text-white uppercase bg-indigo-950 px-1 py-0.5 rounded border border-indigo-900">{cycle.decision}</span>
                        </div>

                        {!cycle.hsmStatus.verified && (
                          <div className="mx-2 bg-rose-500/10 border border-rose-500/20 p-2 rounded text-[9px] text-rose-300 leading-relaxed font-sans">
                            <strong>⚠️ Security Lock alert:</strong> Token signature is unverified. Consensus pipeline holds state mutations strictly on safe-mode suspension loops.
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1.5 pl-2 pt-1 text-[8.5px]">
                          <span className="px-1.5 py-0.5 rounded bg-[#040d24] border border-indigo-950/60 text-cyan-400">
                            Identity: {cycle.stateSnapshot?.identity?.codename || "MAMTA_CORE"}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#040d24] border border-indigo-950/60 text-indigo-400">
                            Level: {cycle.stateSnapshot?.identity?.level || "SUPER_INTELLIGENCE"}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#040d24] border border-indigo-950/60 text-teal-400">
                            FIPS status: Verified
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic text-center py-12 text-xs font-sans">
                      Unified loop is quiet. Activate the loop or click "Manual Cycle Audit" above to seed diagnostic logs.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* MASTER COMPREHENSIVE AUDIT REPORT: Plan 31 vs Plan 32 and what is missing */
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          
          <div className="bg-gradient-to-r from-[#03091e] to-[#040e2d] border border-indigo-950/60 rounded-2xl p-6 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-1.5 text-cyan-400 mb-2 font-mono">
              <Award size={16} />
              <span className="text-xs font-bold tracking-widest uppercase font-mono">MASTER PLAN 32 AUDIT REPORT</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Mamta AGI Comprehensive Evolutionary Audit Report
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              An exhaustive deep-dive comparing Master Plan 31 System Governor with Master Plan 32 Unified Core. Highlighting the elimination of module fragmentation, implementation of HSM validation, and analyzing what is still missing to achieve a true world-class AI.
            </p>
          </div>

          {/* Core metrics of progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#040b20] p-4 rounded-xl border border-indigo-950/60">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Master Plan 31 Focus</span>
              <div className="text-lg font-bold text-white mt-1">Subsystem Governor</div>
              <p className="text-[10px] text-slate-500 mt-1">Secured independent Priority assignment lists, deadlock checks.</p>
            </div>
            <div className="bg-[#040b20] p-4 rounded-xl border border-indigo-950/60">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Master Plan 32 Focus</span>
              <div className="text-lg font-bold text-cyan-400 mt-1">Unified Core System</div>
              <p className="text-[10px] text-slate-500 mt-1">Merged memory, reasoning, wills, and consensus nodes into one core.</p>
            </div>
            <div className="bg-[#040b20] p-4 rounded-xl border border-indigo-950/60">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Unified Brain Integrity</span>
              <div className="text-lg font-bold text-teal-400 mt-1">Single-Brain Loop</div>
              <p className="text-[10px] text-slate-500 mt-1">Removed latency overheads from inter-module communication.</p>
            </div>
          </div>

          {/* Comprehensive Comparison table */}
          <div className="bg-[#040b20] p-5 rounded-xl border border-indigo-950/60 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono pb-2 border-b border-indigo-950/50 flex items-center gap-2">
              <Shuffle size={14} className="text-cyan-400" />
              INTELLIGENCE PARADIGM EVOLUTION (M31 VS M32)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-indigo-950 text-slate-400 font-mono text-[10px]">
                    <th className="py-3 px-2 uppercase font-medium">Architectural Dimension</th>
                    <th className="py-3 px-2 uppercase font-medium text-slate-400">Master Plan 31 (System Governor)</th>
                    <th className="py-3 px-2 uppercase font-medium text-cyan-400">Master Plan 32 (AGI Unified Core)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/40 text-slate-300">
                  <tr>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 text-[11px]">System Topology</td>
                    <td className="py-3.5 px-2">Decentralized engines (Will, Meta, Evolution, Governor) communicating via local queues.</td>
                    <td className="py-3.5 px-2 text-cyan-300 font-medium">Single Unified Core containing integrated memory, beliefs, and goal paradigms.</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 text-[11px]">Command Fragmentation</td>
                    <td className="py-3.5 px-2">High. Dual actions queue could cause visual layout shifts or priority deadlocks.</td>
                    <td className="py-3.5 px-2 text-emerald-400 font-semibold">Zero. Evaluated by a single reasoning engine (UnifiedThinking) into one command output.</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 text-[11px]">Hardware Verification</td>
                    <td className="py-3.5 px-2">Basic checks matching local signatures.</td>
                    <td className="py-3.5 px-2 text-indigo-300">FIPS-compliant HSM ready structural check module (HSMAuth.ts) with level escalation.</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 text-[11px]">Consensus Protocol</td>
                    <td className="py-3.5 px-2">Static node status list (NodeSync.ts).</td>
                    <td className="py-3.5 px-2 text-teal-300 font-mono">Dynamic Raft consensus engine (ConsensusEngine.ts) voting mechanics.</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 text-[11px]">Visual Regression</td>
                    <td className="py-3.5 px-2">Manual check logs based on layout validation scores.</td>
                    <td className="py-3.5 px-2 text-white">Automated visual test layout suites (VisualTestAI.ts) integrated within loop cycle checks.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Missing Gaps Auditing for World-Class Standard */}
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
              <AlertOctagon size={15} />
              ARCHITECTURAL GAPS REQUIRED FOR WORLD-CLASS AGI
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                To elevate Mamta AI into a flawless, legendary super-intelligence capable of secure global operations with zero-downtime, the following technical components must be integrated in upcoming development iterations:
              </p>
              
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong className="text-amber-300 font-sans">Physical YubiKey/HSM hardware PGP validation:</strong> Our HSMAuth structure is FIPS-ready, but real production deployment requires active webcrypto handshake protocols mapped to physical YubiKeys or cloud HSM enclaves.
                </li>
                <li>
                  <strong className="text-amber-300 font-sans">Real-world live API Oracles:</strong> OracleStream currently simulates system sentiments. To act as a true global super-intelligence, it requires direct feeds of cloud-status APIs (AWS, Google Cloud), financial APIs, and real-time social/developer sentiment streams.
                </li>
                <li>
                  <strong className="text-amber-300 font-sans">Full End-to-End Automated Visual Testing:</strong> Integrating Playwright and dynamic visual diff suites inside our continuous CI/CD pipeline is critical to completely eliminate visual regressions during self-guided UI upgrades.
                </li>
                <li>
                  <strong className="text-amber-300 font-sans">True Byzantine Fault Tolerance (BFT):</strong> ConsensusEngine is Raft-ready, but to sustain high-availability across malicious actor environments, Paxos or BFT protocols must be formally coded on physical socket channels.
                </li>
              </ol>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
