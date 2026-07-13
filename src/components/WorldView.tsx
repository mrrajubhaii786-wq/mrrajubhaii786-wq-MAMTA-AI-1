import React, { useState, useEffect } from 'react';
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
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RealVoice } from '../voice/RealVoice';

const speech = new RealVoice();

interface User {
  id: number;
  interest: 'AI' | 'Tools' | 'Finance';
  money: number;
  status: 'IDLE' | 'BUYING' | 'BROWSING' | 'SATISFIED';
  lastAction: string;
}

interface WorldState {
  users: User[];
  trend: 'BULL' | 'BEAR';
  time: number;
  events: string[];
  demand: number;
  supply: number;
  isActive: boolean;
  logs: string[];
  lastUpdate: number;
}

export default function WorldView() {
  const [worldState, setWorldState] = useState<WorldState>({
    users: [],
    trend: 'BULL',
    time: 0,
    events: [],
    demand: 100,
    supply: 100,
    isActive: true,
    logs: ["⏳ Initializing world simulation matrices..."],
    lastUpdate: Date.now()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [filterInterest, setFilterInterest] = useState<'ALL' | 'AI' | 'Tools' | 'Finance'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'BUYING' | 'BROWSING' | 'IDLE' | 'SATISFIED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [speechSummaryText, setSpeechSummaryText] = useState('');

  const fetchWorldState = async () => {
    try {
      const res = await fetch('/api/world/state');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data && !data.error) {
        setWorldState(data);

        // Update synthesized dynamic reporting text
        const bullBear = data.trend === 'BULL' ? "Bullish trend, pushing buyer indexes up" : "Bearish consolidation, forcing agents to save capital";
        setSpeechSummaryText(`World simulation tick ${data.time} processed. Standard active population is 50 synthetic human agents. Current market mode is ${bullBear} with a aggregate consumer demand index of ${data.demand}.`);
      }
    } catch (err: any) {
      console.warn('Gracefully handled world simulation state sync issue:', err.message || err);
    }
  };

  const handleToggleWorldLoop = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/world/toggle', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data.success) {
        setWorldState(prev => ({ ...prev, isActive: data.isActive }));
      }
    } catch (err: any) {
      console.warn('Gracefully handled world loop toggle issue:', err.message || err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTriggerWorldTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/world/trigger', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data.success) {
        setWorldState(data.state);
        triggerLocalSpeak("Simulation cycle updated.");
      }
    } catch (err: any) {
      console.warn('Gracefully handled manual world tick trigger issue:', err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerLocalSpeak = (text: string) => {
    setIsSpeaking(true);
    speech.speak(text);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  useEffect(() => {
    fetchWorldState();
    const interval = setInterval(fetchWorldState, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter citizens based on user parameters
  const filteredUsers = (worldState.users || []).filter(u => {
    const matchesInterest = filterInterest === 'ALL' || u.interest === filterInterest;
    const matchesStatus = filterStatus === 'ALL' || u.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      `User ${u.id}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastAction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesInterest && matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-h-full overflow-y-auto custom-scrollbar select-none text-slate-100 font-sans">
      
      {/* Dynamic Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[9px] uppercase font-black tracking-widest animate-pulse">
              MASTER PLAN 23 ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] uppercase font-black tracking-widest">
              WORLD SIMULATOR
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5 uppercase font-display">
            <Compass className="w-7 h-7 text-blue-400 animate-[spin_40s_linear_infinite]" />
            <span>AI World Simulation OS</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Simulating digital populations, organic agent purchase behavior grids, market dynamics, and micro-macro financial flow parameters.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleWorldLoop}
            disabled={isToggling}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-2 ${
              worldState.isActive 
                ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/15 text-rose-400' 
                : 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/15 text-blue-400'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${worldState.isActive ? 'animate-pulse' : ''}`} />
            <span>{worldState.isActive ? 'Pause Simulation' : 'Activate Simulation'}</span>
          </button>

          <button
            onClick={handleTriggerWorldTick}
            disabled={isLoading || !worldState.isActive}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/10 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evolving Epoch...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate World Tick</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* THREE STRATEGIC INDICES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* TICK / ELAPSED TIME */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">World State Epoch</p>
              <h3 className="text-2xl font-black text-blue-400 mt-2">Tick {worldState.time}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/10">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="mt-3.5 text-[9.5px] font-mono text-slate-500">Autonomous tick intervals: 40s</p>
        </div>

        {/* MARKET TREND */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Consolidated Market Trend</p>
              <h3 className={`text-2xl font-black mt-2 flex items-center gap-1.5 ${worldState.trend === 'BULL' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {worldState.trend === 'BULL' ? (
                  <>
                    <TrendingUp className="w-6 h-6" />
                    <span>BULL MODE</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-6 h-6" />
                    <span>BEAR CONSOLIDATION</span>
                  </>
                )}
              </h3>
            </div>
          </div>
          <p className="mt-3.5 text-[9.5px] font-mono text-slate-500">Determined by global supply-demand curves</p>
        </div>

        {/* DEMAND INDEX */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Consumer Demand Index</p>
              <h3 className="text-2xl font-black text-purple-400 mt-2">{worldState.demand} pts</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
              <Cpu className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3.5 h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, (worldState.demand / 300) * 100)}%` }} />
          </div>
        </div>

        {/* SUPPLY INDEX */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Corporate Supply Index</p>
              <h3 className="text-2xl font-black text-pink-400 mt-2">{worldState.supply} pts</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/10">
              <Layers className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3.5 h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div className="h-full bg-pink-500" style={{ width: `${Math.min(100, (worldState.supply / 300) * 100)}%` }} />
          </div>
        </div>

      </div>

      {/* TWO COLUMN SUBSECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPASS: Synthetic Population Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/10 border border-slate-900 rounded-2xl p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Synthetic Citizen Agents ({filteredUsers.length} / 50)</h3>
                <p className="text-[10px] text-slate-500 font-mono">Autonomous human simulation profile models</p>
              </div>
            </div>

            {/* Quick search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search citizen grids..."
                className="pl-8.5 pr-4 py-2 bg-slate-950/80 border border-slate-900 rounded-xl text-[11px] placeholder-slate-600 focus:outline-none focus:border-blue-500/50 w-full sm:w-48 text-slate-100"
              />
            </div>
          </div>

          {/* Filtering Rails */}
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            {/* Interest Filter */}
            <div className="flex items-center bg-slate-950 rounded-xl border border-slate-900/60 p-1">
              <span className="px-2 text-slate-500 uppercase tracking-wider font-extrabold text-[9px]">Interest:</span>
              {(['ALL', 'AI', 'Tools', 'Finance'] as const).map((interest) => (
                <button
                  key={interest}
                  onClick={() => setFilterInterest(interest)}
                  className={`px-2.5 py-1 rounded-lg uppercase cursor-pointer transition-all ${
                    filterInterest === interest 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-slate-950 rounded-xl border border-slate-900/60 p-1">
              <span className="px-2 text-slate-500 uppercase tracking-wider font-extrabold text-[9px]">Status:</span>
              {(['ALL', 'BUYING', 'BROWSING', 'IDLE', 'SATISFIED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded-lg uppercase cursor-pointer transition-all ${
                    filterStatus === status 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Citizen Agent List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
            {filteredUsers.length === 0 ? (
              <div className="col-span-2 text-center p-12 border border-dashed border-slate-900 text-slate-600 text-xs font-mono rounded-xl">
                📭 No active simulated agents matching the search criteria.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 space-y-3 relative overflow-hidden group hover:border-blue-500/15 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/[0.02] to-transparent pointer-events-none" />
                  
                  {/* Citizen Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center font-mono text-[9px] text-blue-400 font-extrabold border border-slate-850">
                        {user.id}
                      </div>
                      <span className="text-xs font-bold text-slate-300">Sim_Citizen_{user.id}</span>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[8.5px] font-bold ${
                      user.status === 'BUYING' ? 'bg-emerald-500/10 border border-emerald-500/15 text-emerald-400' :
                      user.status === 'BROWSING' ? 'bg-amber-500/10 border border-amber-500/15 text-amber-400' :
                      user.status === 'SATISFIED' ? 'bg-blue-500/10 border border-blue-500/15 text-blue-400' :
                      'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}>
                      {user.status}
                    </span>
                  </div>

                  {/* Citizen Bio Info */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900/50">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Briefcase className="w-3 h-3 text-blue-500" />
                      <span>Interest: <strong className="text-slate-300">{user.interest}</strong></span>
                    </span>
                    <span className="text-emerald-400 font-bold">${user.money}</span>
                  </div>

                  {/* Recent Simulated Log */}
                  <div className="bg-slate-950 p-2 rounded border border-slate-900 text-[10px] font-mono text-slate-500 italic leading-relaxed">
                    "{user.lastAction}"
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

        {/* RIGHT COMPASS: Live World Event Ticker & Vocal Synthesizer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* VOCAL BRIEF SYNTHESIZER */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400">
                <Volume2 className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">Local Voice Cloner Synthesizer</h3>
                <p className="text-[8px] text-slate-500 font-mono tracking-wider font-extrabold uppercase">LEVEL 23 VOCAL TRANSMISSION</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">Dynamic State Synthesis Target:</p>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-900/80 font-mono text-[10.5px] text-slate-400 leading-relaxed max-h-[80px] overflow-y-auto custom-scrollbar">
                  {speechSummaryText || "Preparing world brief parameters..."}
                </div>
              </div>

              {/* Synthesizer Trigger */}
              <button
                onClick={() => triggerLocalSpeak(speechSummaryText)}
                disabled={isSpeaking || !speechSummaryText}
                className="w-full px-3 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/15 hover:from-blue-500/30 hover:to-indigo-500/20 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>{isSpeaking ? "Speaking..." : "Synthesize World Brief"}</span>
              </button>

              {/* Audio Wave Visualizer representation when speaking */}
              {isSpeaking && (
                <div className="flex items-end justify-center gap-1.5 h-6 pt-1 animate-pulse">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
                    <div 
                      key={bar} 
                      className="w-1 bg-blue-500 rounded" 
                      style={{ 
                        height: `${Math.floor(Math.random() * 20) + 5}px`,
                        animationDelay: `${bar * 50}ms` 
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* EVENTS CONSOLE */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Macro World Events Ticker</h3>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                LIVE
              </span>
            </div>

            {(!worldState.events || worldState.events.length === 0) ? (
              <div className="border border-dashed border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs font-mono">
                ⏳ Waiting for digital world simulation events...
              </div>
            ) : (
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-[10px] text-slate-300 space-y-3 max-h-[180px] overflow-y-auto custom-scrollbar shadow-inner">
                {worldState.events.map((evt, idx) => (
                  <p key={idx} className={
                    evt.includes('🔥') || evt.includes('⚠️') ? 'text-rose-400' :
                    evt.includes('🚀') || evt.includes('📣') ? 'text-amber-400 font-semibold' :
                    evt.includes('🏦') ? 'text-emerald-400' :
                    'text-slate-300'
                  }>
                    {evt}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* SIMULATION CHRONOLOGICAL TRADING LOGS */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Behavioral Purchase Stream</h3>
            </div>

            {(!worldState.logs || worldState.logs.length === 0) ? (
              <div className="border border-dashed border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs font-mono">
                ⏳ Monitoring citizen agent decisions...
              </div>
            ) : (
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-[9.5px] text-slate-300 space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar shadow-inner">
                {worldState.logs.map((log, idx) => (
                  <p key={idx} className={
                    log.includes('bought') || log.includes('premium') ? 'text-emerald-400' :
                    log.includes('worked') ? 'text-blue-400' :
                    'text-slate-500'
                  }>
                    {log}
                  </p>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2 text-[9.5px] text-slate-500 font-mono leading-normal pt-1 border-t border-slate-900/50">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Simulated actions calculate macro parameters which influence company monetization metrics dynamically.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
