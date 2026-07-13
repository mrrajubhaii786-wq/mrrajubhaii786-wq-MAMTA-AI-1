import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Play, 
  Pause, 
  Cpu, 
  Zap, 
  Network, 
  Database, 
  TrendingUp, 
  Users, 
  Activity, 
  RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserAgent {
  id: number;
  money: number;
  interest: string;
  status: string;
  lastAction: string;
}

interface MultiverseWorld {
  id: string;
  name: string;
  population: {
    users: UserAgent[];
  };
  events: string[];
}

interface UniverseInstance {
  id: number;
  name: string;
  worlds: MultiverseWorld[];
}

interface MemoryRecord {
  model: {
    strategy: number;
    risk: number;
    behavior: string;
  };
  score: number;
  timestamp: string;
  worldName: string;
}

interface MultiverseSimulationState {
  universes: UniverseInstance[];
  memoryHistory: MemoryRecord[];
  bestModel: MemoryRecord | null;
  isActive: boolean;
  tickCount: number;
  logs: string[];
}

export default function MultiverseView() {
  const [multiverseState, setMultiverseState] = useState<MultiverseSimulationState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);

  // Fetch real-time multiverse state
  const fetchMultiverseState = async () => {
    try {
      const res = await fetch('/api/multiverse/state');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data && !data.error) {
        setMultiverseState(data);
        // Default select first world if not set
        if (!selectedWorldId && data.universes?.[0]?.worlds?.[0]) {
          setSelectedWorldId(data.universes[0].worlds[0].id);
        }
      }
    } catch (err: any) {
      console.warn('Gracefully handled fetch multiverse state issue:', err.message || err);
    }
  };

  // Toggle simulation auto loop
  const handleToggleLoop = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/multiverse/toggle', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setMultiverseState(prev => prev ? { ...prev, isActive: data.isActive } : null);
      }
    } catch (err: any) {
      console.warn('Gracefully handled toggle multiverse loop issue:', err.message || err);
    } finally {
      setIsToggling(false);
    }
  };

  // Trigger manual simulation step
  const handleTriggerTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/multiverse/trigger', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setMultiverseState(data.state);
      }
    } catch (err: any) {
      console.warn('Gracefully handled trigger multiverse tick issue:', err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMultiverseState();
    const interval = setInterval(fetchMultiverseState, 5000);
    return () => clearInterval(interval);
  }, [selectedWorldId]);

  if (!multiverseState) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-slate-900">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono">Connecting to Multiverse AGI Evolution Core...</p>
      </div>
    );
  }

  const selectedWorld = multiverseState.universes
    .flatMap(u => u.worlds)
    .find(w => w.id === selectedWorldId);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-4">
      
      {/* 1. TOP HEADER & SYSTEM CONTROLS */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
            <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '40s' }} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
              🌌 Multiverse AGI Simulation Mode
              <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 uppercase tracking-wider">
                Active Master Plan 25
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Mamta AI → Self-Evolving Multiverse Intelligence System (AI Creates AI)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            onClick={handleToggleLoop}
            disabled={isToggling}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              multiverseState.isActive
                ? 'bg-amber-500/15 border-amber-500/25 text-amber-400 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25'
            }`}
          >
            {multiverseState.isActive ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Auto-Evolution</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Auto-Evolution</span>
              </>
            )}
          </button>

          <button
            onClick={handleTriggerTick}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/25 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Trigger Epoch Step</span>
          </button>
        </div>
      </div>

      {/* 2. SYSTEM STATUS METRICS GRID */}
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Universes Linked</p>
            <p className="text-sm font-bold text-slate-200 mt-0.5">{multiverseState.universes.length}</p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Active Worlds</p>
            <p className="text-sm font-bold text-slate-200 mt-0.5">
              {multiverseState.universes.reduce((acc, curr) => acc + curr.worlds.length, 0)}
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/10">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Epoch Tick Index</p>
            <p className="text-sm font-bold text-slate-200 mt-0.5">{multiverseState.tickCount}</p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Top World Fitness</p>
            <p className="text-sm font-bold text-slate-200 mt-0.5">
              {multiverseState.bestModel ? `$${multiverseState.bestModel.score.toFixed(1)}` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE SPLIT PANEL */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        
        {/* Left Column: Multiverse Tree & Shared Memory */}
        <div className="lg:col-span-1 flex flex-col space-y-4 overflow-hidden">
          
          {/* Universes & Worlds Selector */}
          <div className="flex-1 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-3.5 flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-3">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              Multiverse Worlds Directory
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {multiverseState.universes.map((u) => (
                <div key={u.id} className="space-y-1.5">
                  <div className="text-[10px] font-bold text-indigo-400 font-mono uppercase px-2 py-0.5 bg-indigo-500/5 border border-indigo-500/10 rounded-md">
                    🌌 {u.name}
                  </div>
                  <div className="space-y-1 pl-1">
                    {u.worlds.map((w) => {
                      const isActiveWorld = selectedWorldId === w.id;
                      const userCount = w.population.users.length;
                      return (
                        <button
                          key={w.id}
                          onClick={() => setSelectedWorldId(w.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            isActiveWorld
                              ? 'bg-gradient-to-r from-indigo-500/10 to-teal-500/5 border-indigo-500/30 text-slate-100 shadow-md'
                              : 'bg-slate-950/20 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isActiveWorld ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'}`} />
                            <span className="text-xs font-medium">{w.name}</span>
                          </div>
                          <span className="text-[9px] font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                            <Users className="w-2.5 h-2.5" />
                            {userCount} Agents
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Evolved Intelligence Model Indicator */}
          <div className="shrink-0 p-4 bg-gradient-to-br from-indigo-950/35 to-purple-950/15 border border-indigo-900/30 rounded-2xl">
            <h3 className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-2.5">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              Highest Fitness Model (AGI survivor)
            </h3>
            {multiverseState.bestModel ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Behavior Strategy:</span>
                  <span className="text-amber-400 font-bold uppercase">{multiverseState.bestModel.model.behavior}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-1.5 bg-slate-950/50 rounded border border-slate-900">
                    <span className="text-slate-500 block">Learning Rate</span>
                    <span className="text-slate-300 font-bold">{(multiverseState.bestModel.model.strategy * 100).toFixed(0)}%</span>
                  </div>
                  <div className="p-1.5 bg-slate-950/50 rounded border border-slate-900">
                    <span className="text-slate-500 block">Risk Matrix</span>
                    <span className="text-slate-300 font-bold">{(multiverseState.bestModel.model.risk * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1 border-t border-indigo-950/40 pt-1.5">
                  <span>Tested on {multiverseState.bestModel.worldName}</span>
                  <span>Fitness: <b className="text-emerald-400 font-bold">${multiverseState.bestModel.score.toFixed(1)}</b></span>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-slate-500 font-mono italic">Waiting for evolution results...</p>
            )}
          </div>
        </div>

        {/* Center & Right Column: Evolving Population View & Memory Log Matrix */}
        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
          
          {/* Evolving Population Details */}
          <div className="flex-1 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-4 flex flex-col overflow-hidden">
            <div className="shrink-0 flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Population Matrix in {selectedWorld ? selectedWorld.name : 'Target World'}
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Live Agent Profiles</span>
            </div>

            {selectedWorld ? (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedWorld.population.users.map((u) => (
                    <div 
                      key={u.id}
                      className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-400">Agent #{u.id}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-semibold bg-slate-900 border border-slate-800 text-slate-400">
                            {u.interest}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono leading-relaxed truncate max-w-[200px]">
                          {u.lastAction}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 font-mono">${u.money.toFixed(1)}</span>
                        <span className="block text-[8px] uppercase tracking-wider text-slate-600 mt-0.5">{u.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs italic">
                Please select a simulated world from the directory.
              </div>
            )}
          </div>

          {/* Evolution Records (Shared Memory Mesh) */}
          <div className="h-44 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-3.5 flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-2.5">
              <Network className="w-3.5 h-3.5 text-purple-400" />
              Shared Memory Mesh Evolved Models
            </h3>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {multiverseState.logs.length > 0 ? (
                multiverseState.logs.map((log, index) => {
                  let logColor = "text-slate-400";
                  if (log.includes("[Evolution]")) logColor = "text-emerald-400/90";
                  if (log.includes("[Multiverse Epoch]")) logColor = "text-indigo-400/90";
                  if (log.includes("[Multiverse Boot]")) logColor = "text-purple-400/90";

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
                <p className="text-[10px] text-slate-500 font-mono italic">Waiting for evolution events to spawn...</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
