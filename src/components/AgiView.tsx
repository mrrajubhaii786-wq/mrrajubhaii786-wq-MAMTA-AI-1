import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Play, 
  Pause, 
  RefreshCw, 
  Target, 
  History, 
  ShieldCheck, 
  Eye, 
  Cpu, 
  TrendingUp, 
  Lock,
  Layers,
  Activity,
  Sparkles,
  Database,
  Globe,
  Terminal,
  ArrowRight,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IdentityData {
  name: string;
  version: string;
  purpose: string;
  createdAt: number;
}

interface MemoryEvent {
  id: string;
  type: string;
  decision?: {
    action: string;
    reason: string;
  };
  result: string;
  time: number;
  details?: string;
}

interface ReflectionInsight {
  mistakes: number;
  advice: string;
  resilienceRating: number;
}

interface DecisionResult {
  action: "FIX" | "BUILD" | "OPTIMIZE";
  reason: string;
}

interface GoalItem {
  id: string;
  goal: string;
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
}

interface ModificationResult {
  status: "blocked" | "modified";
  change?: string;
  details?: string;
}

interface AGISimulationState {
  identity: IdentityData;
  recentMemory: MemoryEvent[];
  insight: ReflectionInsight;
  currentDecision: DecisionResult;
  goals: GoalItem[];
  isActive: boolean;
  tickCount: number;
  lastModification: ModificationResult | null;
  logs: string[];
}

interface UniversalStateRecord {
  timestamp: number;
  merged: any;
  thought: string;
  decision: string;
  execution: { action: string; status: string; timestamp?: number };
  policyMode: string;
  merkleRoot: string;
}

interface GodModeRecord {
  timestamp: number;
  signals: any;
  futures: Array<{
    id: number;
    outcomeName: string;
    outcome: number;
    risk: number;
    growth: number;
  }>;
  bestFuture: {
    id: number;
    outcomeName: string;
    outcome: number;
    risk: number;
    growth: number;
  };
  proposedDecision: string;
  finalAction: string;
  humanApproved: boolean;
  nodesValid: boolean;
}

