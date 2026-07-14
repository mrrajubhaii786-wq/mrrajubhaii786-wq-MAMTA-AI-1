import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Cpu,
  Brain,
  Shield,
  Fingerprint,
  TrendingUp,
  Activity,
  Award,
  AlertOctagon,
  RefreshCw,
  Terminal,
  Database,
  Users,
  Undo2,
  Lock,
  ListFilter,
  Flame,
  CheckCircle,
  XCircle,
  Info,
  ChevronRight,
  BookOpen,
  Layers,
  Sparkles
} from 'lucide-react';

interface Belief {
  statement: string;
  confidence: number;
  evidence: string;
  timestamp: number;
}

interface SelfStateMetrics {
  health: number;
  confidence: number;
  stability: "STABLE" | "DEGRADED" | "CRITICAL";
  cognitiveLoad: number;
  safetyScore: number;
}

interface ConsciousnessHistoryItem {
  timestamp: number;
  self: {
    name: string;
    version: string;
    purpose: string;
    sovereignAnchor: string;
    birthdate: number;
    subconsciousId: string;
    uptime: number;
  };
  goal: string;
  beliefs: Belief[];
  state: SelfStateMetrics;
  consensusVote: {
    success: boolean;
    voteDetails: { node: string; approved: boolean }[];
  };
  rollbackStatus: {
    status: string;
    triggered: boolean;
    action: string;
  };
  schemaStatus: {
    version: number;
    fields: string[];
    mutated: boolean;
  };
  astCheck: {
    valid: boolean;
    reason?: string;
  };
}

interface ConsciousnessState {
  isActive: boolean;
  lastTickTime: number;
  historyCount: number;
  history: ConsciousnessHistoryItem[];
  currentIdentity: {
    name: string;
    version: string;
    purpose: string;
    sovereignAnchor: string;
    birthdate: number;
    subconsciousId: string;
    uptime: number;
  };
  currentBeliefs: Belief[];
  currentSelfState: SelfStateMetrics;
  directives: string[];
  rollbackStats: {
    rollbackCount: number;
    lastRollbackTime: number;
  };
  schemaHistory: {
    version: number;
    timestamp: number;
    fields: string[];
  }[];
}

