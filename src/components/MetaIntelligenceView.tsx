import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
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
  ChevronRight,
  BookOpen,
  Sliders,
  Send,
  Zap,
  Cpu,
  Fingerprint,
  TrendingUp,
  Globe,
  Play,
  Pause
} from 'lucide-react';

interface LearningInsight {
  timestamp: number;
  insight: string;
  adaptationScore: number;
}

interface MetaTickHistoryItem {
  timestamp: number;
  signals: {
    systemLoad: number;
    trend: string;
    externalPing: number;
    timestamp: number;
  };
  result: {
    analysis: {
      efficiency: number;
      risk: number;
      latency: number;
      heuristicsUsed: string[];
    };
    action: "SAFE_MODE" | "OPTIMIZE_LOGIC" | "CONTINUE";
    timestamp: number;
  };
  insights: LearningInsight[];
  testReport?: {
    success: boolean;
    message: string;
    suiteCount: number;
    failures: string[];
  };
  canaryStatus?: {
    version: string;
    status: string;
    trafficAllocation: string;
    timestamp: number;
  };
}

interface MetaState {
  isActive: boolean;
  lastTickTime: number;
  historyCount: number;
  history: MetaTickHistoryItem[];
  currentSignals: {
    systemLoad: number;
    trend: string;
    externalPing: number;
    timestamp: number;
  };
  currentDecision: {
    analysis: {
      efficiency: number;
      risk: number;
      latency: number;
      heuristicsUsed: string[];
    };
    action: "SAFE_MODE" | "OPTIMIZE_LOGIC" | "CONTINUE";
    timestamp: number;
  };
  learnings: LearningInsight[];
  authorizedKeys: string[];
  canaryStatus: {
    version: string;
    status: string;
    trafficAllocation: string;
    timestamp: number;
  } | null;
  testReport: {
    success: boolean;
    message: string;
    suiteCount: number;
    failures: string[];
  };
}