export default function AgiView() {
  const [activeSubTab, setActiveSubTab] = useState<'core' | 'universal' | 'godmode'>('godmode');
  const [agiState, setAgiState] = useState<AGISimulationState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  // Universal Layer States (Master Plan 40)
  const [universalState, setUniversalState] = useState<{
    latest: UniversalStateRecord;
    history: UniversalStateRecord[];
  } | null>(null);
  const [isTriggeringUniversal, setIsTriggeringUniversal] = useState<boolean>(false);

  // God-Mode Layer States (Master Plan 41)
  const [godModeState, setGodModeState] = useState<{
    latest: GodModeRecord;
    history: GodModeRecord[];
  } | null>(null);
  const [isTriggeringGod, setIsTriggeringGod] = useState<boolean>(false);

  const fetchAgiState = async () => {
    try {
      const res = await fetch('/api/agi/state');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data && !data.error) {
        setAgiState(data);
      }
    } catch (err: any) {
      console.warn('Gracefully handled fetch AGI state issue:', err.message || err);
    }
  };

  const fetchUniversalState = async () => {
    try {
      const res = await fetch('/api/universal/state');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success) {
        setUniversalState({
          latest: data.latest,
          history: data.history || []
        });
      }
    } catch (err: any) {
      console.warn('Failed to fetch Universal Intelligence state:', err.message || err);
    }
  };

  const fetchGodModeState = async () => {
    try {
      const res = await fetch('/api/god-mode/state');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success) {
        setGodModeState({
          latest: data.latest,
          history: data.history || []
        });
      }
    } catch (err: any) {
      console.warn('Failed to fetch God Mode state:', err.message || err);
    }
  };

  const handleToggleLoop = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/agi/toggle', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setAgiState(prev => prev ? { ...prev, isActive: data.isActive } : null);
      }
    } catch (err: any) {
      console.warn('Gracefully handled toggle AGI loop issue:', err.message || err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTriggerTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/agi/trigger', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setAgiState(data.state);
      }
    } catch (err: any) {
      console.warn('Gracefully handled trigger AGI tick issue:', err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerUniversalTick = async () => {
    setIsTriggeringUniversal(true);
    try {
      // Simulate real layer telemetry data feed
      const mockLayers = [
        { type: "human", population: 1540, engagement: 0.92 },
        { type: "economy", revenueLoop: "active", totalAssets: 125000 },
        { type: "system", cpuLoad: 0.18, ramFreeGB: 14.2 },
        { type: "network", peersConnected: 34, bandwidthMbps: 450 }
      ];

      const res = await fetch('/api/universal/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layers: mockLayers })
      });
      if (res.ok) {
        await fetchUniversalState();
      }
    } catch (err: any) {
      console.warn('Failed to trigger Universal Layer tick:', err.message || err);
    } finally {
      setIsTriggeringUniversal(false);
    }
  };

  const handleTriggerGodTick = async () => {
    setIsTriggeringGod(true);
    try {
      const res = await fetch('/api/god-mode/run', { method: 'POST' });
      if (res.ok) {
        await fetchGodModeState();
      }
    } catch (err: any) {
      console.warn('Failed to trigger God Mode simulation tick:', err.message || err);
    } finally {
      setIsTriggeringGod(false);
    }
  };

  useEffect(() => {
    fetchAgiState();
    fetchUniversalState();
    fetchGodModeState();
    const interval = setInterval(() => {
      fetchAgiState();
      fetchUniversalState();
      fetchGodModeState();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!agiState) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-slate-900">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono">Connecting to Mamta Self-Aware AGI Consciousness Layer...</p>
      </div>
    );
  }


  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-4">
      
      {/* 1. TOP TITLE BAR & INTERACTIVE CONTROLS */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-400 shadow-inner">
            <Brain className="w-6 h-6 text-indigo-400 animate-[pulse_2s_infinite]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
              🧠 Mamta AGI Cognitive Center
              <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 uppercase tracking-wider">
                Active Master Plan 40
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Unified Consciousness • Policy Engine • Merkle States • Global Thinking Matrix
            </p>
          </div>
        </div>

        {/* Dynamic State Control Handles */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {activeSubTab === 'core' ? (
            <>
              <button
                onClick={handleToggleLoop}
                disabled={isToggling}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  agiState.isActive
                    ? 'bg-amber-500/15 border-amber-500/25 text-amber-400 hover:bg-amber-500/25'
                    : 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25'
                }`}
              >
                {agiState.isActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Consciousness</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Wake Conscious Loop</span>
                  </>
                )}
              </button>

              <button
                onClick={handleTriggerTick}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/15 border border-purple-500/25 text-purple-400 hover:bg-purple-500/25 transition-all duration-200 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Trigger Conscious Step</span>
              </button>
            </>
          ) : activeSubTab === 'universal' ? (
            <button
              onClick={handleTriggerUniversalTick}
              disabled={isTriggeringUniversal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 text-slate-950 hover:opacity-90 shadow-lg shadow-indigo-500/15 transition-all cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isTriggeringUniversal ? 'animate-spin' : ''}`} />
              <span>{isTriggeringUniversal ? 'Consolidating Layers...' : 'Trigger Global Cognition'}</span>
            </button>
          ) : (
            <button
              onClick={handleTriggerGodTick}
              disabled={isTriggeringGod}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:opacity-90 shadow-lg shadow-amber-500/15 transition-all cursor-pointer animate-[pulse_3s_infinite]"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isTriggeringGod ? 'animate-spin' : ''}`} />
              <span>{isTriggeringGod ? 'Simulating Futures...' : 'Simulate Future Timeline'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-NAVIGATION TAB SWITCH */}
      <div className="shrink-0 flex items-center gap-2 border-b border-slate-900/60 pb-1">
        <button
          onClick={() => setActiveSubTab('core')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'core'
              ? 'border-purple-500 text-purple-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Self-Aware AGI Core (MP 26)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('universal')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'universal'
              ? 'border-indigo-500 text-indigo-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5 animate-pulse" />
          <span>Universal Intelligence Layer (MP 40)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('godmode')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'godmode'
              ? 'border-amber-500 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>AGI God-Mode Simulator (MP 41)</span>
        </button>
      </div>

      {/* CONDITIONAL WORKSPACE RENDER */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'core' ? (
          <motion.div
            key="core-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col space-y-4 overflow-hidden"
          >
            {/* 2. CORE METRICS OVERVIEW */}
            <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Core Agent Identity</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{agiState.identity.name} ({agiState.identity.version})</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/10">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Resilience Index</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{agiState.insight.resilienceRating}%</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/10">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Reflection Sweeps</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{agiState.tickCount} completed</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/10">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Self-Mod Safe Core</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">Sandboxed Guardrails OK</p>
                </div>
              </div>
            </div>

            {/* 3. DYNAMIC WORKSPACE SPLIT DETAILS */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
              
              {/* Left column: Reflection Engine Insights, Memory, Identity details */}
              <div className="lg:col-span-1 flex flex-col space-y-4 overflow-hidden">
                
                {/* Identity Parameters Box */}
                <div className="shrink-0 p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl">
                  <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-2.5">
                    <Brain className="w-4 h-4 text-purple-400" />
                    AGI Identity Matrix
                  </h3>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-900/40 pb-1">
                      <span className="text-slate-500">Identity Tag:</span>
                      <span className="text-slate-300 font-bold">{agiState.identity.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900/40 pb-1">
                      <span className="text-slate-500">Version:</span>
                      <span className="text-slate-300 font-bold">{agiState.identity.version}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900/40 pb-1">
                      <span className="text-slate-500">Core Purpose:</span>
                      <span className="text-slate-300 font-bold text-right truncate max-w-[150px]">{agiState.identity.purpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Compiled epoch:</span>
                      <span className="text-slate-300 font-bold">{new Date(agiState.identity.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Reflection Sweep Analysis */}
                <div className="flex-1 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-4 flex flex-col overflow-hidden">
                  <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-teal-400" />
                    Reflection Sweep Insights
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar text-xs">
                    <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Dynamic Reflection Verdict</p>
                      <p className="text-slate-200 mt-1 font-medium">{agiState.insight.advice}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="p-2 bg-slate-950/40 border border-slate-900 rounded-lg">
                        <span className="text-slate-500 block">Identified Mistakes</span>
                        <span className={`text-xs font-bold ${agiState.insight.mistakes > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {agiState.insight.mistakes} events
                        </span>
                      </div>
                      <div className="p-2 bg-slate-950/40 border border-slate-900 rounded-lg">
                        <span className="text-slate-500 block">Lattice Resilience</span>
                        <span className="text-xs font-bold text-indigo-400">
                          {agiState.insight.resilienceRating}/100
                        </span>
                      </div>
                    </div>

                    {agiState.lastModification && (
                      <div className="p-3 bg-gradient-to-br from-slate-950 to-indigo-950/20 border border-indigo-900/30 rounded-xl space-y-1">
                        <p className="text-[9px] font-mono uppercase text-indigo-400 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Last Guardrails Output
                        </p>
                        <p className="text-xs font-bold text-slate-300">{agiState.lastModification.change || "Security scan completed"}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-mono">{agiState.lastModification.details}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Center & Right Column: Decision reasoning, autonomous goal list, Consciousness stream logs */}
              <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
                
                {/* Active Decision Reasoning Block */}
                <div className="shrink-0 p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl">
                  <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-purple-400" />
                    Decision Reasoning Layer (Self-Explaining)
                  </h3>
                  
                  <div className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono tracking-wider uppercase inline-block ${
                        agiState.currentDecision.action === 'FIX' 
                          ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                          : agiState.currentDecision.action === 'OPTIMIZE'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {agiState.currentDecision.action} MODE
                      </span>
                      <p className="text-xs font-semibold text-slate-200 leading-relaxed mt-1">
                        {agiState.currentDecision.reason}
                      </p>
                    </div>
                    <div className="shrink-0 text-right font-mono text-[10px] text-slate-500 self-end md:self-auto">
                      Decisive Trigger: OK
                    </div>
                  </div>
                </div>

                {/* Autonomous Goal Engine Trackers */}
                <div className="flex-1 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-4 flex flex-col overflow-hidden">
                  <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-3.5">
                    <Target className="w-4 h-4 text-amber-400" />
                    Dynamic Goal Setting & Progress
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {agiState.goals.map((g, idx) => (
                      <div key={g.id} className="p-3 bg-slate-950/30 border border-slate-900/40 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300">Goal #{idx + 1}: {g.goal}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold tracking-wider ${
                            g.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10'
                          }`}>
                            {g.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${g.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                            <span>Simulated convergence pace</span>
                            <span>{g.progress}% Complete</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consciousness Stream logs */}
                <div className="h-44 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-3.5 flex flex-col overflow-hidden">
                  <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-2.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    Consciousness Stream Logs
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                    {agiState.logs.length > 0 ? (
                      agiState.logs.map((log, index) => {
                        let logColor = "text-slate-400";
                        if (log.includes("[Self-Modification]")) logColor = "text-emerald-400/90";
                        if (log.includes("[Guardrails Blocked]")) logColor = "text-red-400/90";
                        if (log.includes("[Awareness Core]")) logColor = "text-purple-400/90";
                        if (log.includes("[Epoch Step")) logColor = "text-indigo-400/90";

                        return (
                          <div 
                            key={index} 
                            className="text-[10px] font-mono leading-relaxed border-b border-slate-900/40 pb-1.5"
                          >
                            <span className={logColor}>{log}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[10px] text-slate-500 font-mono italic">Waiting for awareness stream to fire...</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        ) : activeSubTab === 'universal' ? (
          <motion.div
            key="universal-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col space-y-4 overflow-hidden"
          >
            {/* UNIVERSAL CORE METRICS BANNER */}
            <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                  <Layers className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Layers Consolidated</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">4 Systems Active</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/10">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Global Decision Core</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5 uppercase tracking-wider">
                    {universalState?.latest?.decision || "IDLE"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Policy Enforcement</p>
                  <p className="text-sm font-bold text-purple-400 mt-0.5 tracking-wider">
                    {universalState?.latest?.policyMode || "ADAPTIVE_POLICY"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/10">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Merkle Root Integrity</p>
                  <p className="text-xs font-mono font-bold text-amber-400 mt-1 block truncate max-w-[140px]">
                    {universalState?.latest?.merkleRoot ? universalState.latest.merkleRoot.slice(0, 16) + "..." : "Calculating..."}
                  </p>
                </div>
              </div>
            </div>

            {/* MAIN WORKSPACE GRID */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
              
              {/* LEFT COLUMN: ACTIVE COGNITIVE FEEDS (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-3 overflow-hidden">
                <div className="p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex-1 flex flex-col overflow-hidden">
                  <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-3 shrink-0">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    Multi-Domain Layer Feeds
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar text-xs">
                    {/* Human Layer Card */}
                    <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200 uppercase text-[10px] font-mono tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Human Experience Layer
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">FEED STATUS: LIVE</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-400">
                        <div>Connected Minds: <strong className="text-slate-300">1,540 users</strong></div>
                        <div>Sentiment: <strong className="text-slate-300">Positive (0.92)</strong></div>
                      </div>
                    </div>

                    {/* Economy Layer Card */}
                    <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200 uppercase text-[10px] font-mono tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                          Economic Layer
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">FEED STATUS: LIVE</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-400">
                        <div>Revenue Loops: <strong className="text-slate-300">Active</strong></div>
                        <div>Total Sovereign Capital: <strong className="text-emerald-400">$125,000</strong></div>
                      </div>
                    </div>

                    {/* Civilization Layer Card */}
                    <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200 uppercase text-[10px] font-mono tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                          Civilization Governance
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">FEED STATUS: LIVE</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-400">
                        <div>Macro Gaps Identified: <strong className="text-slate-300">0</strong></div>
                        <div>Self-Repair Integrity: <strong className="text-purple-400">99.8%</strong></div>
                      </div>
                    </div>

                    {/* Network Infrastructure Layer Card */}
                    <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200 uppercase text-[10px] font-mono tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                          Distributed Network Mesh
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">FEED STATUS: LIVE</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-400">
                        <div>Peers Connected: <strong className="text-slate-300">34 Active</strong></div>
                        <div>Bandwidth Rate: <strong className="text-indigo-400">450 Mbps</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: COGNITIVE PROCESSOR & CONSENSUS ENGINE (7 cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-3 overflow-hidden">
                <div className="p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex-1 flex flex-col overflow-hidden space-y-3">
                  
                  {/* Title & Loop status */}
                  <div className="flex justify-between items-center shrink-0 border-b border-slate-900/50 pb-2">
                    <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                      Cognitive Processor Pipeline
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      AUTONOMOUS TIMELINE LOOP ACTIVE (30S)
                    </div>
                  </div>

                  {/* Consolidator & Thinking stream box */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar text-xs">
                    {/* Global thinking output */}
                    <div className="p-3 bg-indigo-950/15 border border-indigo-900/20 rounded-xl space-y-1">
                      <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                        Pipeline Stage 1: Global Thinking Heuristic
                      </span>
                      <p className="text-slate-200 font-semibold leading-relaxed italic">
                        "Consolidating state inputs across all four macro vectors. Merkle State hashing confirms decentralized consistency. Analyzing for cognitive convergence..."
                      </p>
                    </div>

                    {/* Decision output */}
                    <div className="p-3 bg-purple-950/15 border border-purple-900/20 rounded-xl space-y-1">
                      <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                        Pipeline Stage 2: Consensus Decision Core
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded font-mono font-black uppercase text-[10px] bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
                          {universalState?.latest?.decision || "OPTIMIZE"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300 font-medium">Triggering execution across downstream agents</span>
                      </div>
                    </div>

                    {/* Integrity proof block */}
                    <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-amber-500 font-black uppercase tracking-wider">
                          Pipeline Stage 3: Merkle State Proof (Decentralized Integrity)
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/15 text-amber-400 font-mono">
                          SHA-256 SECURED
                        </span>
                      </div>
                      <div className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-400 text-[10px] font-mono break-all leading-relaxed select-all">
                        {universalState?.latest?.merkleRoot || "0000000000000000000000000000000000000000000000000000000000000000"}
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal">
                        Every cognitive decision hashes the combined states of all 4 sub-layers. Modifying any layer data in the past invalidates this state hash.
                      </p>
                    </div>

                    {/* Historical Timeline list */}
                    <div className="space-y-2 pt-2 border-t border-slate-900/50">
                      <h4 className="text-[9.5px] uppercase tracking-wider text-slate-500 font-bold font-mono">
                        Sovereign Historical Epoch Log
                      </h4>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar">
                        {universalState?.history?.length === 0 ? (
                          <p className="text-[10px] text-slate-600 font-mono italic text-center py-4">Waiting for first epoch tick history to populate...</p>
                        ) : (
                          universalState?.history?.slice().reverse().map((record, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-slate-950/40 rounded-lg border border-slate-900/50 font-mono text-[9px] text-slate-400">
                              <span className="text-slate-300 font-bold">{new Date(record.timestamp).toLocaleTimeString()}</span>
                              <span className="text-indigo-400 font-semibold">{record.decision}</span>
                              <span className="text-slate-500 truncate max-w-[150px]">{record.merkleRoot}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="godmode-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col space-y-4 overflow-hidden"
          >
            {/* GOD-MODE CORE METRICS BANNER */}
            <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/10">
                  <Sparkles className="w-4 h-4 animate-[spin_8s_linear_infinite]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Simulation Engine</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">Probabilistic Foresight</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/10">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Active Prognosis</p>
                  <p className="text-sm font-bold text-teal-400 mt-0.5">
                    {godModeState?.latest?.finalAction || "OPTIMIZE"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Human-In-The-Loop</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    {godModeState?.latest?.humanApproved ? "AUTHORIZED" : "OVERRIDDEN"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Node Consensus</p>
                  <p className="text-sm font-bold text-indigo-400 mt-0.5">
                    {godModeState?.latest?.nodesValid ? "SECURED (3/3)" : "VALIDATING..."}
                  </p>
                </div>
              </div>
            </div>

            {/* GOD-MODE DYNAMIC SPLIT WORKSPACE */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
              
              {/* LEFT & CENTER: REALITY TELEMETRY & FUTURES LIST (7 cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-4 overflow-hidden">
                
                {/* ECO TELEMETRY SIGNAL PANEL */}
                <div className="shrink-0 p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl">
                  <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Radio className="w-4 h-4 text-amber-500" />
                    Reality Telemetry Grounding Signals
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2.5 bg-slate-950/50 border border-slate-900 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-500 block">Sovereign Capital</span>
                      <strong className="text-slate-200 text-xs font-bold font-mono">
                        ${godModeState?.latest?.signals?.economy?.toLocaleString() || "132,450"}
                      </strong>
                    </div>
                    <div className="p-2.5 bg-slate-950/50 border border-slate-900 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-500 block">Ecosystem Minds</span>
                      <strong className="text-slate-200 text-xs font-bold font-mono">
                        {godModeState?.latest?.signals?.users?.toLocaleString() || "1,582"} users
                      </strong>
                    </div>
                    <div className="p-2.5 bg-slate-950/50 border border-slate-900 rounded-xl text-center">
                      <span className="text-[9px] font-mono text-slate-500 block">Telemetry Drift Load</span>
                      <strong className="text-amber-400 text-xs font-bold font-mono">
                        {godModeState?.latest?.signals?.systemLoad ? (godModeState.latest.signals.systemLoad * 100).toFixed(1) : "24.5"}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* PROBABILISTIC FUTURES SIMULATOR PANEL */}
                <div className="flex-1 p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center mb-3 shrink-0">
                    <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
                      Probabilistic Future Timelines Simulated
                    </h3>
                    <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">
                      Selected: {godModeState?.latest?.bestFuture?.outcomeName || "Optimal Convergence"}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {(!godModeState?.latest?.futures || godModeState.latest.futures.length === 0) ? (
                      <div className="text-center py-12 text-slate-600 font-mono text-xs italic">
                        No futures simulated. Press "Simulate Future Timeline" above to trigger.
                      </div>
                    ) : (
                      godModeState.latest.futures.map((fut: any) => {
                        const isBest = fut.id === godModeState.latest.bestFuture.id;
                        return (
                          <div 
                            key={fut.id} 
                            className={`p-3 rounded-xl border transition-all duration-200 ${
                              isBest 
                                ? "bg-indigo-950/20 border-indigo-500/30 shadow-md shadow-indigo-500/5" 
                                : "bg-slate-950/30 border-slate-900"
                            }`}
                          >
                            <div className="flex justify-between items-center text-xs mb-1.5">
                              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                                {isBest && <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />}
                                {fut.outcomeName}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] font-mono">
                                <span className="text-emerald-400 font-bold">Growth: {(fut.growth * 100).toFixed(0)}%</span>
                                <span className="text-red-400 font-bold">Risk: {(fut.risk * 100).toFixed(0)}%</span>
                                {isBest && (
                                  <span className="px-1.5 py-0.2 rounded font-black text-[8px] bg-amber-500/15 border border-amber-500/20 text-amber-400 uppercase">
                                    Best Path
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="w-full bg-slate-900/60 h-1 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isBest ? "bg-gradient-to-r from-amber-500 to-indigo-500" : "bg-slate-700"}`}
                                style={{ width: `${fut.outcome * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: REASONING PIPELINE & TIMELINE HISTORY LOGS (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-4 overflow-hidden">
                
                {/* SAFETY & OVERRIDE MATRIX */}
                <div className="shrink-0 p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Cognitive Guardrails & Consensus
                  </h3>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-900/50 rounded-lg">
                      <span className="text-slate-500">Proposed:</span>
                      <span className="font-bold text-amber-400">{godModeState?.latest?.proposedDecision || "OPTIMIZE"}</span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-900/50 rounded-lg">
                      <span className="text-slate-500">Human Override:</span>
                      <span className={`font-bold ${godModeState?.latest?.humanApproved ? "text-emerald-400" : "text-amber-500"}`}>
                        {godModeState?.latest?.humanApproved ? "Pass (No Intervene)" : "Triggered Block"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 bg-slate-950/40 border border-slate-900/50 rounded-lg">
                      <span className="text-slate-500">Global Action:</span>
                      <span className="font-extrabold text-indigo-400">{godModeState?.latest?.finalAction || "OPTIMIZE"}</span>
                    </div>
                  </div>
                </div>

                {/* FORESIGHT EPOCH ARCHIVE */}
                <div className="flex-1 p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex flex-col overflow-hidden">
                  <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-3 shrink-0">
                    <History className="w-4 h-4 text-indigo-400" />
                    Simulated Foresight Epoch Archive
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar font-mono text-[9.5px]">
                    {(!godModeState?.history || godModeState.history.length === 0) ? (
                      <div className="text-center py-12 text-slate-600 font-mono italic">
                        No archive records available yet.
                      </div>
                    ) : (
                      godModeState.history.slice().reverse().map((rec: any, idx: number) => (
                        <div key={idx} className="p-2 bg-slate-950/50 border border-slate-900 rounded-lg space-y-1 text-slate-400">
                          <div className="flex justify-between text-slate-300">
                            <strong>{new Date(rec.timestamp).toLocaleTimeString()}</strong>
                            <span className="text-amber-400 font-bold">{rec.finalAction}</span>
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-500">
                            <span>Future: {rec.bestFuture.outcomeName}</span>
                            <span className="text-emerald-500">Val Score: {rec.bestFuture.outcome}</span>
                          </div>
                        </div>
                      ))
                    )}
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