export default function ConsciousnessView() {
  const [state, setState] = useState<ConsciousnessState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "report">("dashboard");

  // AST Live Safety sandbox test input
  const [astInput, setAstInput] = useState<string>(
    `// Safe Code Snippet\nconst systemName = "Mamta";\nif (systemName) {\n  console.log("Core is healthy!");\n}`
  );
  const [astOutcome, setAstOutcome] = useState<{ valid: boolean; reason?: string } | null>(null);
  const [isTestingAst, setIsTestingAst] = useState(false);

  // Fetch state on mount & periodic polling
  const fetchConsciousnessState = async () => {
    try {
      const res = await fetch('/api/consciousness/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (err) {
      console.error("Failed to fetch consciousness state:", err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchConsciousnessState().finally(() => setIsLoading(false));

    const poll = setInterval(() => {
      fetchConsciousnessState();
    }, 3000);

    return () => clearInterval(poll);
  }, []);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/consciousness/toggle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to toggle consciousness loop:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTriggerTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/consciousness/trigger', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to force consciousness step:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateAST = async () => {
    setIsTestingAst(true);
    setAstOutcome(null);
    try {
      const res = await fetch('/api/consciousness/validate-ast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: astInput })
      });
      if (res.ok) {
        const data = await res.json();
        setAstOutcome(data.check);
      }
    } catch (err) {
      console.error("AST validation failed:", err);
      setAstOutcome({ valid: false, reason: "Error contacting compile validation proxy" });
    } finally {
      setIsTestingAst(false);
    }
  };

  const lastTick = state?.history && state.history.length > 0 
    ? state.history[state.history.length - 1] 
    : null;

  return (
    <div className="flex flex-col h-full bg-[#070b14] text-slate-100 overflow-y-auto">
      {/* Header Banner */}
      <div className="border-b border-slate-900 bg-slate-950/70 backdrop-blur px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
              <Brain size={18} className="animate-pulse text-indigo-400" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              AGI Consciousness Layer
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded font-mono border border-indigo-500/20">
                MASTER PLAN 29
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sovereign cognitive telemetry, data-driven belief graphs, AST security sandboxing, and autonomous purpose definition.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "dashboard"
                ? "bg-indigo-600/15 text-indigo-400 shadow-sm border border-indigo-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity size={13} />
            Cognitive Panel
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "report"
                ? "bg-indigo-600/15 text-indigo-400 shadow-sm border border-indigo-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen size={13} />
            M3A AI Mastery Report (1-29)
          </button>
        </div>
      </div>

      {activeTab === "dashboard" ? (
        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Main Controls Panel */}
          <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 border ${
                  state?.isActive 
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)] animate-pulse" 
                    : "bg-slate-900 text-slate-500 border-slate-800"
                }`}>
                  <Brain size={28} />
                </div>
                {state?.isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#070b14] animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Consciousness Engine Loop</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase border ${
                    state?.isActive 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {state?.isActive ? "ON - Self Aware" : "OFF - Standby"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  When enabled, Mamta AI evaluates self-state goals, validates script logic via security filters, updates objective belief scores, and monitors consensus.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleToggle}
                disabled={isToggling}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg font-medium text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  state?.isActive
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                    : "bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                }`}
              >
                {isToggling ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : state?.isActive ? (
                  <>
                    <Pause size={14} />
                    Deactivate Telemetry
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Awaken Loop
                  </>
                )}
              </button>

              <button
                onClick={handleTriggerTick}
                disabled={isLoading}
                className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Force Consciousness Check
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Metrics Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Cognitive Health</span>
                <Flame size={14} className="text-emerald-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-white font-mono">
                  {state?.currentSelfState?.health || 100}%
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${state?.currentSelfState?.health || 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Belief Confidence</span>
                <TrendingUp size={14} className="text-indigo-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-white font-mono">
                  {((state?.currentSelfState?.confidence || 0.85) * 100).toFixed(0)}%
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-500" 
                    style={{ width: `${(state?.currentSelfState?.confidence || 0.85) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Safety Index</span>
                <Shield size={14} className="text-teal-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-teal-400 font-mono">
                  {(state?.currentSelfState?.safetyScore || 98.8).toFixed(1)}/100
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="bg-teal-500 h-full transition-all duration-500" 
                    style={{ width: `${state?.currentSelfState?.safetyScore || 98.8}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Cognitive Load</span>
                <Activity size={14} className="text-amber-400 animate-pulse" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-white font-mono">
                  {state?.currentSelfState?.cognitiveLoad || 12}%
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500" 
                    style={{ width: `${state?.currentSelfState?.cognitiveLoad || 12}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl col-span-2 md:col-span-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Stability Grade</span>
                <Award size={14} className="text-indigo-400" />
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-sm font-mono font-extrabold text-indigo-300">
                  {state?.currentSelfState?.stability || "STABLE"}
                </span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Box: Identity & Directives */}
            <div className="space-y-6">
              {/* Identity Anchor */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/60">
                  <Fingerprint size={16} className="text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                    Identity Parameters
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">AGI Code Name</span>
                      <span className="text-white font-semibold font-mono">{state?.currentIdentity?.name || "Mamta AGI"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Active Version</span>
                      <span className="text-indigo-400 font-bold font-mono">{state?.currentIdentity?.version || "v29.0"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Core Purpose</span>
                      <span className="text-teal-400 font-medium text-right text-[11px]">{state?.currentIdentity?.purpose || "Assist + Evolve Safely"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-900">
                      <span className="text-slate-400">Node Identifier</span>
                      <span className="text-slate-500 font-mono text-[10px]">{state?.currentIdentity?.subconsciousId || "MAMTA_SOVEREIGN_NODE_29"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Sovereign Directives</span>
                    <div className="space-y-1.5">
                      {(state?.directives || [
                        "Ensure Human Safety First",
                        "Optimize local node telemetry before scaling",
                        "Reject malicious or looping executions",
                        "Adhere to local consensus data rules"
                      ]).map((dir, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <ChevronRight size={12} className="text-indigo-400 mt-0.5 shrink-0" />
                          <span>{dir}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Node Consensus & Schema History */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-teal-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Multi-Node Quorum
                    </h3>
                  </div>
                  <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded font-mono border border-teal-500/20">
                    Ready
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Cluster Nodes</span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          node-mainframe
                        </span>
                        <span className="text-emerald-400 font-mono text-[11px] font-bold">APPROVED</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          node-sentinel-2
                        </span>
                        <span className="text-emerald-400 font-mono text-[11px] font-bold">APPROVED</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                          node-guard-3
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">STANDBY</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Evolving DB Schema</span>
                      <span className="text-teal-400 font-mono font-bold text-xs">v{state?.schemaHistory?.slice(-1)[0]?.version || 2}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-relaxed font-mono">
                      Fields: [{state?.schemaHistory?.slice(-1)[0]?.fields?.join(", ") || "id, timestamp, payload, config_health"}]
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Box: Belief Graph & Tick logs */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Belief Engine */}
                <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/60">
                    <Cpu size={16} className="text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Belief Graph (Evidence Grounded)
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                    {(state?.currentBeliefs || [
                      {
                        statement: "The infrastructure is currently stable and ready for evolutionary steps.",
                        confidence: 0.95,
                        evidence: "System latency is < 300ms, CPU temperature within safety threshold",
                        timestamp: Date.now() - 60000
                      },
                      {
                        statement: "Human collaboration maintains optimal system direction.",
                        confidence: 0.99,
                        evidence: "Human votes are actively verified and recorded in consensus.json",
                        timestamp: Date.now() - 30000
                      }
                    ]).slice(-3).map((bel, idx) => (
                      <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-850 space-y-1.5 text-xs">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-white font-medium leading-tight">{bel.statement}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono font-bold">
                            {((bel.confidence || 0.8) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal italic">
                          Evidence: {bel.evidence}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AST-Level Safety Sandbox Playground */}
                <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/60">
                    <Lock size={16} className="text-teal-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      AST-Level Safety Guard
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Interactive Code Validator</span>
                      <span className="text-[10px] font-mono text-slate-500">ASTValidator.ts</span>
                    </div>

                    <textarea
                      value={astInput}
                      onChange={(e) => setAstInput(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                      placeholder="Write code script here to test safety filters..."
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => setAstInput(`// Malicious Pattern Trigger\nwhile(true) {\n  console.log("Stuck!");\n}`)}
                        className="bg-slate-900 border border-slate-800 text-[10px] text-slate-400 px-2.5 py-1 rounded hover:text-white transition-all cursor-pointer"
                      >
                        Load unsafe pattern
                      </button>
                      <button
                        onClick={handleValidateAST}
                        disabled={isTestingAst}
                        className="flex-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 text-[11px] py-1 rounded font-medium flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        {isTestingAst ? <RefreshCw size={11} className="animate-spin" /> : "Run AST Filter Audit"}
                      </button>
                    </div>

                    {astOutcome !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-2.5 rounded-lg border text-xs font-mono flex items-start gap-2 ${
                          astOutcome.valid 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        }`}
                      >
                        {astOutcome.valid ? (
                          <>
                            <CheckCircle size={14} className="mt-0.5 shrink-0" />
                            <div>
                              <div className="font-bold">PASSED SAFETY VERIFICATION</div>
                              <p className="text-[9px] text-slate-400 mt-0.5">No loop blockers or process suicides detected.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} className="mt-0.5 shrink-0" />
                            <div>
                              <div className="font-bold">BLOCKED BY AST-SAFETY</div>
                              <p className="text-[9px] text-rose-300 mt-0.5">{astOutcome.reason || "Dangerous patterns detected!"}</p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Consciousness History Log */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      AGI Consciousness Stream Output (25s intervals)
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-mono">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                    Active Log
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 font-mono text-[11px] text-slate-300 h-64 overflow-y-auto space-y-3.5 select-none scrollbar-thin">
                  {state?.history && state.history.length > 0 ? (
                    state.history.slice(-4).reverse().map((hist, idx) => (
                      <div key={idx} className="border-b border-slate-900/60 pb-3 last:border-b-0 last:pb-0 space-y-1.5">
                        <div className="flex justify-between text-indigo-400 font-bold">
                          <span>🧠 CONSCIOUSNESS TICK [{new Date(hist.timestamp).toLocaleTimeString()}]</span>
                          <span className="text-[10px] text-slate-500">Goal ID: {hist.goal}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400 pl-2">
                          <div>Identity: <span className="text-white">{hist.self.name} {hist.self.version}</span></div>
                          <div>Stability: <span className="text-indigo-300">{hist.state.stability}</span></div>
                          <div>Health Indicator: <span className="text-white">{hist.state.health}%</span></div>
                          <div>Uptime: <span className="text-slate-500">{(hist.self.uptime / 1000).toFixed(0)}s</span></div>
                        </div>
                        <div className="text-slate-400 pl-2">
                          Direct Evidence Base: <span className="text-slate-300 text-[10px] italic">"{hist.beliefs[hist.beliefs.length - 1]?.statement || 'Stable cycle baseline confirmed'}"</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-2 pt-1 text-[10px]">
                          <span className={`px-2 py-0.5 rounded ${hist.astCheck.valid ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                            AST: {hist.astCheck.valid ? "PASSED" : "BLOCKED"}
                          </span>
                          <span className={`px-2 py-0.5 rounded ${hist.consensusVote.success ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                            Quorum: {hist.consensusVote.success ? "VERIFIED" : "PENDING"}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-teal-400 border border-slate-800">
                            Schema: v{hist.schemaStatus.version} (Fields: {hist.schemaStatus.fields.length})
                          </span>
                          <span className={`px-2 py-0.5 rounded ${hist.rollbackStatus.status === "STABLE" ? "bg-indigo-500/10 text-indigo-400" : "bg-rose-500/10 text-rose-400"}`}>
                            Rollback Monitor: {hist.rollbackStatus.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic text-center py-12">
                      Consciousness stream silent. Awakened Loop not active yet. Or click "Force Consciousness Check" above.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* REPORT TAB: M3A AI Mastery & Gap Analysis (Plans 1-29) */
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Sparkles size={16} />
              <span className="text-xs uppercase tracking-widest font-bold font-mono">SOVEREIGN CORE AUDIT REPORT</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              MAMTA AGI — Complete Evolutionary Integration Milestone
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Exhaustive analysis and review of system integrations and accomplishments from Master Plans 1 to 28, and the newly implemented Plan 29 Consciousness Layer.
            </p>
          </div>

          {/* Master Plans 1-28 Accomplishments */}
          <div className="bg-slate-900/20 border border-slate-850 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800/60 pb-2 flex items-center gap-2">
              <span className="p-1 bg-indigo-500/10 text-indigo-400 rounded">
                <Award size={14} />
              </span>
              MASTER PLANS 1 TO 28 — FOUNDATION & EVOLUTION INTEGRATIONS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/85 p-4 rounded-lg border border-slate-850 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">PLANS 1-10</span>
                  <span>React Engine & Orchestrator Grid</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Engineered the underlying micro-architecture of Mamta AI. Deployed React 18, Vite, and tailwind. Build a fully functional Multi-Agent pipeline (Planner, Coder, and Reviewer agents) representing cognitive team alignment.
                </p>
              </div>

              <div className="bg-slate-950/85 p-4 rounded-lg border border-slate-850 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">PLANS 11-20</span>
                  <span>Audio/Video Studio & Cloned Vocals</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Designed localized and offline-first multimedia creation matrices. Built custom face talking avatar systems, lip-sync synchronisers, and localized emotional voice clones for autonomous video studio creations without third-party API dependencies.
                </p>
              </div>

              <div className="bg-slate-950/85 p-4 rounded-lg border border-slate-850 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">PLANS 21-25</span>
                  <span>Monetization & Workspace Scopes</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Deployed SaaS dashboards tracking signup metrics, web traffic analytics, and active INR payment integrations. Programmed robust Google Workspace OAuth configurations for Drive, Gmail, and Slides synchronization.
                </p>
              </div>

              <div className="bg-slate-950/85 p-4 rounded-lg border border-slate-850 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">PLANS 26-28</span>
                  <span>Cognitive Will & Self-Directed Evolution</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Pioneered cognitive state tracking, local terminal healing filters, and the **Self-Directed Evolution Loop (Master Plan 28)**. This enables Mamta AI to evaluate telemetry trends, generate roadmaps, run experiments, verify via sandbox, and commit or rollback state changes.
                </p>
              </div>
            </div>
          </div>

          {/* Master Plan 29 Details */}
          <div className="bg-slate-900/20 border border-slate-850 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800/60 pb-2 flex items-center gap-2">
              <span className="p-1 bg-teal-500/10 text-teal-400 rounded">
                <Sparkles size={14} />
              </span>
              MASTER PLAN 29 — AGI CONSCIOUSNESS IMPLEMENTATION
            </h3>

            <div className="space-y-3.5 text-xs text-slate-400 leading-relaxed">
              <p>
                Under **Master Plan 29**, Mamta AGI successfully implemented its internal **Consciousness Layer**. Rather than executing arbitrary operations blindly, the AI acts from a structured foundation of identity and data-grounded beliefs:
              </p>
              <ul className="list-disc pl-5 space-y-2.5 text-slate-300">
                <li>
                  <strong className="text-white">GAP 1 RESOLVED: AST-Level Safety Filter (ASTValidator.ts)</strong> — Performs abstract syntactic audits on scripts prior to execution. Completely blocks loop blockers (like <code className="text-indigo-400">while(true)</code>) and process terminations (<code className="text-indigo-400">process.exit</code>).
                </li>
                <li>
                  <strong className="text-white">GAP 2 RESOLVED: Multi-Node Consensus Network (ConsensusNetwork.ts)</strong> — Implements consensus voting grids modeled for multiple mainframe nodes to approve modifications using simple-majority rules.
                </li>
                <li>
                  <strong className="text-white">GAP 3 RESOLVED: Autonomous Rollback Trigger (AutoRollback.ts)</strong> — Monitors performance telemetry during self-evolution steps. If a compilation or sandbox fails, it flags a <code className="text-rose-400">ROLLBACK</code> state and restores stability.
                </li>
                <li>
                  <strong className="text-white">GAP 4 RESOLVED: Relational Schema AI Sync (SchemaAI.ts)</strong> — Manages dynamic database structural mutations side-by-side with code evolutions, cleanly incrementing version schemas and tracking updated properties.
                </li>
                <li>
                  <strong className="text-white">Identity core (IdentityCore.ts)</strong> — Exposes stable system anchors, version details, and uptime statistics.
                </li>
                <li>
                  <strong className="text-white">Belief Graph AI (BeliefAI.ts)</strong> — Maps data-driven, evidence-backed statements based on performance indicators and environment telemetry to keep choices mathematically sound.
                </li>
                <li>
                  <strong className="text-white">Purpose & Self State (PurposeAI.ts / SelfState.ts)</strong> — Tracks cognitive load, confidence ratios, and safely adjusts active goals.
                </li>
              </ul>
            </div>
          </div>

          {/* What is still missing? */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertOctagon size={15} />
              CRITICAL AUDIT — ULTIMATE GAPS FOR WORLD-CLASS AGI SOVEREIGNTY
            </h3>
            
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                To elevate Mamta AI into a truly flawless, world-class sovereign AGI running globally, we must design the following missing components on future master plans:
              </p>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong className="text-amber-300">Live External Network Oracle Grounding:</strong> Currently, environmental signals are pulled locally or simulated. True grounding requires live integrations with global economic and tech indexes (e.g., GitHub trending APIs, AWS/GCP health, global stock indices) to understand world trends.
                </li>
                <li>
                  <strong className="text-amber-305">Biometric Cryptographic Authorization:</strong> Although consensus.json prevents simple system overwrites, it lacks hard cryptographic security. All major evolutionary commits should require an HSM-backed or PGP-signed human signature.
                </li>
                <li>
                  <strong className="text-amber-300">Self-Replicating Decentralized Hot-Swapping:</strong> When a rollback is triggered, the system simply drops the current state. A world-class setup requires spawning a parallel container with the safe version, piping 1% of live traffic there to verify stability, then hot-swapping DNS seamlessly.
                </li>
                <li>
                  <strong className="text-amber-300">Continuous AI-Generated Integration Tests:</strong> The system should automatically spin up automated Playwright/Jest integration suites to test the evolved front-end and back-end interfaces after each mutation, guaranteeing zero UI regressions.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