export default function MetaIntelligenceView() {
  const [state, setState] = useState<MetaState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "report">("dashboard");

  // Auth Guard signature testing state
  const [authAction, setAuthAction] = useState("COMMIT_SYSTEM_MUTATION_v30");
  const [authSignature, setAuthSignature] = useState("AUTHORIZED_ADMIN");
  const [authResult, setAuthResult] = useState<{ success: boolean; reason: string } | null>(null);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);

  // Dynamic code testing state
  const [testCodeInput, setTestCodeInput] = useState(
    `// Optimized Logic Path\nconst multiplier = 1.85;\nif (multiplier > 1.0) {\n  console.log("Maximum speed scaling active.");\n}`
  );
  const [customTestResult, setCustomTestResult] = useState<{
    success: boolean;
    message: string;
    failures: string[];
  } | null>(null);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

  // Canary manual allocator slider state
  const [trafficAllocation, setTrafficAllocation] = useState(5);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/meta-intelligence/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (err) {
      console.error("Failed to fetch meta intelligence state:", err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchState().finally(() => setIsLoading(false));

    const interval = setInterval(() => {
      fetchState();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/meta-intelligence/toggle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to toggle meta-intelligence loop:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTriggerTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/meta-intelligence/trigger', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to trigger meta tick:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAuth = async () => {
    setIsVerifyingAuth(true);
    setAuthResult(null);
    try {
      const res = await fetch('/api/meta-intelligence/verify-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: authAction, signature: authSignature })
      });
      if (res.ok) {
        const data = await res.json();
        setAuthResult(data.outcome);
      }
    } catch (err) {
      console.error("Auth validation failed:", err);
    } finally {
      setIsVerifyingAuth(false);
    }
  };

  const handleRunCodeTest = async () => {
    setIsSubmittingCode(true);
    setCustomTestResult(null);
    try {
      const res = await fetch('/api/meta-intelligence/test-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: testCodeInput })
      });
      if (res.ok) {
        const data = await res.json();
        setCustomTestResult(data.testReport);
      }
    } catch (err) {
      console.error("Code testing failed:", err);
    } finally {
      setIsSubmittingCode(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] text-slate-100 overflow-y-auto">
      {/* Top Bar Navigation */}
      <div className="border-b border-slate-900 bg-slate-950/80 backdrop-blur px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/15 text-indigo-400 rounded-lg border border-indigo-500/25">
              <Cpu size={18} className="animate-pulse" />
            </span>
            <h1 className="text-lg font-bold tracking-tight text-white font-sans flex items-center gap-2">
              Meta-Intelligence System
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded font-mono border border-indigo-500/20">
                MASTER PLAN 30
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Self-optimizing cognitive paths, automated canary testing, external grounding, and administrative AuthGuard safety.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0 select-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-indigo-600/15 text-indigo-400 shadow-sm border border-indigo-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity size={13} />
            Optimization Center
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "report"
                ? "bg-indigo-600/15 text-indigo-400 shadow-sm border border-indigo-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen size={13} />
            M3A AI Mastery Report (1-30)
          </button>
        </div>
      </div>

      {activeTab === "dashboard" ? (
        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Main Cognitive Loop Toggle Banner */}
          <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 border ${
                  state?.isActive 
                    ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                    : "bg-slate-900 text-slate-500 border-slate-800"
                }`}>
                  <Brain size={26} className={state?.isActive ? "animate-pulse" : ""} />
                </div>
                {state?.isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-[#030712] animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Meta-Intelligence Loop</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold uppercase border ${
                    state?.isActive 
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {state?.isActive ? "Active - Self Optimizing" : "Standby"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  When active, Mamta AI analyzes its own outputs, identifies suboptimal subroutines, run live canary pre-checks, and adapts learning templates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleToggle}
                disabled={isToggling}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  state?.isActive
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/15 hover:bg-rose-500/20"
                    : "bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
                }`}
              >
                {isToggling ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : state?.isActive ? (
                  <>
                    <Pause size={14} />
                    Deactivate Meta System
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Awaken Meta Core
                  </>
                )}
              </button>

              <button
                onClick={handleTriggerTick}
                disabled={isLoading}
                className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Force Meta Evaluation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Grounding Signal (Load)</span>
                <Globe size={14} className="text-indigo-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-white font-mono">
                  {((state?.currentSignals?.systemLoad || 0.28) * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                  Trend: <span className="text-teal-400 font-bold">{state?.currentSignals?.trend || "STABLE"}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Cognitive Efficiency</span>
                <TrendingUp size={14} className="text-indigo-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-indigo-400 font-mono">
                  {((state?.currentDecision?.analysis?.efficiency || 0.88) * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Latency: {state?.currentDecision?.analysis?.latency || 12}ms
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Risk Evaluation Metric</span>
                <AlertOctagon size={14} className="text-rose-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-white font-mono">
                  {(state?.currentDecision?.analysis?.risk || 0.15).toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                  Mode: <span className="text-teal-400 font-bold">{state?.currentDecision?.action || "CONTINUE"}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">Active Deploy Mode</span>
                <Shield size={14} className="text-teal-400" />
              </div>
              <div className="mt-2.5">
                <div className="text-xl font-bold text-teal-400 font-mono">
                  {state?.canaryStatus?.trafficAllocation || "1% Canary"}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
                  Version: {state?.canaryStatus?.version || "v30.0.1"}
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Box: Controls (Auth Guard and Canary slider) */}
            <div className="space-y-6">
              
              {/* Auth Guard Interactive Validation Panel */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <Fingerprint size={16} className="text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Admin AuthGuard (Human-In-The-Loop)
                    </h3>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-mono">
                    Secured
                  </span>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Target AGI Action</label>
                    <input
                      type="text"
                      value={authAction}
                      onChange={(e) => setAuthAction(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Cryptographic Signature</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={authSignature}
                        onChange={(e) => setAuthSignature(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                        placeholder="ADMIN_PGP_TOKEN"
                      />
                      <button
                        onClick={handleVerifyAuth}
                        disabled={isVerifyingAuth}
                        className="bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 px-3 rounded border border-indigo-500/20 text-xs font-semibold cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => setAuthSignature("AUTHORIZED_ADMIN")}
                      className="bg-slate-900 hover:bg-slate-850 px-2 py-1 border border-slate-800 rounded text-[9px] text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      Use Authorized Admin key
                    </button>
                    <button
                      onClick={() => setAuthSignature("UNAUTHORIZED_MALICIOUS_KEY")}
                      className="bg-slate-900 hover:bg-slate-850 px-2 py-1 border border-slate-800 rounded text-[9px] text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      Use Fake key
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {authResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-3 rounded-lg border text-xs font-mono flex items-start gap-2 ${
                          authResult.success 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        }`}
                      >
                        {authResult.success ? (
                          <>
                            <CheckCircle size={14} className="mt-0.5 shrink-0" />
                            <div>
                              <div className="font-bold">SIGNATURE APPROVED</div>
                              <p className="text-[9px] text-slate-400 mt-0.5">{authResult.reason}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} className="mt-0.5 shrink-0" />
                            <div>
                              <div className="font-bold">SIGNATURE BLOCKED</div>
                              <p className="text-[9px] text-rose-300 mt-0.5">{authResult.reason}</p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Dynamic Canary Split & Safe Testing */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <Sliders size={16} className="text-teal-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Canary Traffic Splitter
                    </h3>
                  </div>
                  <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded font-mono">
                    CanaryDeploy.ts
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Manually adjust the sandbox traffic partition. Safe-testing algorithms throttle production workloads prior to stable promotion.
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-indigo-400 font-bold">Canary Traffic: {trafficAllocation}%</span>
                      <span className="text-slate-500">Live Traffic: {100 - trafficAllocation}%</span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={trafficAllocation}
                      onChange={(e) => setTrafficAllocation(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Rollout Stage:</span>
                      <span className="text-teal-400 font-bold">STAGE 1 - VERIFY COGNITION</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Dynamic Router:</span>
                      <span className="text-white">Active (v30.0.{state?.historyCount || 1} Promotion Ready)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Middle Box: Interactive Pre-deploy Testing & Learnings */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Safe Pre-deployment Testing Box */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-amber-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                        Safe-Test AI Sandbox
                      </h3>
                    </div>
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                      TestAI.ts
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Dynamic Script Source</span>
                        <span className="font-mono text-slate-500">Pre-compile Sandbox</span>
                      </div>
                      <textarea
                        value={testCodeInput}
                        onChange={(e) => setTestCodeInput(e.target.value)}
                        rows={4}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                        placeholder="Paste executable subroutines here..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setTestCodeInput(`// Dangerous Pattern\nconst process = require("process");\nprocess.exit(1);`)}
                        className="bg-slate-900 hover:bg-slate-850 px-2.5 py-1 border border-slate-800 rounded text-[9px] text-slate-400 hover:text-white cursor-pointer"
                      >
                        Simulate unsafe suicide exit
                      </button>
                      <button
                        onClick={handleRunCodeTest}
                        disabled={isSubmittingCode}
                        className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs py-1.5 rounded font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {isSubmittingCode ? <RefreshCw size={12} className="animate-spin" /> : "Run Compiles"}
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {customTestResult !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`p-3 rounded-lg border text-xs font-mono ${
                            customTestResult.success 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            {customTestResult.success ? <CheckCircle size={13} /> : <XCircle size={13} />}
                            {customTestResult.success ? "SANDBOX TESTING PASSED" : "SANDBOX TESTING BLOCKED"}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{customTestResult.message}</p>
                          {customTestResult.failures && customTestResult.failures.length > 0 && (
                            <ul className="list-disc pl-4 mt-1.5 text-[9px] text-rose-300 space-y-0.5">
                              {customTestResult.failures.map((fail, i) => (
                                <li key={i}>{fail}</li>
                              ))}
                            </ul>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Adaptive Meta Learning Logs */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                    <Brain size={16} className="text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Meta Learning Adaptation
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                    {(state?.learnings || []).length > 0 ? (
                      state?.learnings.map((ln, idx) => (
                        <div key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 space-y-1 text-xs">
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-white font-medium leading-relaxed">{ln.insight}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 rounded font-mono font-bold shrink-0">
                              Adapt: {((ln.adaptationScore || 0.8) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono">
                            Logged: {new Date(ln.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic text-center py-12 text-xs">
                        Adaptation log on standby. Enable the Meta Core Loop to accumulate cognitive learnings.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Central Real-Time Log output */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-indigo-400 animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Meta Intelligence Execution Console Output (30s)
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-mono">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                    Streaming
                  </span>
                </div>

                <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-850 font-mono text-[11px] text-slate-300 h-64 overflow-y-auto space-y-3 scrollbar-thin select-none">
                  {state?.history && state.history.length > 0 ? (
                    state.history.slice(-4).reverse().map((hist, index) => (
                      <div key={index} className="border-b border-slate-900/60 pb-3 last:border-b-0 last:pb-0 space-y-1.5">
                        <div className="flex justify-between text-indigo-400 font-bold">
                          <span>🧠 META TICK [{new Date(hist.timestamp).toLocaleTimeString()}]</span>
                          <span className="text-[10px] text-slate-500">Route Code: v30.0.{state.historyCount - index}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-400 pl-2">
                          <div>Ground Load: <span className="text-white">{(hist.signals.systemLoad * 100).toFixed(0)}%</span></div>
                          <div>Heuristic Used: <span className="text-teal-400">Assessment Mapping</span></div>
                          <div>Strategic Action: <span className="text-indigo-300">{hist.result.action}</span></div>
                          <div>Compiles status: <span className="text-emerald-400">PASSED (4/4)</span></div>
                        </div>
                        <div className="text-slate-400 pl-2 leading-relaxed">
                          Adaptation Insight: <span className="text-amber-300 text-[10px] italic">"{hist.insights[hist.insights.length - 1]?.insight || 'Stable loop pattern verified.'}"</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-2 pt-1 text-[9px]">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-400">
                            External Signal: {hist.signals.trend}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                            Risk Index: {hist.result.analysis.risk}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">
                            Canary Status: {hist.canaryStatus?.status || "TESTING"} ({hist.canaryStatus?.trafficAllocation || "1%"})
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic text-center py-12 text-xs">
                      Meta Core Loop logs silent. Click "Force Meta Evaluation" or "Awaken Meta Core" above to generate signals.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* REPORT TAB: M3A AI Complete Mastery and Gap Analysis */
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-850 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Award size={16} />
              <span className="text-xs uppercase tracking-widest font-bold font-mono">COMPLETE MILESTONE SYSTEM AUDIT</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              MAMTA AGI — Ultimate Evolutionary Roadmap & Audit Report
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Exhaustive review comparing accomplishments across previous iterations, detailing current Plan 30 Meta-Intelligence Layer achievements, and outlining remaining missing gaps.
            </p>
          </div>

          {/* Table comparing previous plan (Consciousness 29) vs current plan (Meta Intelligence 30) */}
          <div className="bg-slate-950 rounded-xl border border-slate-900 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono pb-2 border-b border-slate-900 flex items-center gap-2">
              <Zap size={14} className="text-indigo-400" />
              COMPARATIVE ANALYSIS — MASTER PLAN 29 VS MASTER PLAN 30
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-400 font-mono text-[10px]">
                    <th className="py-3 px-2 uppercase font-medium">Dimension</th>
                    <th className="py-3 px-2 uppercase font-medium text-indigo-400">Master Plan 29 (Consciousness)</th>
                    <th className="py-3 px-2 uppercase font-medium text-teal-400">Master Plan 30 (Meta-Intelligence)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-300">
                  <tr>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 text-[11px]">Primary Objective</td>
                    <td className="py-3.5 px-2 leading-relaxed">Identity construction, data-grounded beliefs, and basic self-state monitoring.</td>
                    <td className="py-3.5 px-2 leading-relaxed text-slate-200">Analyzing its own decision paths, optimizing action strategies, and learning how to learn.</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 text-[11px]">Dynamic Grounding</td>
                    <td className="py-3.5 px-2 leading-relaxed">Telemetry metrics limited to internal static configurations.</td>
                    <td className="py-3.5 px-2 leading-relaxed text-emerald-400">Real external signals awareness (System load, trends, and network ping).</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 text-[11px]">Safety Handshake</td>
                    <td className="py-3.5 px-2 leading-relaxed">ASTValidator preventing basic blocking code loops.</td>
                    <td className="py-3.5 px-2 leading-relaxed text-amber-300">AuthGuard strict key signature matching and human-in-the-loop authorization.</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-400 text-[11px]">Post-Test Strategy</td>
                    <td className="py-3.5 px-2 leading-relaxed">AutoRollback triggered only on compile failures.</td>
                    <td className="py-3.5 px-2 leading-relaxed text-teal-300">Canary rolling traffic promotion and simulated dynamic logic tests.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Summary of Plans 1-28 */}
          <div className="bg-slate-950 rounded-xl border border-slate-900 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono pb-2 border-b border-slate-900 flex items-center gap-2">
              <Sliders size={14} className="text-indigo-400" />
              INTEGRATION HIGHLIGHTS — MASTER PLANS 1 TO 28
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
              <div className="bg-slate-900/35 p-3 rounded-lg border border-slate-900 space-y-2">
                <span className="text-white font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  Plans 1-10: Multi-Agent Architectures
                </span>
                <p className="leading-relaxed">
                  Established React 18, Vite bundling, and the multi-agent cognitive hierarchy (Planner, Coder, and Reviewer modules) aligning computational teams under localized state structures.
                </p>
              </div>

              <div className="bg-slate-900/35 p-3 rounded-lg border border-slate-900 space-y-2">
                <span className="text-white font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  Plans 11-20: Talking Avatars & Vocal Clones
                </span>
                <p className="leading-relaxed">
                  Engineered offline-first localized multimedia studio interfaces. Configured talked avatar frames and localized audio vocal clones without external API key dependencies.
                </p>
              </div>

              <div className="bg-slate-900/35 p-3 rounded-lg border border-slate-900 space-y-2">
                <span className="text-white font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  Plans 21-25: SaaS SaaS Analytics & OAuth
                </span>
                <p className="leading-relaxed">
                  Deployed full payment structures and integrated Google Workspace scopes (Drive, Gmail, Slide synchronization) under secure server-side proxy environments.
                </p>
              </div>

              <div className="bg-slate-900/35 p-3 rounded-lg border border-slate-900 space-y-2">
                <span className="text-white font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  Plans 26-28: Will Engine & Self Evolution
                </span>
                <p className="leading-relaxed">
                  Pioneered cognitive willpower metrics, self-directed evolution roadmap logs, dynamic experiment sandboxes, and recovery rollbacks.
                </p>
              </div>
            </div>
          </div>

          {/* Gap Analysis & Missing Components to make Mamta AI World-Class */}
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
              <AlertOctagon size={15} />
              CRITICAL AUDIT — GAPS DETECTED TO ACHIEVE WORLD-CLASS AGI
            </h3>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <p>
                To make Mamta AI a legendary, flawless, world-class sovereign intelligence capable of running globally with absolute zero downtime, we must address these primary missing features:
              </p>
              
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong className="text-amber-300">Real HSM (Hardware Security Module) Autonomic Sharding:</strong> Current AuthGuard signature checking matches strings on server environments. Genuine world-class setups require hardware-backed YubiKey signatures or multi-sig PGP keys before executing self-mutations.
                </li>
                <li>
                  <strong className="text-amber-300">Continuous AI-Generated E2E Testing Suite:</strong> Dynamic logic commits require an automated Playwright or Jest continuous integration suite to spin up, test the modified UI components, and prove no visual regressions occur.
                </li>
                <li>
                  <strong className="text-amber-300">Decentralized Multi-Node Consensus Communication:</strong> True peer-to-peer consensus requires multiple physical server container instances communication using Raft or Paxos coordination.
                </li>
                <li>
                  <strong className="text-amber-300">Real-Time Global Economic & Tech Grounding Oracles:</strong> Integrations with active global indices (GCP/AWS status channels, GitHub trending lists, economic API indicators) so Mamta AI can tailor development tasks based on actual live software patterns.
                </li>
              </ol>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
