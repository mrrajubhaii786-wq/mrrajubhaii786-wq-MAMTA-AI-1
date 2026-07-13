import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Compass, 
  Cpu, 
  Activity, 
  Play, 
  Loader2, 
  Radio, 
  Volume2, 
  ShieldCheck, 
  Search, 
  Info,
  Clock,
  Briefcase,
  DollarSign,
  Layers,
  HeartHandshake,
  Sparkles,
  Zap,
  Flame,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RealVoice } from '../voice/RealVoice';

const voice = new RealVoice();

interface SimulatedUser {
  id: number;
  interest: 'AI' | 'Tools' | 'Finance';
  money: number;
  status: 'IDLE' | 'BUYING' | 'BROWSING' | 'SATISFIED';
  lastAction: string;
}

interface WorldInstance {
  id: string;
  name: string;
  population: {
    users: SimulatedUser[];
  };
  demand: number;
  supply: number;
  trend: 'BULL' | 'BEAR';
  events: string[];
  experimentsApplied: string[];
  epochTime: number;
}

interface UniverseState {
  worlds: WorldInstance[];
  isActive: boolean;
  tickCount: number;
  learningObservations: any[];
  autoPlan: string;
  logs: string[];
}

export default function UniverseView() {
  const [universeState, setUniverseState] = useState<UniverseState>({
    worlds: [],
    isActive: true,
    tickCount: 0,
    learningObservations: [],
    autoPlan: "Gathering baseline behavior patterns...",
    logs: ["Initializing Multi-World Simulation interface..."]
  });

  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [wsLastTick, setWsLastTick] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [newWorldName, setNewWorldName] = useState<string>('');
  const [selectedWorldId, setSelectedWorldId] = useState<string>('');
  const [selectedExperiment, setSelectedExperiment] = useState<string>('stimulus');
  const [isCreatingWorld, setIsCreatingWorld] = useState<boolean>(false);
  const [isApplyingExperiment, setIsApplyingExperiment] = useState<boolean>(false);

  // Filter & Search worlds
  const [searchWorldQuery, setSearchWorldQuery] = useState<string>('');

  const socketRef = useRef<WebSocket | null>(null);

  // HTTP API fallback sync
  const fetchUniverseState = async () => {
    try {
      const res = await fetch('/api/universe/state');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON (server may be booting or offline)');
      }
      const data = await res.json();
      if (data && !data.error) {
        setUniverseState(data);
        if (data.worlds.length > 0 && !selectedWorldId) {
          setSelectedWorldId(data.worlds[0].id);
        }
      }
    } catch (err: any) {
      console.warn('Gracefully handling universe state fetch:', err.message || err);
    }
  };

  // WebSocket Connection Lifecycle
  useEffect(() => {
    fetchUniverseState();

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/universe/ws`;
        
        console.log(`Connecting to Universe WebSocket Sync: ${wsUrl}`);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('✅ WebSocket Connected to Mamta AI Universe server');
          setWsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'CONNECT_ACK') {
              console.log('🌍 Connected server acknowledge:', data.message);
            } else if (data.type === 'UNIVERSE_TICK') {
              setWsLastTick(data.tick);
              fetchUniverseState(); // Grab fresh state whenever a background tick occurs
            } else if (data.type === 'EXPERIMENT_TRIGGERED' || data.type === 'WORLD_CREATED') {
              fetchUniverseState();
            }
          } catch (e) {
            // Ignore non-JSON test text states
            if (event.data === '🌍 Universe Connected') {
              setWsConnected(true);
            }
          }
        };

        ws.onclose = () => {
          console.log('❌ WebSocket closed. Reconnecting in 5 seconds...');
          setWsConnected(false);
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (err) => {
          console.error('WebSocket connection error:', err);
          ws.close();
        };

        socketRef.current = ws;
      } catch (err) {
        console.error('Failed to prepare WebSockets, using HTTP fallback mode:', err);
      }
    };

    connectWebSocket();

    // Secondary Polling for maximum reliability
    const pollInterval = setInterval(fetchUniverseState, 6000);

    return () => {
      clearInterval(pollInterval);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Actions
  const handleToggleUniverse = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/universe/toggle', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUniverseState(prev => ({ ...prev, isActive: data.isActive }));
      }
    } catch (err) {
      console.error('Failed to toggle universe loop:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleManualUniverseTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/universe/trigger', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUniverseState(data.state);
        triggerVoiceReport("Universe simulation cycle updated across all world instances.");
      }
    } catch (err) {
      console.error('Failed to trigger manual universe tick:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorld = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorldName.trim()) return;
    setIsCreatingWorld(true);
    try {
      const res = await fetch('/api/universe/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWorldName })
      });
      const data = await res.json();
      if (data.success) {
        setUniverseState(data.state);
        setNewWorldName('');
        triggerVoiceReport(`Created new simulated world named ${newWorldName}`);
      }
    } catch (err) {
      console.error('Failed to create new world:', err);
    } finally {
      setIsCreatingWorld(false);
    }
  };

  const handleLaunchExperiment = async () => {
    if (!selectedWorldId) return;
    setIsApplyingExperiment(true);
    try {
      const res = await fetch('/api/universe/experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worldId: selectedWorldId, experimentId: selectedExperiment })
      });
      const data = await res.json();
      if (data.success) {
        setUniverseState(data.state);
        triggerVoiceReport(`Experiment applied successfully: ${data.message}`);
      }
    } catch (err) {
      console.error('Failed to apply world experiment:', err);
    } finally {
      setIsApplyingExperiment(false);
    }
  };

  const triggerVoiceReport = (text: string) => {
    setIsSpeaking(true);
    voice.speak(text);
    setTimeout(() => setIsSpeaking(false), 4000);
  };

  const triggerUniverseSummaryVoice = () => {
    const worldCount = universeState.worlds.length;
    const avgPlan = universeState.autoPlan || "";
    const spokenText = `Universe simulation core has currently mapped ${worldCount} active digital simulation worlds. Global optimization heuristic reports: ${avgPlan}`;
    triggerVoiceReport(spokenText);
  };

  const activeSelectedWorld = universeState.worlds.find(w => w.id === selectedWorldId);

  const filteredWorlds = universeState.worlds.filter(w => 
    w.name.toLowerCase().includes(searchWorldQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-h-full overflow-y-auto custom-scrollbar select-none text-slate-100 font-sans">
      
      {/* HEADER HERO BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[9px] uppercase font-black tracking-widest animate-pulse">
              MASTER PLAN 24 ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[9px] uppercase font-black tracking-widest">
              AI UNIVERSE CONTROLLER
            </span>
            {wsConnected ? (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] uppercase font-black tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                WS SYNCHRONIZED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[9px] uppercase font-black tracking-widest">
                WS DISCONNECTED (FALLBACK HTTP ON)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5 uppercase font-display">
            <Compass className="w-7 h-7 text-indigo-400 animate-[spin_60s_linear_infinite]" />
            <span>AI Universe Simulation OS</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Multi-World Autonomous Ecosystem Simulator: Synchronizing, testing, and training sovereign agent networks across multiple virtual macro planes.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleUniverse}
            disabled={isToggling}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-2 ${
              universeState.isActive 
                ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/15 text-rose-400' 
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/15 text-indigo-400'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${universeState.isActive ? 'animate-pulse text-rose-400' : ''}`} />
            <span>{universeState.isActive ? 'Suspend Universe' : 'Arouse Universe'}</span>
          </button>

          <button
            onClick={handleManualUniverseTick}
            disabled={isLoading || !universeState.isActive}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/10 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Advancing Multi-Epoch...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Universe Epoch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* METRICS DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* UNIVERSE TICK COUNT */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Universe Epoch Timeline</p>
              <h3 className="text-2xl font-black text-indigo-400 mt-2">Tick #{universeState.tickCount}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="mt-3.5 text-[9px] font-mono text-slate-500">Autonomous tick intervals: 30s</p>
        </div>

        {/* ACTIVE WORLD NODES */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Active Isolated Worlds</p>
              <h3 className="text-2xl font-black text-amber-400 mt-2">{universeState.worlds.length} Planets</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10">
              <Globe className="w-4.5 h-4.5 animate-[spin_20s_linear_infinite]" />
            </div>
          </div>
          <p className="mt-3.5 text-[9px] font-mono text-slate-500">Each simulating autonomous behaviors</p>
        </div>

        {/* CUMULATIVE SIMULATED POPULATION */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Aggregate Population</p>
              <h3 className="text-2xl font-black text-purple-400 mt-2">
                {universeState.worlds.reduce((sum, w) => sum + (w.population?.users?.length || 0), 0)} Agents
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="mt-3.5 text-[9px] font-mono text-slate-500">Autonomous buying, selling and research cycles</p>
        </div>

        {/* SYNC TICK RATE */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Vocal Broadcast Sync</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-2">Voice Engaged</h3>
            </div>
            <button
              onClick={triggerUniverseSummaryVoice}
              className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <Volume2 className="w-4.5 h-4.5" />
            </button>
          </div>
          <p className="mt-3.5 text-[9px] font-mono text-slate-500">Indian English regional synthesis model</p>
        </div>

      </div>

      {/* THREE-COLUMN BENTO SYSTEM LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: WORLD LIST & CREATE CONTROL (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/10 border border-slate-900 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Active Worlds List</h3>
                <p className="text-[9px] text-slate-500 font-mono">Select target to trigger experiments</p>
              </div>
            </div>

            <span className="text-[9px] font-mono bg-slate-950 border border-slate-900 rounded px-2 py-0.5 text-slate-400">
              {filteredWorlds.length} WORLD NODES
            </span>
          </div>

          {/* Quick World search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchWorldQuery}
              onChange={(e) => setSearchWorldQuery(e.target.value)}
              placeholder="Search planet node registry..."
              className="pl-8.5 pr-4 py-2 bg-slate-950/80 border border-slate-900 rounded-xl text-[11px] placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 w-full text-slate-100 font-mono"
            />
          </div>

          {/* LIST CARD GRIDS */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {filteredWorlds.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-slate-900 text-slate-600 text-xs font-mono rounded-xl">
                📭 No active simulated worlds matching query.
              </div>
            ) : (
              filteredWorlds.map((world) => {
                const totalCapital = world.population?.users?.reduce((sum, u) => sum + u.money, 0) || 0;
                const avgCapital = world.population?.users?.length > 0 ? Math.floor(totalCapital / world.population.users.length) : 0;
                return (
                  <div
                    key={world.id}
                    onClick={() => setSelectedWorldId(world.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                      selectedWorldId === world.id 
                        ? 'bg-indigo-950/20 border-indigo-500/40 shadow-lg shadow-indigo-500/5' 
                        : 'bg-slate-950/30 border-slate-900/80 hover:border-indigo-500/15'
                    }`}
                  >
                    {/* Glowing highlight indicator for selected world */}
                    {selectedWorldId === world.id && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-200">{world.name}</h4>
                          <span className="text-[8.5px] font-mono text-slate-500 uppercase">NODE: {world.id.slice(0, 15)}...</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded font-mono text-[8.5px] font-bold ${
                        world.trend === 'BULL' ? 'bg-emerald-500/10 border border-emerald-500/15 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/15 text-rose-400'
                      }`}>
                        {world.trend}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-900/60 text-[9.5px] font-mono text-slate-400">
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase">POPULATION</span>
                        <span className="font-extrabold text-slate-300">{world.population?.users?.length || 0} Citizens</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase">DEMAND INDEX</span>
                        <span className="font-extrabold text-purple-400">{world.demand} pts</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase">AVG CAPITAL</span>
                        <span className="font-extrabold text-emerald-400">${avgCapital}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* CREATE NEW PLANET FORM */}
          <div className="border-t border-slate-900/60 pt-4">
            <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Spawn New Simulation World</span>
            </h4>
            <form onSubmit={handleCreateWorld} className="flex gap-2">
              <input
                type="text"
                value={newWorldName}
                onChange={(e) => setNewWorldName(e.target.value)}
                placeholder="Name (e.g. Switzerland Core-10)..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-900 rounded-xl text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 text-slate-100"
              />
              <button
                type="submit"
                disabled={isCreatingWorld || !newWorldName.trim()}
                className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-slate-950 text-xs font-black uppercase rounded-xl disabled:opacity-40 transition-all cursor-pointer"
              >
                {isCreatingWorld ? 'Spawning...' : 'Spawn'}
              </button>
            </form>
          </div>

        </div>

        {/* COLUMN 2: ACTIVE WORLD MICROSCOPE (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* EXPERIMENT CONTROL CENTER & WORLD DATA */}
          {activeSelectedWorld ? (
            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-5 backdrop-blur-xl">
              
              {/* Target World Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">{activeSelectedWorld.name} Microscope</h3>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-400 font-mono uppercase">
                      Age: Tick {activeSelectedWorld.epochTime}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">Apply custom sandbox variables on this world</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[8.5px] font-mono text-slate-500 uppercase block">Active Phase</span>
                    <span className="text-xs font-bold text-slate-300">Phase 3 (Macro Evolution)</span>
                  </div>
                </div>
              </div>

              {/* EXPERIMENT LAUNCHER PANEL */}
              <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Trigger Controlled Sandbox Experiment:</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  
                  {/* Select Dropdown */}
                  <div className="md:col-span-8">
                    <select
                      value={selectedExperiment}
                      onChange={(e) => setSelectedExperiment(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500/40 font-medium cursor-pointer"
                    >
                      <option value="stimulus">Liquid Cash Stimulus (Distribute $150 to all)</option>
                      <option value="ai_hype">AI Tech-Grooves Boom (Aggressive Buying Interest)</option>
                      <option value="corporate_tax">Corporate Tariff Protocol (Impose 15% System Tax)</option>
                      <option value="gig_subsidy">AGI Freelance Gig Subsidy (Subsidize poor agents)</option>
                    </select>
                  </div>

                  {/* Trigger Button */}
                  <div className="md:col-span-4">
                    <button
                      onClick={handleLaunchExperiment}
                      disabled={isApplyingExperiment}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isApplyingExperiment ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Inject Variables</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-900/60 flex items-start gap-2.5 text-[10.5px] font-mono text-slate-400 leading-normal">
                  <Info className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    {selectedExperiment === 'stimulus' && "This distributes flat system cash to help citizens bypass liquidity traps. Forces consumer buying indices to spike."}
                    {selectedExperiment === 'ai_hype' && "Shifts global user interest curves completely to 'AI'. Causes huge market buying spikes but inflates tool licensing costs."}
                    {selectedExperiment === 'corporate_tax' && "Draws tax revenues, reducing individual spending balances. Relocates assets into corporate supply reserves, shifting trend to Bear market."}
                    {selectedExperiment === 'gig_subsidy' && "Incentivizes low-income users to complete custom model adjustments, protecting their status indices."}
                  </div>
                </div>
              </div>

              {/* CITIZEN ROSTER VIEW OF THIS WORLD */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Isolated World Population ({activeSelectedWorld.population?.users?.length || 0} agents)</h4>
                  <span className="text-[9px] font-mono text-slate-500">Wealth sorted</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  {activeSelectedWorld.population?.users?.map((user) => (
                    <div key={user.id} className="bg-slate-950/50 border border-slate-900 rounded-xl p-3 space-y-2 text-[10.5px] font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-bold">Sim_Citizen_{user.id}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${
                          user.status === 'BUYING' ? 'bg-emerald-500/10 text-emerald-400' :
                          user.status === 'BROWSING' ? 'bg-amber-500/10 text-amber-400' :
                          user.status === 'SATISFIED' ? 'bg-blue-500/10 text-blue-400' :
                          'text-slate-500'
                        }`}>
                          {user.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-slate-400 text-[9.5px]">
                        <span>Interest: <strong className="text-slate-200">{user.interest}</strong></span>
                        <strong className="text-emerald-400">${user.money}</strong>
                      </div>

                      <p className="text-[9px] text-slate-500 italic leading-snug pt-1 border-t border-slate-900/40">
                        "{user.lastAction}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TARGET WORLD RECENT EVENTS */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Planet Event Timeline</h4>
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-900 font-mono text-[9.5px] text-slate-300 space-y-1.5 max-h-[100px] overflow-y-auto custom-scrollbar">
                  {activeSelectedWorld.events?.map((evt, idx) => (
                    <p key={idx} className={evt.includes('🧪') ? 'text-amber-400' : evt.includes('📡') ? 'text-blue-400' : 'text-slate-400'}>
                      {evt}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-12 text-center text-slate-500 text-xs font-mono">
              🚀 Select a simulation world node from the active registry list on the left to review microscope telemetry.
            </div>
          )}

        </div>

      </div>

      {/* BOTTOM SECTION: LEARNING ENGINE SUMMARY & TERMINAL CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEARNING CONSOLE (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-indigo-400" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Self-Evolution Core Intelligence</h3>
                <p className="text-[9px] text-slate-500 font-mono">AI learning telemetry gathered from multi-world states</p>
              </div>
            </div>

            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Autonomous optimization roadmap */}
            <div className="bg-indigo-950/10 border border-indigo-950 rounded-xl p-4">
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-black block mb-1">
                SYSTEM GENERATED OPTIMIZATION ROADMAP (LEARNING_AI)
              </span>
              <p className="text-slate-300 leading-relaxed font-semibold italic">
                "{universeState.autoPlan || "Gathering multi-world pattern samples to generate optimized state protocols..."}"
              </p>
            </div>

            {/* Micro learning observations list */}
            <div className="space-y-2">
              <h4 className="text-[9.5px] uppercase tracking-wider text-slate-500 font-black">Recorded Observations Engine</h4>
              <div className="bg-slate-950/80 rounded-xl border border-slate-900 p-3 max-h-[150px] overflow-y-auto custom-scrollbar space-y-2 text-[10.5px]">
                {universeState.learningObservations?.length === 0 ? (
                  <p className="text-slate-600 text-center py-4 italic">Waiting for initial learning observations to sync...</p>
                ) : (
                  universeState.learningObservations?.map((obs) => (
                    <div key={obs.id} className="flex justify-between items-start gap-4 border-b border-slate-900/50 pb-1.5 last:border-0">
                      <div>
                        <span className="text-indigo-400 font-bold block">{obs.worldName}</span>
                        <p className="text-slate-300 italic">"{obs.insight}"</p>
                      </div>
                      <div className="text-right text-[9.5px] text-slate-500 uppercase">
                        <span>Avg: ${obs.averageCapital}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* UNIVERSE CHRONO LOG TERMINAL (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-500 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Multi-World Execution Streams</h3>
            </div>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
              UNIVERSE_LOGS
            </span>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-[9.5px] text-slate-300 space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar shadow-inner leading-normal">
            {universeState.logs?.length === 0 ? (
              <p className="text-slate-600 text-center py-6 italic">Preparing logs...</p>
            ) : (
              universeState.logs?.map((log, idx) => (
                <p key={idx} className={
                  log.includes('🧪') || log.includes('Experiment') ? 'text-amber-400' :
                  log.includes('Created') || log.includes('Spawn') ? 'text-indigo-400' :
                  'text-slate-500'
                }>
                  {log}
                </p>
              ))
            )}
          </div>

          <div className="flex items-start gap-2 text-[9px] text-slate-500 font-mono leading-normal pt-1 border-t border-slate-900/50">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Autonomous sandbox loops execute globally. Apply custom variables to individual worlds to observe market reactions instantly.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
