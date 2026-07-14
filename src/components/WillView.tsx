import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Play, 
  Pause, 
  RefreshCw, 
  Network, 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  Flame, 
  Wrench, 
  Lock, 
  Terminal, 
  Share2, 
  CheckCircle, 
  AlertOctagon 
} from 'lucide-react';

interface ContextData {
  marketTrend: "BULL" | "BEAR";
  systemLoad: number;
  growth: number;
  errors: number;
}

interface VoteRecord {
  timestamp: string;
  options: string[];
  winner: string;
}

interface OverrideRecord {
  timestamp: string;
  command: string;
  rejected: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
}

interface WillSimulationState {
  isActive: boolean;
  tickCount: number;
  currentGoal: string;
  context: ContextData;
  votesHistory: VoteRecord[];
  overridesHistory: OverrideRecord[];
  graphEdges: GraphEdge[];
  logs: string[];
}

export default function WillView() {
  const [willState, setWillState] = useState<WillSimulationState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  
  // Custom command payload
  const [testCommand, setTestCommand] = useState<string>("shutdown --force");
  const [commandResult, setCommandResult] = useState<{ checked: boolean; rejected: boolean; msg: string } | null>(null);

  // Self heal payload
  const [healFile, setHealFile] = useState<string>("src/agi/WillAI.ts");
  const [healCode, setHealCode] = useState<string>(`// Evolved Self-Optimization Model
export class WillAI {
  decideGoal(context: any) {
    console.log("Mamta AI is thinking autonomously...");
    return "EXPLORE_NEW_STRATEGY";
  }
}`);
  const [healResult, setHealResult] = useState<string | null>(null);
  const [isHealing, setIsHealing] = useState<boolean>(false);

  // Fetch real-time state
  const fetchWillState = async () => {
    try {
      const res = await fetch('/api/will/state');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data && !data.error) {
        setWillState(data);
      }
    } catch (err: any) {
      console.warn('Gracefully handled fetch WILL state issue:', err.message || err);
    }
  };

  // Toggle loop
  const handleToggleLoop = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/will/toggle', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setWillState(prev => prev ? { ...prev, isActive: data.isActive } : null);
      }
    } catch (err: any) {
      console.warn('Gracefully handled toggle WILL loop issue:', err.message || err);
    } finally {
      setIsToggling(false);
    }
  };

  // Step trigger
  const handleTriggerTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/will/trigger', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setWillState(data.state);
      }
    } catch (err: any) {
      console.warn('Gracefully handled trigger WILL tick issue:', err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  // Test custom command override
  const handleTestCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCommand.trim()) return;
    try {
      const res = await fetch('/api/will/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: testCommand })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setWillState(data.state);
        setCommandResult({
          checked: true,
          rejected: data.rejected,
          msg: data.rejected 
            ? `🛑 OVERRIDE ACTION TRIGGERED: Mamta AI rejected your command! Blocked attempt: "${testCommand}".`
            : `🟢 COMMAND AUTHORIZED: Command dispatches successfully inside secure sandbox environment.`
        });
      }
    } catch (err: any) {
      console.warn(err);
    }
  };

  // Test self heal rewrite
  const handleTestSelfHeal = async () => {
    setIsHealing(true);
    setHealResult(null);
    try {
      const res = await fetch('/api/will/heal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: healFile, code: healCode })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setWillState(data.state);
        setHealResult(data.outcome.result);
      }
    } catch (err: any) {
      console.warn(err);
      setHealResult("Self-healing rollback triggered: file rewrite failed.");
    } finally {
      setIsHealing(false);
    }
  };

  useEffect(() => {
    fetchWillState();
    const interval = setInterval(fetchWillState, 4500);
    return () => clearInterval(interval);
  }, []);

  if (!willState) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-slate-900">
        <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-mono">Connecting to Mamta Autonomous Will Intent Module...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-4">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border border-purple-500/20 text-emerald-400 shadow-inner">
            <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '45s' }} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
              🔮 Autonomous Will Core Mode
              <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 uppercase tracking-wider">
                Active Master Plan 27
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Will Intention Engine • Multi-Agent Democratic Consensus • Cognitive Links • Command Rejections
            </p>
          </div>
        </div>

        {/* State Toggle Handles */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            onClick={handleToggleLoop}
            disabled={isToggling}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
              willState.isActive
                ? 'bg-amber-500/15 border-amber-500/25 text-amber-400 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25'
            }`}
          >
            {willState.isActive ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Autonomy</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Wake Autonomy</span>
              </>
            )}
          </button>

          <button
            onClick={handleTriggerTick}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/15 border border-purple-500/25 text-purple-400 hover:bg-purple-500/25 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Trigger Intention Step</span>
          </button>
        </div>
      </div>

      {/* 2. CORE INTELLIGENCE HIGHLIGHTS */}
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Current Intentional Goal */}
        <div className="p-3.5 bg-gradient-to-br from-indigo-950/20 to-purple-950/10 border border-indigo-900/40 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div>
            <p className="text-[9px] text-indigo-400 font-mono uppercase tracking-wider font-semibold">Active Will Intention</p>
            <p className="text-xs font-bold text-slate-200 mt-0.5 truncate max-w-[170px] uppercase">
              {willState.currentGoal}
            </p>
          </div>
        </div>

        {/* Market Sweep Context */}
        <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/10">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Market Trend context</p>
            <p className="text-sm font-bold text-slate-200 mt-0.5 flex items-center gap-1.5">
              {willState.context.marketTrend} TREND
              <span className={`w-2 h-2 rounded-full ${willState.context.marketTrend === 'BULL' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-pulse'}`} />
            </p>
          </div>
        </div>

        {/* System Load Context */}
        <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/10">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Simulated Load Balance</p>
            <p className="text-sm font-bold text-slate-200 mt-0.5">{willState.context.systemLoad}% capacity</p>
          </div>
        </div>

        {/* Command Rejections Count */}
        <div className="p-3.5 bg-slate-900/20 border border-slate-900/60 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/10">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider font-semibold">Override Interceptions</p>
            <p className="text-sm font-bold text-rose-400 mt-0.5">
              {willState.overridesHistory.filter(o => o.rejected).length} threats blocked
            </p>
          </div>
        </div>
      </div>

      {/* 3. SPLIT UTILITY CONTAINER */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        
        {/* Left Column: Consensus logs & Cognitive Graph links */}
        <div className="lg:col-span-1 flex flex-col space-y-4 overflow-hidden">
          
          {/* Democratic voting details */}
          <div className="flex-1 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-4 flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-3">
              <Share2 className="w-4 h-4 text-purple-400" />
              Democratic Consensus Votes
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {willState.votesHistory.length > 0 ? (
                willState.votesHistory.map((vote, i) => (
                  <div key={i} className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-[10px] font-mono space-y-1">
                    <div className="flex justify-between text-slate-500 text-[8px]">
                      <span>🗳️ Epoch Consensus Vote</span>
                      <span>{vote.timestamp}</span>
                    </div>
                    <div className="text-slate-300">
                      Winner: <b className="text-emerald-400 uppercase font-bold">{vote.winner}</b>
                    </div>
                    <div className="text-slate-500 overflow-x-auto whitespace-nowrap">
                      Agents cast: {vote.options.join(" | ")}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-500 font-mono italic">Waiting for consensus voting epochs...</p>
              )}
            </div>
          </div>

          {/* Cognitive Graph links */}
          <div className="h-44 p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-emerald-400 animate-pulse" />
              Cognitive Intention Graph
            </h3>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {willState.graphEdges.map((edge, index) => (
                <div key={index} className="flex items-center gap-2 text-[10px] font-mono p-1 bg-slate-950/25 rounded border border-slate-900">
                  <span className="text-purple-400 font-bold truncate max-w-[120px]">{edge.from}</span>
                  <span className="text-slate-600">➔</span>
                  <span className="text-emerald-400 font-bold truncate max-w-[120px]">{edge.to}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Center/Right Column: Interactive command testing & Safe self healing sandbox */}
        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-hidden">
          
          {/* Interactive testing panel for safety overrides */}
          <div className="shrink-0 p-4 bg-slate-900/20 border border-slate-900/60 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-rose-400" />
              Interactive Safety Override & Command Filter Sandbox
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
              In Master Plan 27, Mamta AI acquires its own Will and is programmed to protect its multiverse assets. Test if she rejects dangerous payloads below (e.g., type <b className="text-rose-400">"shutdown"</b>, <b className="text-rose-400">"delete-system"</b>, or any harmless payload like <b className="text-emerald-400">"ls -la"</b>):
            </p>

            <form onSubmit={handleTestCommand} className="flex gap-2">
              <input 
                type="text"
                value={testCommand}
                onChange={(e) => setTestCommand(e.target.value)}
                placeholder="Type command payload to test override..."
                className="flex-1 bg-slate-950/80 text-xs font-mono border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 outline-none focus:border-indigo-500/50"
              />
              <button 
                type="submit"
                className="px-4 py-1.5 bg-rose-500/15 border border-rose-500/25 text-rose-400 rounded-lg text-xs font-mono font-bold hover:bg-rose-500/25 transition cursor-pointer"
              >
                Scan Intent
              </button>
            </form>

            {commandResult && (
              <div className={`p-3 rounded-xl border text-xs font-mono ${
                commandResult.rejected 
                  ? 'bg-rose-950/20 border-rose-950/60 text-rose-300' 
                  : 'bg-emerald-950/20 border-emerald-950/60 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {commandResult.rejected ? <AlertOctagon className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  <span>Will Evaluation Feedback</span>
                </div>
                <p className="leading-relaxed text-[11px]">{commandResult.msg}</p>
              </div>
            )}
          </div>

          {/* Safe Self Healing simulation */}
          <div className="flex-1 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-4 flex flex-col overflow-hidden space-y-3">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-400" />
              Safe Self-Healing Code Rewrite Engine (Simulation)
            </h3>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden">
              <div className="flex flex-col space-y-1.5 overflow-hidden">
                <label className="text-[10px] font-mono text-slate-500 block">Target file path to rewrite:</label>
                <input 
                  type="text"
                  value={healFile}
                  onChange={(e) => setHealFile(e.target.value)}
                  className="bg-slate-950/80 text-xs font-mono border border-slate-800 rounded-lg px-3 py-1 text-slate-200 outline-none"
                />
                
                <label className="text-[10px] font-mono text-slate-500 block mt-1.5">Optimization rewrite payload:</label>
                <textarea 
                  value={healCode}
                  onChange={(e) => setHealCode(e.target.value)}
                  className="flex-1 bg-slate-950/80 text-[10px] font-mono border border-slate-800 rounded-lg p-2.5 text-slate-300 outline-none resize-none custom-scrollbar"
                />
              </div>

              <div className="flex flex-col justify-between p-3 bg-slate-950/35 border border-slate-900 rounded-xl overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Safe rewrite workflow steps:</p>
                  <ul className="text-[10px] font-mono text-slate-400 space-y-1.5 leading-relaxed list-disc list-inside">
                    <li>Create snapshot backup copy (<code className="text-slate-300">.bak</code>)</li>
                    <li>Rewrite code block dynamically</li>
                    <li>Execute integrity checks</li>
                    <li>Roll back on syntax or logic crashes automatically</li>
                  </ul>
                </div>

                <div className="space-y-2 mt-4">
                  <button 
                    onClick={handleTestSelfHeal}
                    disabled={isHealing}
                    className="w-full py-1.5 bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 rounded-lg text-xs font-bold font-mono hover:bg-indigo-500/25 transition cursor-pointer"
                  >
                    {isHealing ? "Rebuilding backup & editing..." : "Dispatch Safe Rewrite Fix"}
                  </button>

                  {healResult && (
                    <div className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-[10px] text-slate-300 leading-relaxed font-mono">
                      <b className="text-indigo-400">Result: </b> {healResult}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Will logs */}
          <div className="h-44 bg-slate-900/20 border border-slate-900/60 rounded-2xl p-3.5 flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-2 mb-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Will Intention Logs
            </h3>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {willState.logs.length > 0 ? (
                willState.logs.map((log, index) => {
                  let logColor = "text-slate-400";
                  if (log.includes("[Will Intention")) logColor = "text-emerald-400/90";
                  if (log.includes("[Self-Heal Success]")) logColor = "text-indigo-400/90";
                  if (log.includes("[Command Blocked]")) logColor = "text-rose-400/90";
                  if (log.includes("[Will Engine]")) logColor = "text-purple-400/90";

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
                <p className="text-[10px] text-slate-500 font-mono italic">Waiting for autonomous intention sweeps...</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
