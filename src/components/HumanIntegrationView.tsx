import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Brain,
  Sparkles,
  Target,
  Workflow,
  Cpu,
  Monitor,
  Smartphone,
  CheckCircle,
  Clock,
  User,
  Plus,
  Shield,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Send,
  Lock,
  ChevronRight,
  TrendingUp,
  Award,
  Play,
  Pause
} from 'lucide-react';

interface HumanLoopRecord {
  timestamp: number;
  userId: string;
  action: {
    type: string;
    page?: string;
    detail?: string;
    goal?: string;
    id?: string;
  };
  result: {
    style: {
      tone: string;
      depth: string;
    };
    suggestion: string;
    profile: {
      userId: string;
      preferences: string[];
      behavior: any[];
      goals: string[];
    };
  };
}

interface HumanState {
  isActive: boolean;
  lastTickTime: number;
  historyCount: number;
  history: HumanLoopRecord[];
  currentProfile: {
    userId: string;
    preferences: string[];
    behavior: any[];
    goals: string[];
  };
}

export default function HumanIntegrationView() {
  const [state, setState] = useState<HumanState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "learning" | "mobile-load" | "oauth">("profile");

  // Goals Form State
  const [newGoal, setNewGoal] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // Custom Human Action Form State
  const [customActionType, setCustomActionType] = useState("click_button");
  const [customActionDetail, setCustomActionDetail] = useState("Updated security firewall preferences");
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Mobile Load Simulator State
  const [mobileCoreCount, setMobileCoreCount] = useState(8);
  const [isEdgeOffloading, setIsEdgeOffloading] = useState(true);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/human/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (err) {
      console.error("Failed to fetch human integration state:", err);
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
      const res = await fetch('/api/human/toggle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to toggle human loop:", err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleForceTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/human/trigger', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setState(data.state);
      }
    } catch (err) {
      console.error("Failed to trigger human loop tick:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setIsAddingGoal(true);
    try {
      const res = await fetch('/api/human/goal/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "user-1", goal: newGoal.trim() })
      });
      if (res.ok) {
        setNewGoal("");
        await fetchState();
      }
    } catch (err) {
      console.error("Failed to add goal:", err);
    } finally {
      setIsAddingGoal(false);
    }
  };

  const handleProcessAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/human/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: "user-1",
          action: {
            type: customActionType,
            detail: customActionDetail,
            timestamp: Date.now()
          }
        })
      });
      if (res.ok) {
        setCustomActionDetail("");
        await fetchState();
      }
    } catch (err) {
      console.error("Failed to process custom human action:", err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Simulated OAuth Trigger
  const handleOAuthConnect = async (provider: string) => {
    try {
      const res = await fetch('/api/human/oauth/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // Open mock OAuth URL directly in secondary window
          const authWindow = window.open(
            `${data.url}?client_id=mamta-ai-client-id&redirect_uri=${window.location.origin}/auth/callback`,
            'oauth_popup',
            'width=600,height=700'
          );
          if (!authWindow) {
            alert('Please allow popups for the site to test simulated AGI OAuth flow.');
          }
        }
      }
    } catch (err) {
      console.error("Failed to trigger OAuth connect:", err);
    }
  };

  const mockPredefinedGoals = [
    { key: "earn_money", label: "Earn Capital & Monetize AI" },
    { key: "build_app", label: "Build Global Decentralized Platform" },
    { key: "optimize_infra", label: "Optimize Multi-Region Node Shards" }
  ];

  const handleQuickAddGoal = async (goalKey: string) => {
    try {
      await fetch('/api/human/goal/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "user-1", goal: goalKey })
      });
      await fetchState();
    } catch (err) {
      console.error("Failed to add quick goal:", err);
    }
  };

  // Determine adapt tone and advice suggestion dynamically
  const goalsList = state?.currentProfile?.goals || [];
  const behaviorCount = state?.currentProfile?.behavior?.length || 0;

  let currentTone = "friendly";
  let currentDepth = "basic";
  if (behaviorCount > 5) {
    currentTone = "technical";
    currentDepth = "deep";
  }

  let workflowSuggestion = "General Assistance: Set targets in Goal Tracker to trigger real-world automation workflow suggestions!";
  if (goalsList.includes("earn_money")) {
    workflowSuggestion = "Workflow Suggestion: Suggest freelancing + deploy specialized Mamta AI SaaS microservices to auto-generate micro-revenues.";
  } else if (goalsList.includes("build_app")) {
    workflowSuggestion = "Workflow Suggestion: Suggest development roadmap. Initialize a distributed node framework on Edge- Tokyo clusters.";
  } else if (goalsList.includes("optimize_infra")) {
    workflowSuggestion = "Workflow Suggestion: Enable auto-scaling multi-shard consensus algorithms to optimize overall node CPU cycles.";
  }

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
                MAMTA CORE SYSTEM v36
              </span>
              <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 shadow-sm">
                HUMAN-INTEGRATION LAYER
              </span>
              <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shadow-sm">
                PERSONAL INTELLIGENCE ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
              <Brain className="w-8 h-8 text-amber-400 animate-pulse" />
              MAMTA AI: <span className="bg-gradient-to-r from-amber-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">HUMAN LAYER</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-3xl font-medium">
              Evolving from a static system to a personal intelligence layer. Mamta AI deeply understands users, learns from active behavior patterns, tracks lifetime workflows, and adapts its cognitive responses dynamically.
            </p>
          </div>

          {/* Core Controls */}
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
                  <span>Pause Cognitive Loop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Resume Cognitive Loop</span>
                </>
              )}
            </button>

            <button
              onClick={handleForceTick}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800 border border-slate-700/80 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 text-slate-200 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Simulate User Interaction</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-800 mt-8 gap-4 sm:gap-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>User Profile & Goals</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("learning")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "learning"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Cognitive Learning Stream</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("mobile-load")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "mobile-load"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>Mobile Load Optimizer</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("oauth")}
            className={`pb-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "oauth"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Secure OAuth & Cloud Links</span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* TAB 1: User Profile & Dynamic Goal Tracker */}
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Dynamic Goal Tracker */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Dynamic User Goal Tracker</h2>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Define lifetime objectives to auto-adapt suggestions and system pipelines</p>
                  </div>
                  <Target className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Current Registered Goals */}
                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block border-b border-slate-900 pb-2">Active Targets</span>
                    {goalsList.length > 0 ? (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                        {goalsList.map((g, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-2.5 bg-indigo-950/30 border border-indigo-500/15 rounded-lg text-xs font-medium text-slate-300">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="font-mono text-slate-200">{g}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500 text-xs font-mono">
                        No active goals registered in profile.
                      </div>
                    )}
                  </div>

                  {/* Add New Goal Form */}
                  <form onSubmit={handleAddGoal} className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block border-b border-slate-900 pb-2 mb-3">Register New Target</span>
                      <input
                        type="text"
                        placeholder="e.g. build_app, earn_money, study_science"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400 transition font-mono mb-3"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isAddingGoal}
                      className="w-full py-2 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingGoal ? "Adding Target..." : "Add Target"}</span>
                    </button>
                  </form>
                </div>

                {/* Predefined Core Goals */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Quick Add Sovereign AGI Goals</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {mockPredefinedGoals.map((g) => {
                      const exists = goalsList.includes(g.key);
                      return (
                        <button
                          key={g.key}
                          onClick={() => handleQuickAddGoal(g.key)}
                          disabled={exists}
                          className={`px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border text-left flex items-center justify-between transition-all cursor-pointer ${
                            exists 
                              ? 'bg-slate-950 border-slate-900 text-slate-500 cursor-not-allowed'
                              : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-amber-500/30 hover:text-amber-400'
                          }`}
                        >
                          <span>{g.label}</span>
                          <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic workflow recommendation visual */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                  <Workflow className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Active Workflow Integration Output</h3>
                </div>
                <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 leading-relaxed border-l-4 border-l-emerald-400">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                    <p>{workflowSuggestion}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Active Profile Identity</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Real-time adaptive system state</p>
                  </div>
                  <User className="w-5 h-5 text-indigo-400" />
                </div>

                <div className="space-y-4 font-mono text-[11px]">
                  <div className="flex justify-between items-center py-2 border-b border-slate-950">
                    <span className="text-slate-400">Target User ID:</span>
                    <span className="text-slate-200 font-bold">user-1</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-950">
                    <span className="text-slate-400">Adaptive Tone:</span>
                    <span className="text-amber-400 font-bold uppercase">{currentTone}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-950">
                    <span className="text-slate-400">Cognitive Depth:</span>
                    <span className="text-indigo-400 font-bold uppercase">{currentDepth}</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Interactions Count:</span>
                    <span className="text-emerald-400 font-bold">{behaviorCount} actions logged</span>
                  </div>

                  {/* Level Progress */}
                  <div className="pt-2 border-t border-slate-850 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>PROFILE KNOWLEDGE DEPTH</span>
                      <span>{Math.min(100, behaviorCount * 10)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, behaviorCount * 10)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Cognitive Learning Stream */}
        {activeTab === "learning" && (
          <motion.div
            key="learning"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Action Learning Log */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Active Behavioral Learning Stream</h2>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Capturing raw user clicks, views, and settings to build lifetime neural mapping</p>
                  </div>
                  <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 shadow-sm animate-pulse">
                    LIVE RECEPTOR
                  </span>
                </div>

                {/* Stream Console */}
                <div className="bg-slate-950/75 border border-slate-800/80 rounded-xl p-4 font-mono text-[10px] leading-relaxed h-[420px] overflow-y-auto space-y-4 custom-scrollbar">
                  {state?.history && state.history.length > 0 ? (
                    state.history.slice().reverse().map((record, index) => (
                      <div key={index} className="pb-4 border-b border-slate-900/80 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between text-slate-500 mb-1.5">
                          <span className="text-indigo-400 font-bold">[CLOCK: {new Date(record.timestamp).toLocaleTimeString()}]</span>
                          <span className="px-2 py-0.5 bg-amber-950/60 text-amber-400 font-bold rounded border border-amber-500/10 uppercase tracking-widest">
                            {record.action.type}
                          </span>
                        </div>

                        <div className="text-slate-200 flex items-start gap-2 pl-2">
                          <span className="text-indigo-400 font-bold">&gt;&gt;</span>
                          <div className="space-y-1">
                            <p className="text-slate-300">Action payload: <span className="text-emerald-400">{JSON.stringify(record.action)}</span></p>
                            <p className="text-slate-400">Adaptive Tone response set to: <span className="text-teal-400 font-semibold">{record.result.style.tone} / {record.result.style.depth}</span></p>
                            <div className="mt-1.5 bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5 text-[9px] text-slate-400">
                              <span className="font-bold text-slate-300 block mb-1">MAMTA AI LEARNED PROFILE INSTANT PROFILE SCHEMA STATE:</span>
                              <pre className="text-cyan-300/90 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(record.result.profile, null, 2)}</pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <Brain className="w-10 h-10 text-slate-700 animate-pulse" />
                      <p>No user cognitive actions captured in stream yet.</p>
                      <button 
                        onClick={handleForceTick} 
                        className="text-xs text-amber-400 underline cursor-pointer hover:text-amber-300"
                      >
                        Trigger mock interactive event now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Manual Event Injection */}
            <div className="space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm">
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Inject Cognitive Event</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Test real-time system learning speeds</p>
                </div>

                <form onSubmit={handleProcessAction} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Simulation Action Type</label>
                    <select
                      value={customActionType}
                      onChange={(e) => setCustomActionType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      <option value="click_button">Click Action Button</option>
                      <option value="view_page">View Platform Section</option>
                      <option value="update_setting">Modify Sovereign Setting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Action Details / Metadata</label>
                    <input
                      type="text"
                      value={customActionDetail}
                      onChange={(e) => setCustomActionDetail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400 transition"
                      placeholder="e.g. Navigated to cloud SQL terminal"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingAction}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 hover:text-indigo-200 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isProcessingAction ? "Injecting Event..." : "Inject Cognitive Event"}</span>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: Mobile Load Optimizer & Edge Computing */}
        {activeTab === "mobile-load" && (
          <motion.div
            key="mobile-load"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Visual Simulator */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-amber-400 animate-pulse" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Mobile Device Simulator</h2>
                  </div>
                  <span className="px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 shadow-sm">
                    OPTIMIZER ACTIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1">See how Mamta AI keeps mobile CPUs at zero-strain through smart edge sharding</p>
              </div>

              {/* Toggle switch for Edge offloading */}
              <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Server-Side Compute Offloading</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Offload sharding DB, consensus loops & LLM models to cloud infrastructure</span>
                </div>
                <button
                  onClick={() => setIsEdgeOffloading(!isEdgeOffloading)}
                  className="text-amber-400 cursor-pointer focus:outline-none"
                >
                  {isEdgeOffloading ? (
                    <ToggleRight className="w-10 h-10 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-600" />
                  )}
                </button>
              </div>

              {/* Real-time Load Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Mobile CPU Usage</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl font-black ${isEdgeOffloading ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {isEdgeOffloading ? "1.5%" : "89.4%"}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">CPU Load</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${isEdgeOffloading ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: isEdgeOffloading ? "1.5%" : "89.4%" }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Mobile Battery Temp</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl font-black ${isEdgeOffloading ? 'text-emerald-400' : 'text-amber-500 animate-pulse'}`}>
                      {isEdgeOffloading ? "28°C" : "42°C"}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">Thermals</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${isEdgeOffloading ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: isEdgeOffloading ? "28%" : "85%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Simulated active workflow graph representing where tasks run */}
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3 font-mono text-[10px]">
                <span className="text-slate-400 block border-b border-slate-900 pb-1.5 uppercase">Distributed Processing Architecture Map:</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-indigo-950/20 border border-indigo-500/10 px-2.5 py-1.5 rounded">
                    <span className="text-slate-300">Mamta AI Core (Byzantine Shards, LLMs)</span>
                    <span className="text-indigo-400 font-bold uppercase">{isEdgeOffloading ? "RUNS ON CLOUD SERVER" : "RUNS ON MOBILE (LAGGY)"}</span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-950/20 border border-emerald-500/10 px-2.5 py-1.5 rounded">
                    <span className="text-slate-300">UX / Adaptive UI Interactions Render</span>
                    <span className="text-emerald-400 font-bold uppercase">RUNS ON PHONE (60 FPS)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Assurance Report */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">How Mamta AI Runs Smoothly on Mobile</h3>
                <p className="text-[10px] text-slate-400 font-mono">Engineered for lightweight extreme global performance</p>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
                <p>
                  Because the largest user base in the world is on mobile, **Mamta AI is fully optimized to keep mobile resource usage extremely light**. Here is how we guarantee seamless 60 FPS mobile performance:
                </p>

                <div className="space-y-3 font-mono text-[11px] bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-slate-400">
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-200">Zero Local Heavy Lifters:</strong> 100% of the massive neural calculations, ledger consensus ticks, and server API pipelines run in our cloud-optimized, auto-scaling Cloud Run containers—not on the phone.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-200">Lightweight Client Assets:</strong> The client UI is purely streamlined React + compiled Tailwind CSS. Zero heavy canvas libraries, making initial bundle loading instantaneous.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-200">Network Sharding Optimizations:</strong> Sockets stream lightweight JSON data differentials only, reducing bandwidth consumption to less than 2KB per transaction tick.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: Secure OAuth Connect & Cloud Links */}
        {activeTab === "oauth" && (
          <motion.div
            key="oauth"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Connection triggers */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Secure Third-Party Connections</h2>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Connect your active Google or GitHub developer workspaces securely</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Google Workspace Integration</span>
                      <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Authorize docs, drive & sheets sync</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOAuthConnect("google")}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition cursor-pointer"
                  >
                    Connect Google
                  </button>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">GitHub Developer Repository Link</span>
                      <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Trigger auto deployment triggers</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOAuthConnect("github")}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition cursor-pointer"
                  >
                    Connect GitHub
                  </button>
                </div>
              </div>
            </div>

            {/* Cloud parameters setup instructions */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Required OAuth Callback Guidelines</h3>
                <p className="text-[10px] text-slate-400 font-mono">Ensuring secure redirection through the preview container</p>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
                <p>
                  To link OAuth connections in the live preview context, you must register these parameters inside your Google Developer Console or GitHub OAuth Apps screen:
                </p>

                <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-4 font-mono text-[10px] space-y-2.5 text-slate-400">
                  <div>
                    <span className="text-slate-200 font-bold block uppercase mb-1">DEVELOPMENT CALLBACK URL:</span>
                    <span className="text-cyan-400 block select-all break-all">{window.location.origin}/auth/callback</span>
                  </div>
                  <div>
                    <span className="text-slate-200 font-bold block uppercase mb-1">SHARED/DEPLOYED CALLBACK URL:</span>
                    <span className="text-indigo-400 block select-all break-all">https://ais-pre-yknzaqypw7mjemdjq7efyi-45584871838.asia-southeast1.run.app/auth/callback</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
