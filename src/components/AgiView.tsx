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
  Lock 
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

export default function AgiView() {
  const [agiState, setAgiState] = useState<AGISimulationState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);

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

  useEffect(() => {
    fetchAgiState();
    const interval = setInterval(fetchAgiState, 4000);
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
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-400 shadow-inner">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
              🧠 Self-Aware AGI Core Mode
              <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-purple-500/15 border border-purple-500/25 text-purple-400 uppercase tracking-wider">
                Active Master Plan 26
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Identity Engine • Self Memory • Reflection AI • Autonomous Goal setting
            </p>
          </div>
        </div>

        {/* Dynamic State Control Handles */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
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
        </div>
      </div>

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

    </div>
  );
}
