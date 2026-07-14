import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Cpu,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Terminal,
  AlertTriangle,
  Layers,
  TrendingUp,
  Activity,
  Check,
  Code,
  Save,
  Brain,
  Vote,
  ExternalLink,
  Info
} from 'lucide-react';

interface EvolutionHistoryItem {
  timestamp: number;
  signals: {
    trend: string;
    infraHealth: number;
    globalState: string;
    timestamp?: number;
  };
  plan: string[];
  results: Array<{
    step: string;
    success: boolean;
    decision: string;
    latency: number;
  }>;
}

interface EvolutionState {
  isActive: boolean;
  lastTickTime: number;
  historyCount: number;
  history: EvolutionHistoryItem[];
  memoryState: {
    successCount: number;
    totalCount: number;
    successRate: number;
    status: string;
    lastUpdate?: number;
  };
  votes: {
    plan?: string[];
    results?: any[];
    decision?: string;
    timestamp?: number;
  };
}

export default function EvolutionView() {
  const [evolutionState, setEvolutionState] = useState<EvolutionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [sandboxCode, setSandboxCode] = useState<string>(
    `// Pre-Execution Sandbox Check\nconst secureHash = "0x892a";\nconst latencyCheck = true;\nreturn secureHash && latencyCheck;`
  );
  const [sandboxOutcome, setSandboxOutcome] = useState<{ success: boolean; error?: string } | null>(null);
  const [isTestingSandbox, setIsTestingSandbox] = useState(false);
  const [voteOpinion, setVoteOpinion] = useState<string>("APPROVE_COMMIT");
  const [voteCastSuccess, setVoteCastSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "report">("dashboard");

  // Fetch current state
  const fetchState = async () => {
    try {
      const res = await fetch('/api/evolution/state');
      if (res.ok) {
        const data = await res.json();
        setEvolutionState(data);
      }
    } catch (err) {
      console.error("Failed to fetch evolution state:", err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchState().finally(() => setIsLoading(false));

    // Poll every 3 seconds for fast updates in UI
    const interval = setInterval(() => {
      fetchState();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/evolution/toggle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setEvolutionState(data.state);
      }
    } catch (err) {
      console.error("Failed to toggle evolution loop:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTriggerTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/evolution/trigger', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setEvolutionState(data.state);
      }
    } catch (err) {
      console.error("Failed to trigger evolution step:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSandbox = async () => {
    setIsTestingSandbox(true);
    setSandboxOutcome(null);
    try {
      const res = await fetch('/api/evolution/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: sandboxCode })
      });
      if (res.ok) {
        const data = await res.json();
        setSandboxOutcome(data.outcome);
      }
    } catch (err) {
      console.error("Sandbox verification failed:", err);
      setSandboxOutcome({ success: false, error: "Network or Server error executing code snippet" });
    } finally {
      setIsTestingSandbox(false);
    }
  };

  const handleCastVote = async () => {
    setVoteCastSuccess(false);
    try {
      const voteData = {
        plan: evolutionState?.votes?.plan || ["EXPLORE", "INNOVATE"],
        results: evolutionState?.votes?.results || [],
        decision: voteOpinion,
        timestamp: Date.now(),
        castBy: "Human-In-The-Loop Coordinator"
      };
      const res = await fetch('/api/evolution/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteData })
      });
      if (res.ok) {
        setVoteCastSuccess(true);
        fetchState();
        setTimeout(() => setVoteCastSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to cast consensus vote:", err);
    }
  };

  const lastHistory = evolutionState?.history && evolutionState.history.length > 0 
    ? evolutionState.history[evolutionState.history.length - 1] 
    : null;

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d] text-slate-100 overflow-y-auto">
      {/* View Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-500/10 text-teal-400 rounded border border-teal-500/20">
              <Cpu size={18} className="animate-pulse" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              AGI Self-Directed Evolution
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-500/20">
                MASTER PLAN 28
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Activate controlled genetic-style iterations, roadmap formulation, safety consensus voting, and self-improving sandbox execution.
          </p>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700/50"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Evolution Panel
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "report"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700/50"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText size={13} />
            M3A AI Mastery Report (Plans 1-28)
          </button>
        </div>
      </div>

      {activeTab === "dashboard" ? (
        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Main Controls Header */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  evolutionState?.isActive 
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 animate-pulse" 
                    : "bg-slate-800/80 text-slate-500 border border-slate-700"
                }`}>
                  <Brain size={28} />
                </div>
                {evolutionState?.isActive && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-teal-500 rounded-full border-2 border-[#0a0f1d] animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">System Evolution Loop</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    evolutionState?.isActive 
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}>
                    {evolutionState?.isActive ? "ON - Auto Evolving" : "OFF - Controlled Standby"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  When active, Mamta AI evaluates system health signals every 30 seconds, designs a dynamic roadmap, executes trials in dry sandboxes, and commits state.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleToggle}
                disabled={isToggling}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg font-medium text-xs flex items-center justify-center gap-2 border transition-all ${
                  evolutionState?.isActive
                    ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                    : "bg-teal-500 text-slate-950 border-teal-400 hover:bg-teal-400 shadow-lg shadow-teal-500/10"
                }`}
              >
                {isToggling ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : evolutionState?.isActive ? (
                  <>
                    <Pause size={14} />
                    Deactivate Loop
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Activate Evolution
                  </>
                )}
              </button>

              <button
                onClick={handleTriggerTick}
                disabled={isLoading}
                className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Force Step Trial
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grid Layout of Gaps and Core Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Safety Gaps 1 & 2 */}
            <div className="space-y-6">
              {/* GAP 1: Live Signal Engine */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      GAP 1: Live Signal Grounding
                    </h3>
                  </div>
                  <TrendingUp size={14} className="text-teal-400" />
                </div>

                <div className="bg-slate-950/80 rounded-lg border border-slate-800 p-4 space-y-3.5">
                  <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                    <span className="text-xs text-slate-400">Current Market / Trend</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      lastHistory?.signals?.trend === "GROWTH" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {lastHistory?.signals?.trend || "GROWTH"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Infrastructure Health</span>
                      <span className="font-mono text-white font-semibold">
                        {(lastHistory?.signals?.infraHealth || 96.4).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-1000"
                        style={{ width: `${lastHistory?.signals?.infraHealth || 96.4}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                    <span className="text-xs text-slate-400">Global State Status</span>
                    <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      {lastHistory?.signals?.globalState || "STABLE"}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 leading-relaxed italic">
                  Provides environment stats to prevent AI loop instability due to external system anomalies.
                </div>
              </div>

              {/* GAP 2: Distributed Consensus & Persistent Voting */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      GAP 2: Persistent Consensus
                    </h3>
                  </div>
                  <Vote size={14} className="text-purple-400" />
                </div>

                <div className="bg-slate-950/80 rounded-lg border border-slate-800 p-4 space-y-3">
                  <div className="flex justify-between text-xs pb-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">Last Voting Action</span>
                    <span className="text-white font-mono font-bold">
                      {evolutionState?.votes?.decision || "COMMIT_EVOLUTION"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-slate-400">Human-In-The-Loop Override</span>
                    <div className="flex gap-2">
                      <select 
                        value={voteOpinion}
                        onChange={(e) => setVoteOpinion(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-purple-500 font-mono"
                      >
                        <option value="APPROVE_COMMIT">APPROVE & COMMIT CHANGE</option>
                        <option value="REJECT_ROLLBACK">REJECT & FORCE REVERT</option>
                        <option value="DELAY_SANDBOX">HOLD IN SANDBOX LAYER</option>
                      </select>

                      <button
                        onClick={handleCastVote}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1 transition-all"
                      >
                        <Save size={13} />
                        Cast
                      </button>
                    </div>

                    {voteCastSuccess && (
                      <p className="text-[10px] text-purple-400 font-semibold animate-pulse text-center">
                        ✓ Vote registered securely into consensus.json!
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-[10px] text-slate-400 font-mono space-y-1">
                    <div className="text-slate-300">File: consensus.json</div>
                    <div>Votes: [{"PROCESSED"}]</div>
                    <div>Integrator: ConsensusStore.ts</div>
                  </div>
                </div>
                
                <div className="text-[10px] text-slate-500 leading-relaxed">
                  Secures AI decisions on disk. AGI cannot make system-critical architecture replacements without a positive majority vote.
                </div>
              </div>
            </div>

            {/* Column 2: Safety Gaps 3 & 4 */}
            <div className="space-y-6">
              {/* GAP 3: Pre-Execution Testing Sandbox */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      GAP 3: Safe Sandbox Exec
                    </h3>
                  </div>
                  <Code size={14} className="text-blue-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Dry-run execution tester</span>
                    <span className="text-[10px] font-mono">SandboxExec.ts</span>
                  </div>

                  <textarea
                    value={sandboxCode}
                    onChange={(e) => setSandboxCode(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-blue-300 font-mono focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                    placeholder="Enter code to dry run..."
                  />

                  <button
                    onClick={handleTestSandbox}
                    disabled={isTestingSandbox}
                    className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isTestingSandbox ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <>
                        <Terminal size={13} />
                        Run Sandbox Compilation Dry-Check
                      </>
                    )}
                  </button>

                  {sandboxOutcome && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border text-xs font-mono flex items-start gap-2 ${
                        sandboxOutcome.success 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}
                    >
                      {sandboxOutcome.success ? (
                        <>
                          <CheckCircle size={15} className="mt-0.5 shrink-0" />
                          <div>
                            <div className="font-bold">Sandbox Success</div>
                            <p className="text-[10px] text-emerald-500/70 mt-0.5">Function compiled cleanly. Code safe for live testing trial.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle size={15} className="mt-0.5 shrink-0" />
                          <div>
                            <div className="font-bold">Syntax Check Fail</div>
                            <p className="text-[10px] text-red-400/80 mt-0.5">{sandboxOutcome.error || "Execution crashed"}</p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 leading-relaxed">
                  Before applying any dynamically generated logic, the code is evaluated in an isolated Sandbox object to safeguard system integrity.
                </div>
              </div>

              {/* GAP 4: Learning Sync Engine */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      GAP 4: Continuous Learning Grounding
                    </h3>
                  </div>
                  <Layers size={14} className="text-amber-400" />
                </div>

                <div className="bg-slate-950/80 rounded-lg border border-slate-800 p-4 space-y-3.5">
                  <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-800/50">
                    <span className="text-slate-400">Model Memory State</span>
                    <span className="text-amber-400 font-mono font-bold text-[10px]">
                      {evolutionState?.memoryState?.status || "OPTIMAL"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850 text-center">
                      <div className="text-[10px] text-slate-400">Tested Gaps</div>
                      <div className="text-lg font-bold text-white mt-1">
                        {evolutionState?.memoryState?.totalCount || 20}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded border border-slate-850 text-center">
                      <div className="text-[10px] text-slate-400">Success Ratio</div>
                      <div className="text-lg font-bold text-teal-400 mt-1">
                        {((evolutionState?.memoryState?.successRate || 0.75) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
                    <span>Synchronizer:</span>
                    <span>LearningSync.ts</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 leading-relaxed">
                  Aligns the trial results directly with long-term memory updates. If an evolution fails, the sync engine lowers weights to prevent repeat failures.
                </div>
              </div>
            </div>

            {/* Column 3: The Core Self-Directed Evolution Engine */}
            <div className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-5 relative">
                <div className="absolute top-3 right-3 text-teal-500 animate-pulse">
                  <Sparkles size={16} />
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    Active Self-Directed Evolution Core
                  </h3>
                </div>

                {/* Step Visualizer */}
                <div className="space-y-4">
                  {/* Step 1: Roadmap */}
                  <div className="relative pl-6 pb-4 border-l border-slate-800">
                    <span className="absolute -left-1.5 top-0.5 w-3.5 h-3.5 bg-slate-950 border-2 border-teal-500 rounded-full flex items-center justify-center text-[8px] font-bold text-teal-400">
                      1
                    </span>
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-semibold text-slate-200">Roadmap Formulation</div>
                      <span className="text-[10px] font-mono text-slate-500">RoadmapAI.ts</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-300">Generated Strategy:</span>
                      <span className="text-[10px] px-2 py-0.5 bg-teal-500/15 text-teal-300 rounded font-mono font-bold">
                        {lastHistory?.plan && lastHistory.plan.length > 0 ? lastHistory.plan.join(" & ") : "EXPLORE & INNOVATE"}
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Experimentation */}
                  <div className="relative pl-6 pb-4 border-l border-slate-800">
                    <span className="absolute -left-1.5 top-0.5 w-3.5 h-3.5 bg-slate-950 border-2 border-indigo-500 rounded-full flex items-center justify-center text-[8px] font-bold text-indigo-400">
                      2
                    </span>
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-semibold text-slate-200">Active Experiment Trials</div>
                      <span className="text-[10px] font-mono text-slate-500">ExperimentAI.ts</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 mt-1.5 space-y-1.5">
                      {lastHistory?.results && lastHistory.results.length > 0 ? (
                        lastHistory.results.map((res, i) => (
                          <div key={i} className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Step: {res.step}</span>
                            <span className={res.success ? "text-emerald-400" : "text-rose-400"}>
                              {res.success ? `Success (Trial ${i+1})` : "Dry-run Filtered"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between text-[11px] font-mono text-slate-500">
                          <span>Waiting for tick...</span>
                          <span>-</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Evolution Decision */}
                  <div className="relative pl-6">
                    <span className="absolute -left-1.5 top-0.5 w-3.5 h-3.5 bg-slate-950 border-2 border-purple-500 rounded-full flex items-center justify-center text-[8px] font-bold text-purple-400">
                      3
                    </span>
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-semibold text-slate-200">Genetic Decider Logic</div>
                      <span className="text-[10px] font-mono text-slate-500">EvolveAI.ts</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 mt-1.5 flex justify-between items-center">
                      <span className="text-[11px] text-slate-300">Final Decider Action:</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold ${
                        lastHistory?.results && lastHistory.results.some(r => r.decision === "KEEP_CHANGE")
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {lastHistory?.results && lastHistory.results.some(r => r.decision === "KEEP_CHANGE") 
                          ? "KEEP_CHANGE (COMMIT)" 
                          : "REVERT (SAFETY RESET)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 space-y-2">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Activity size={12} className="text-teal-400 animate-pulse" />
                    <span>Real-time Background Terminal (30s Tick)</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[10px] text-slate-300 h-28 overflow-y-auto space-y-1.5 select-none leading-relaxed">
                    <div className="text-slate-500">// EvolutionLoop.ts instantiated successfully</div>
                    {evolutionState?.history && evolutionState.history.length > 0 ? (
                      evolutionState.history.slice(-3).map((hist, i) => (
                        <div key={i} className="border-b border-slate-900/50 pb-1 last:border-b-0 space-y-0.5">
                          <div className="text-teal-400">
                            [{new Date(hist.timestamp).toLocaleTimeString()}] Tick executed
                          </div>
                          <div className="text-slate-400 pl-2">
                            - Signals: {hist.signals.trend} | {hist.signals.infraHealth.toFixed(1)}%
                          </div>
                          <div className="text-purple-300 pl-2">
                            - Plan: {hist.plan.join(", ")}
                          </div>
                          {hist.results.map((res, j) => (
                            <div key={j} className="text-slate-500 pl-4">
                              &gt; {res.step}: <span className={res.success ? "text-emerald-500" : "text-amber-500"}>{res.decision}</span>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic">No events in history log yet. Activate the loop or trigger a manual step above.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* REPORT TAB: M3A AI Mastery & Gap Analysis (Plans 1-28) */
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2 text-teal-400">
              <Sparkles size={16} />
              <span className="text-xs uppercase tracking-widest font-bold font-mono">Continuous Mastery Audit</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              MAMTA AI — Evolutionary Milestones & Gap Report
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Detailed breakdown of system integration achievements, architecture design choices from Master Plans 1 to 27, and the newly implemented Plan 28 Self-Directed Evolution features.
            </p>
          </div>

          {/* Master Plans 1-27 Accomplishments */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="p-1 bg-teal-500/10 text-teal-400 rounded">
                <Check size={14} />
              </span>
              MASTER PLANS 1 TO 27 — FOUNDATION INTEGRATIONS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-850 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="text-[10px] font-mono text-teal-400">PLANS 1-10</span>
                  <span>Core Framework & Multi-Agent Matrix</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Established the base architectural engine of Mamta AI. Deployed React 18 & Vite, laid out global CSS structures, and engineered the Multi-Agent orchestrators (Planner, Coder, and Reviewer agents) running locally in a reactive web system.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-850 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="text-[10px] font-mono text-teal-400">PLANS 11-20</span>
                  <span>Local Voice Cloning & Video Studio</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Developed high-fidelity, offline-first multimedia synthesis modules. Built custom lip-sync, talking avatars, and localized TTS models with emotional modifiers, allowing real-time video generation and automated YouTube/Reel creation without external API dependencies.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-850 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="text-[10px] font-mono text-teal-400">PLANS 21-25</span>
                  <span>Launch Hub & Global Workspace</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Engineered the Launch Hub dashboard to track micro-SaaS deployment telemetry, traffic analytics, signups, and Indian Rupee (INR) monetization pipelines. Integrated Workspace tools with Google OAuth scopes.
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-850 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="text-[10px] font-mono text-teal-400">PLANS 26-27</span>
                  <span>Self-Awareness & Autonomous Will</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Added self-awareness cognitive streams and the Autonomous Will loop. Built a local terminal execution pipeline, self-healing file-modifying filters, and safety system boundaries that override unsafe, runaway command instructions.
                </p>
              </div>
            </div>
          </div>

          {/* Master Plan 28 Details */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="p-1 bg-teal-500/10 text-teal-400 rounded">
                <Sparkles size={14} />
              </span>
              MASTER PLAN 28 — SELF-DIRECTED EVOLUTION IMPLEMENTATION
            </h3>

            <div className="space-y-3.5 text-xs text-slate-400 leading-relaxed">
              <p>
                In **Master Plan 28**, we upgraded Mamta AI from a purely reactive command-follower into a **Self-Directed Evolutionary Agent**. The core additions are:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li>
                  <strong className="text-white">GAP 1: Live Signal Engine (RealityAI.ts)</strong> — Pulls real-time environmental context to guide roadmapping decisions, grounding trials in system infrastructure integrity.
                </li>
                <li>
                  <strong className="text-white">GAP 2: Persistent Consensus voting (ConsensusStore.ts)</strong> — Persists AGI evolution schemas to <code className="text-purple-400">consensus.json</code> to prevent rogue overwrites without authorization.
                </li>
                <li>
                  <strong className="text-white">GAP 3: Safe Isolation Sandbox (SandboxExec.ts)</strong> — Dry-runs dynamically compiled JavaScript and TypeScript structures inside an isolated execution container prior to live application.
                </li>
                <li>
                  <strong className="text-white">GAP 4: Continuous Learning Sync (LearningSync.ts)</strong> — Modulates trial outcomes directly into the system's persistent weights, decreasing probability pathways for failed approaches.
                </li>
                <li>
                  <strong className="text-white">Evolution Core (RoadmapAI, ExperimentAI, EvolveAI, EvolutionLoop)</strong> — Generates plans based on health conditions, runs experiments, decides keeping or reverting, and triggers ticks on a 30-second interval.
                </li>
              </ul>
            </div>
          </div>

          {/* Missing Gaps Analysis */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle size={15} />
              CRITICAL AUDIT — CURRENT MISSING GAPS FOR WORLD-CLASS AGI
            </h3>
            
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                While Mamta AI is now highly advanced, to genuinely establish **world-class reliability and sovereign AGI stability**, we must address the following missing items on subsequent master plans:
              </p>
              <ol className="list-decimal pl-5 space-y-2.5">
                <li>
                  <strong className="text-amber-300">Formal AST Verification:</strong> Sandbox execution checks simple syntax, but lacks Abstract Syntax Tree (AST) scanning. We need static analysis to reject dangerous operations (e.g. infinite recursion, process suicide) before compiling functions.
                </li>
                <li>
                  <strong className="text-amber-300">Multi-Node Decentralized Consensus:</strong> The current consensus system persists locally on a single disk file (<code className="text-purple-400">consensus.json</code>). For true cloud scaling, the voting should be distributed over an ensemble of server nodes using raft-style peer-to-peer protocols.
                </li>
                <li>
                  <strong className="text-amber-300">Automated Rollback-on-Telemetry-Crash:</strong> If a keeping change causes the container to throw unhandled exceptions within a 5-minute window after deployment, the system should trigger an immediate, autonomous git-revert/commit-rollback.
                </li>
                <li>
                  <strong className="text-amber-300">Generative Schema Migrations:</strong> Dynamic evolution changes codes but cannot safely evolve relational database tables. A live database migration synthesiser is required to safely adapt database schemas side-by-side with code evolution.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
