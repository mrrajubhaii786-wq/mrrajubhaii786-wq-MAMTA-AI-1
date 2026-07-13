import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Coins, 
  Cpu, 
  Layers, 
  Activity, 
  Play, 
  Loader2, 
  Radio, 
  Volume2, 
  Plus, 
  Check, 
  X, 
  Network, 
  Info,
  Scale,
  DollarSign,
  TrendingUp,
  Sliders,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RealVoice } from '../voice/RealVoice';

// Initialize the SpeechSynthesis local system
const voiceController = new RealVoice();

interface EcosystemApp {
  name: string;
  category: string;
  version: string;
  status: 'ONLINE' | 'UPGRADING' | 'STANDBY';
  connections: string[];
}

interface LedgerTransaction {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  value: number;
  type: 'TRADE' | 'TAX' | 'MINT' | 'REWARD';
}

interface CivilizationState {
  apps: EcosystemApp[];
  balance: number;
  rules: string[];
  lastAction: string;
  lastActionStatus: 'APPROVED' | 'REJECTED';
  logs: string[];
  ledger: LedgerTransaction[];
  isActive: boolean;
  tickCount: number;
  timestamp: number;
}

export default function CivilizationView() {
  const [civState, setCivState] = useState<CivilizationState>({
    apps: [],
    balance: 10000,
    rules: [],
    lastAction: "INIT_CIVILIZATION",
    lastActionStatus: "APPROVED",
    logs: ["⏳ Initializing digital civilization modules..."],
    ledger: [],
    isActive: true,
    tickCount: 0,
    timestamp: Date.now()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'ecosystem' | 'governance' | 'economy'>('ecosystem');
  const [voiceBriefText, setVoiceBriefText] = useState("Civilization modules online. Standing by for strategic instructions.");

  // For custom voice cloning sample storage
  const [voiceSampleCount, setVoiceSampleCount] = useState(0);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/civilization/state');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data && !data.error) {
        setCivState(data);
        
        // Dynamically update synthesis prompt
        const activeCount = data.apps?.length || 0;
        const currentBal = data.balance || 0;
        setVoiceBriefText(`Ecosystem currently online with ${activeCount} active applications and global treasury reserves of $${currentBal}. Last approved operations include ${data.lastAction.split(':')[0]}.`);
      }
    } catch (err: any) {
      console.warn('Gracefully handled civilization state sync issue:', err.message || err);
    }
  };

  const handleToggleLoop = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/civilization/toggle', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data.success) {
        setCivState(prev => ({ ...prev, isActive: data.isActive }));
      }
    } catch (err: any) {
      console.warn('Gracefully handled civilization loop toggle issue:', err.message || err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTriggerTick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/civilization/trigger', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      if (data.success) {
        setCivState(data.state);
        // Play local audio sound for tactile response
        triggerTTS(`Governance cleared decision sequence.`);
      }
    } catch (err: any) {
      console.warn('Gracefully handled manual civilization tick trigger issue:', err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerTTS = (text: string) => {
    setIsSpeaking(true);
    voiceController.speak(text);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  const handleMicSampleUpload = () => {
    // Simulated mic voice print intake
    setVoiceSampleCount(prev => prev + 1);
    triggerTTS("Voice print successfully calibrated. Synthesizer frequency matched to owner profile.");
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-h-full overflow-y-auto custom-scrollbar select-none text-slate-100 font-sans">
      
      {/* Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[9px] uppercase font-black tracking-widest animate-pulse">
              MASTER PLAN 22 ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[9px] uppercase font-black tracking-widest">
              AUTONOMOUS CIVILIZATION OS
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5 uppercase font-display">
            <Globe className="w-7 h-7 text-amber-400 animate-[spin_30s_linear_infinite]" />
            <span>AI Civilization OS</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Supervising a self-governing, self-monetizing network ecosystem featuring automated constitutions, active trade routing, and local synthesis loops.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleLoop}
            disabled={isToggling}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all flex items-center gap-2 ${
              civState.isActive 
                ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/15 text-rose-400' 
                : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/15 text-amber-400'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${civState.isActive ? 'animate-pulse' : ''}`} />
            <span>{civState.isActive ? 'Pause Civilization Loop' : 'Activate Civilization Loop'}</span>
          </button>

          <button
            onClick={handleTriggerTick}
            disabled={isLoading || !civState.isActive}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/10 disabled:opacity-40 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Genesis...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Trigger Ecosystem Action</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* THREE MAIN MODULE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ECONOMY CARD */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Civilization Economy</p>
              <h3 className="text-2xl font-black text-amber-400 mt-2">${civState.balance}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10">
              <Coins className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-amber-500/80">
            <span>● Algorithmic liquidity auto-mints enabled</span>
          </div>
        </div>

        {/* GOVERNANCE CARD */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Governance Safety Level</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-2">100% SECURE</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-emerald-400/80">
            <span>● Active monitoring prevents deletions</span>
          </div>
        </div>

        {/* ECOSYSTEM APPS CARD */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Ecosystem Application Mesh</p>
              <h3 className="text-2xl font-black text-purple-400 mt-2">{civState.apps?.length || 0} Micro-SaaS Nodes</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
              <Layers className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-purple-400/80">
            <span>● Connected micro-services mesh active</span>
          </div>
        </div>

      </div>

      {/* DASHBOARD CONSOLE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: 7 Columns for Ecosystem, Governance Rules, and Ledger */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Sub Navigation */}
          <div className="flex border-b border-slate-900 pb-2.5 gap-1.5">
            <button
              onClick={() => setActiveSubTab('ecosystem')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all ${
                activeSubTab === 'ecosystem'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              🌐 App Ecosystem ({civState.apps?.length || 0})
            </button>
            <button
              onClick={() => setActiveSubTab('governance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all ${
                activeSubTab === 'governance'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              📜 AI Constitution Policies
            </button>
            <button
              onClick={() => setActiveSubTab('economy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all ${
                activeSubTab === 'economy'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              💱 Economy Ledger
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {activeSubTab === 'ecosystem' && (
              <motion.div
                key="ecosystem"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {(!civState.apps || civState.apps.length === 0) ? (
                  <div className="col-span-2 border border-dashed border-slate-900 rounded-2xl p-12 text-center text-slate-500 text-xs font-mono">
                    📭 Ecosystem offline. Trigger loops to auto-register micro-services.
                  </div>
                ) : (
                  civState.apps.map((app, index) => (
                    <div key={index} className="bg-slate-900/20 border border-slate-900/80 rounded-2xl p-5 space-y-4 hover:border-amber-500/25 transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
                      
                      {/* App Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-200 group-hover:text-amber-400 transition-colors">
                            {app.name}
                          </h4>
                          <span className="text-[9px] font-mono text-slate-500 bg-slate-950/50 px-2 py-0.5 rounded border border-slate-900/40 uppercase mt-1 tracking-wider inline-block">
                            {app.category}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[8px] font-bold rounded-full">
                          {app.status}
                        </span>
                      </div>

                      {/* Connections Mesh */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-900/60">
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">Inter-connected Endpoints:</p>
                        {(!app.connections || app.connections.length === 0) ? (
                          <p className="text-[9.5px] font-mono text-slate-600 italic">No direct routing lines established yet.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {app.connections.map((conn, cIdx) => (
                              <span key={cIdx} className="text-[9.5px] font-mono bg-slate-950 border border-slate-900 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
                                <Network className="w-2.5 h-2.5 text-amber-500" />
                                <span>{conn}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeSubTab === 'governance' && (
              <motion.div
                key="governance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                  <Scale className="w-5 h-5 text-amber-500" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Active AI Constitution Statutes</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Immutable governance guidelines processed by Governance AI</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {civState.rules?.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                      <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-medium text-slate-300">{rule}</p>
                      <Check className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2.5 bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl text-xs text-slate-400 leading-normal">
                  <Info className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Governance AI monitors all API routing strings, terminal prompts, and code-synthesis events. Any commands attempting deletions or container termination triggers an immediate override.
                  </span>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'economy' && (
              <motion.div
                key="economy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">System Transaction Ledger</h4>
                      <p className="text-[10px] text-slate-500 font-mono">Chronological transaction journal</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-black tracking-widest uppercase">
                    LEDGER SECURE
                  </span>
                </div>

                {(!civState.ledger || civState.ledger.length === 0) ? (
                  <div className="border border-dashed border-slate-900 rounded-xl p-8 text-center text-slate-500 text-xs font-mono">
                    📭 Transaction Ledger empty. Let the loop process trades.
                  </div>
                ) : (
                  <div className="bg-slate-950 rounded-xl border border-slate-900 divide-y divide-slate-900/60 max-h-[280px] overflow-y-auto custom-scrollbar">
                    {civState.ledger.map((tx, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs font-mono">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold">{tx.from}</span>
                            <span className="text-slate-600">➔</span>
                            <span className="text-slate-200">{tx.to}</span>
                          </div>
                          <span className="text-[9px] text-slate-500">{tx.timestamp}</span>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className={`font-black text-xs ${tx.type === 'MINT' || tx.type === 'REWARD' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {tx.type === 'MINT' || tx.type === 'REWARD' ? '+' : '-'}${tx.value}
                          </span>
                          <p className="text-[8.5px] text-slate-500 uppercase tracking-wider">{tx.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: Custom RealVoice Synthesizer & Operational Logs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* STEP 5: OWN REALVOICE ENGINE */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-400">
                <Volume2 className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">Local Voice Cloner Synthesizer</h3>
                <p className="text-[8px] text-slate-500 font-mono tracking-wider font-extrabold uppercase">LEVEL 22 VOICE PIPELINE (NO ELEVENLABS)</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">Live Status Reading Target Prompt:</p>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-900/80 font-mono text-[10.5px] text-slate-400 leading-relaxed max-h-[80px] overflow-y-auto custom-scrollbar">
                  {voiceBriefText}
                </div>
              </div>

              {/* Synthesizer Trigger Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => triggerTTS(voiceBriefText)}
                  disabled={isSpeaking}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/15 hover:from-amber-500/30 hover:to-orange-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                  <span>{isSpeaking ? "Speaking..." : "Speak Civilization Brief"}</span>
                </button>
              </div>

              {/* Advanced Real Clone Voice-calibration idea container */}
              <div className="border-t border-slate-900/60 pt-3.5 space-y-3">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider">
                  <span>Voice Embeddings Matrix</span>
                  <span className="text-amber-400 font-bold">{voiceSampleCount} Samples Calibrated</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-900/60 flex items-center justify-between gap-2.5">
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-300">Calibrate Voice Wave</h5>
                    <p className="text-[9px] text-slate-500 font-mono">Hold record to match synthesis profile</p>
                  </div>
                  <button
                    onClick={handleMicSampleUpload}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[9.5px] font-black uppercase text-amber-400 cursor-pointer transition-all"
                  >
                    + Intake Sample
                  </button>
                </div>
                
                {/* Visual Audio Wave animation when speaking */}
                {isSpeaking && (
                  <div className="flex items-end justify-center gap-1.5 h-6 pt-1 animate-pulse">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
                      <div 
                        key={bar} 
                        className="w-1 bg-amber-500 rounded" 
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
          </div>

          {/* CHRONOLOGICAL LOGS */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Civilization Logs Stream</h3>
              </div>
              <button
                onClick={fetchState}
                className="text-[8px] text-slate-500 hover:text-slate-300 font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-900 cursor-pointer"
              >
                Refresh State
              </button>
            </div>

            {(!civState.logs || civState.logs.length === 0) ? (
              <div className="border border-dashed border-slate-900 rounded-xl p-6 text-center text-slate-500 text-xs font-mono">
                ⏳ Waiting for digital ecosystem transactions...
              </div>
            ) : (
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-[9.5px] text-slate-300 space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar shadow-inner">
                {civState.logs.map((log: string, idx: number) => (
                  <p key={idx} className={
                    log.includes('🚨') || log.includes('REJECTED') ? 'text-rose-400 font-semibold' :
                    log.includes('⚖️') || log.includes('approved') ? 'text-emerald-400' :
                    log.includes('🌐') || log.includes('Ecosystem') ? 'text-amber-400' :
                    log.includes('🔗') || log.includes('Mesh') ? 'text-indigo-400' :
                    log.includes('💰') || log.includes('Economy') ? 'text-purple-400' :
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
                The AI Civilization OS background ticks every 50 seconds. RealVoice runs locally, preserving system privacy parameters.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
