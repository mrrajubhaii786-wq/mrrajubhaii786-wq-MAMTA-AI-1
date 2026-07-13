import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  TrendingUp, 
  Layers, 
  Radio, 
  Cpu, 
  Play, 
  Loader2, 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  Network, 
  DollarSign, 
  Users, 
  Coins, 
  Info,
  ChevronRight,
  ExternalLink,
  Flame,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmpireCompany {
  id: string;
  name: string;
  revenue: number;
  users: number;
  cash: number;
  niche: string;
  products: string[];
  status: 'ACTIVE' | 'SCALING' | 'OPTIMIZING';
}

interface EmpireState {
  companies: EmpireCompany[];
  marketData: {
    trending: string[];
    demand: string;
    competition: string;
    timestamp: number;
  };
  lastDecision: string;
  logs: string[];
  networkLogs: string[];
  isActive: boolean;
  totalRevenue: number;
  totalUsers: number;
  totalCash: number;
}

export default function EmpireView() {
  const [empireState, setEmpireState] = useState<EmpireState>({
    companies: [],
    marketData: {
      trending: ["AI tools", "Automation SaaS"],
      demand: "HIGH",
      competition: "MEDIUM",
      timestamp: Date.now()
    },
    lastDecision: "CREATE_NEW_COMPANY",
    logs: [
      "⏳ Initialising connections with the Global Empire Network...",
    ],
    networkLogs: [],
    isActive: true,
    totalRevenue: 0,
    totalUsers: 0,
    totalCash: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'network' | 'market'>('overview');

  const fetchEmpireState = async () => {
    try {
      const res = await fetch('/api/empire/state');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data && !data.error) {
        setEmpireState(data);
      }
    } catch (err: any) {
      console.warn('Gracefully handled AI Empire state sync issue:', err.message || err);
    }
  };

  const handleToggleEmpireLoop = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/empire/toggle', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data.success) {
        setEmpireState(prev => ({ ...prev, isActive: data.isActive }));
      }
    } catch (err: any) {
      console.warn('Gracefully handled AI Empire loop toggle issue:', err.message || err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTriggerEmpireTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/empire/trigger', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data.success) {
        setEmpireState(data.state);
      }
    } catch (err: any) {
      console.warn('Gracefully handled manual AI Empire tick trigger issue:', err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpireState();
    // Poll the autonomous empire server state every 5 seconds for absolute real-time coherence
    const interval = setInterval(fetchEmpireState, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-h-full overflow-y-auto custom-scrollbar select-none text-slate-100 font-sans">
      
      {/* Header Banner Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] uppercase font-black tracking-widest animate-pulse">
              LEVEL 21 EMPIRE CONTROL
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5 uppercase font-display">
            <Globe className="w-7 h-7 text-emerald-400 animate-[spin_20s_linear_infinite]" />
            <span>AI Empire Controller</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Supervising a decentralized autonomous network of software startups building live products on SaaS sandboxes.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleEmpireLoop}
            disabled={isToggling}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-2 ${
              empireState.isActive 
                ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/15 text-rose-400' 
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/15 text-emerald-400'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${empireState.isActive ? 'animate-pulse' : ''}`} />
            <span>{empireState.isActive ? 'Pause Empire Loop' : 'Activate Empire Loop'}</span>
          </button>

          <button
            onClick={handleTriggerEmpireTick}
            disabled={isLoading || !empireState.isActive}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/10 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running Node Decisions...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Force Decision Tick</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* GLOBAL MACRO METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Consolidated MRR</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-2">${empireState.totalRevenue}/mo</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-emerald-500/80 font-mono flex items-center gap-1">
            <span>● Dynamic Scaling Active</span>
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Decentralized Users</p>
              <h3 className="text-2xl font-black text-indigo-400 mt-2">{empireState.totalUsers}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-indigo-500/80 font-mono flex items-center gap-1">
            <span>● Cross-Cohort Onboarding</span>
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Empire Treasury Cash</p>
              <h3 className="text-2xl font-black text-amber-400 mt-2">${empireState.totalCash}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-amber-500/80 font-mono flex items-center gap-1">
            <span>● Liquidity Reserves Intact</span>
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Network Enterprise Nodes</p>
              <h3 className="text-2xl font-black text-purple-400 mt-2">{empireState.companies?.length || 0} Companies</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-purple-500/80 font-mono flex items-center gap-1">
            <span>● Autonomous Expansion Nodes</span>
          </div>
        </div>

      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Portfolio & Network (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Sub-tab Navigation */}
          <div className="flex border-b border-slate-900 pb-2.5 gap-1.5">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all ${
                activeSubTab === 'overview'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              💼 Active Startups ({empireState.companies?.length || 0})
            </button>
            <button
              onClick={() => setActiveSubTab('network')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-1.5 ${
                activeSubTab === 'network'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Inter-Company Network Relay</span>
            </button>
            <button
              onClick={() => setActiveSubTab('market')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all ${
                activeSubTab === 'market'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              📊 Market Intelligence
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {activeSubTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {(!empireState.companies || empireState.companies.length === 0) ? (
                  <div className="border border-dashed border-slate-900 rounded-2xl p-12 text-center text-slate-500 text-xs font-mono">
                    📭 No active startup nodes connected. Fire the Loop to spawn companies.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {empireState.companies.map((c, idx) => (
                      <div key={idx} className="bg-slate-900/25 border border-slate-900 rounded-2xl p-5 space-y-4 hover:border-emerald-500/25 transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
                        
                        {/* Company Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                              {c.name}
                            </h4>
                            <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 tracking-wider">{c.niche}</p>
                          </div>
                          
                          <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                            c.status === 'SCALING' 
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                              : c.status === 'OPTIMIZING'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {c.status}
                          </span>
                        </div>

                        {/* Financial Statistics Grid */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-900/60 text-center font-mono text-[10px]">
                          <div>
                            <p className="text-slate-500 text-[8px] uppercase">MRR</p>
                            <p className="font-extrabold text-emerald-400 mt-0.5">${c.revenue}/mo</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-[8px] uppercase">Users</p>
                            <p className="font-extrabold text-indigo-400 mt-0.5">{c.users}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-[8px] uppercase">Reserves</p>
                            <p className="font-extrabold text-amber-400 mt-0.5">${c.cash}</p>
                          </div>
                        </div>

                        {/* Built Products */}
                        <div className="space-y-1.5">
                          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Active SaaS Products:</p>
                          <div className="flex flex-wrap gap-1">
                            {c.products?.map((p, pIdx) => (
                              <span key={pIdx} className="text-[9px] font-mono bg-slate-950 text-slate-300 border border-slate-900 px-2 py-0.5 rounded flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                                <span>{p}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeSubTab === 'network' && (
              <motion.div
                key="network"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <Network className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Inter-Company Data Relays</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Cross-node intelligence data routing loggers</p>
                  </div>
                </div>

                {(!empireState.networkLogs || empireState.networkLogs.length === 0) ? (
                  <div className="border border-dashed border-slate-900 rounded-xl p-8 text-center text-slate-500 text-xs font-mono">
                    📭 No active inter-company transactions logged yet. Let the loop run to share weights, insights, or user pools.
                  </div>
                ) : (
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-[9.5px] space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {empireState.networkLogs.map((log, idx) => (
                      <p key={idx} className="text-indigo-400 leading-relaxed">
                        {log}
                      </p>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 bg-indigo-500/5 border border-indigo-500/10 p-3.5 rounded-xl">
                  <Info className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[10.5px] text-slate-400 leading-normal font-medium">
                    The Inter-Company Network transfers user demographic matrices, automated marketing logs, and model checkpoint weights to maintain synergistic growth across all subsidiaries.
                  </p>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'market' && (
              <motion.div
                key="market"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Demand Index Card */}
                <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Demand Intelligence Index</h4>
                  </div>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between p-2.5 bg-slate-950/40 border border-slate-900 rounded-lg">
                      <span className="text-slate-500 uppercase">Macro demand:</span>
                      <span className="font-extrabold text-emerald-400 uppercase tracking-widest">{empireState.marketData.demand}</span>
                    </div>

                    <div className="flex justify-between p-2.5 bg-slate-950/40 border border-slate-900 rounded-lg">
                      <span className="text-slate-500 uppercase">Competitor Saturation:</span>
                      <span className="font-extrabold text-amber-400 uppercase tracking-widest">{empireState.marketData.competition}</span>
                    </div>

                    <div className="flex justify-between p-2.5 bg-slate-950/40 border border-slate-900 rounded-lg">
                      <span className="text-slate-500 uppercase">Analysis freshness:</span>
                      <span className="font-extrabold text-slate-300">{new Date(empireState.marketData.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {/* Trending Niches */}
                <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                    <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Market Opportunities</h4>
                  </div>

                  <div className="space-y-2">
                    {empireState.marketData.trending?.map((trend, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-900/80 group">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{trend}</span>
                        <span className="text-[8.5px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded uppercase font-black tracking-widest">
                          TRENDING
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: Strategy & Operational Logs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* EMPIRE STRATEGIST CABINET */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/15 text-purple-400">
                <Cpu className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">Empire Strategist Core</h3>
                <p className="text-[8px] text-slate-500 font-mono tracking-wider font-extrabold">STATUS: ON-SITE COORDINATION ACTIVE</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Active Directive Decided</p>
              
              <div className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold text-xs px-3 py-1 rounded-full">
                {empireState.lastDecision}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {empireState.lastDecision === "CREATE_NEW_COMPANY" && "Analyzing macro markets suggests immense untapped margins. Spawning a new autonomous startup node to hijack high-conversion developer segments."}
                {empireState.lastDecision === "SCALE_GLOBAL_NETWORK" && "High volumes of decentralized traffic identified. Directing high-capacity routing optimizations and synchronized user registries."}
                {empireState.lastDecision === "OPTIMIZE_EXISTING" && "Directing resource allocation pipelines to enhance monetisation parameters, securing +$25 recurring subscription MRR."}
              </p>
            </div>
          </div>

          {/* OPERATIONAL LOGS */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Live Empire Transaction Logs</h3>
              </div>
              <button
                onClick={fetchEmpireState}
                className="text-[8px] text-slate-500 hover:text-slate-300 font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-900 cursor-pointer"
              >
                Force Sync
              </button>
            </div>

            {(!empireState.logs || empireState.logs.length === 0) ? (
              <div className="border border-dashed border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs font-mono">
                ⏳ Waiting for autonomous background enterprise transactions...
              </div>
            ) : (
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-[9.5px] text-slate-300 space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar shadow-inner">
                {empireState.logs.map((log: string, idx: number) => (
                  <p key={idx} className={
                    log.includes('🏢') || log.includes('Created brand new') ? 'text-emerald-400' :
                    log.includes('🧠') || log.includes('Empire Brain') ? 'text-amber-300 font-semibold' :
                    log.includes('📡') || log.includes('Network') ? 'text-indigo-400' :
                    log.includes('⚙️') || log.includes('Optimizing') ? 'text-purple-400' :
                    'text-slate-300'
                  }>
                    {log}
                  </p>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2 text-[9.5px] text-slate-500 font-mono leading-normal pt-1 border-t border-slate-900/50">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                The AI Empire Engine operates an autonomous global background clock ticking every 40 seconds. Manual decision overrides instantly trigger full portfolio evaluation.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
