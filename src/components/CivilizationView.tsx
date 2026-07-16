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
  Network, 
  Info,
  Scale,
  DollarSign,
  TrendingUp,
  Sliders,
  Sparkles,
  Users,
  CheckCircle,
  AlertTriangle,
  FileText,
  Key,
  Database,
  ArrowRight,
  Gavel,
  ShieldAlert,
  Terminal,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  // Master Plan 39 civilization core & gaps states
  const [coreState, setCoreState] = useState<{
    pop: number;
    rules: string[];
    mode: string;
    agents: string[];
  }>({
    pop: 250,
    rules: ["NO_HARM", "OPTIMIZE_SYSTEM", "RESOURCE_EQUALITY", "COGNITIVE_STABILITY"],
    mode: "OPEN_MODE",
    agents: ["worker", "trader", "builder", "mediator", "sensor"]
  });

  const [runHistory, setRunHistory] = useState<any[]>([]);
  const [isSimulatingCore, setIsSimulatingCore] = useState(false);

  // Gaps Inputs and Results
  const [paymentAmount, setPaymentAmount] = useState<number>(150);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [domainToBuy, setDomainToBuy] = useState<string>("mamta-node-tokyo.ai");
  const [domainResult, setDomainResult] = useState<any>(null);
  const [ownedDomains, setOwnedDomains] = useState<string[]>([]);
  const [isBuyingDomain, setIsBuyingDomain] = useState(false);

  const [offerPrice, setOfferPrice] = useState<number>(85);
  const [demandPrice, setDemandPrice] = useState<number>(100);
  const [negotiationResult, setNegotiationResult] = useState<any>(null);
  const [isNegotiating, setIsNegotiating] = useState(false);

  const [errorCodeInput, setErrorCodeInput] = useState<string>("DB_WRITE_LOCK_EXCEPTION");
  const [repairResult, setRepairResult] = useState<any>(null);
  const [isRepairing, setIsRepairing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'civilization' | 'ecosystem' | 'gaps' | 'governance' | 'economy'>('civilization');

  const fetchState = async () => {
    try {
      // Fetch Legacy state
      const res = await fetch('/api/civilization/state');
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          setCivState(data);
        }
      }

      // Fetch MP39 Civilization State
      const civCoreRes = await fetch('/api/civilization-core/state');
      if (civCoreRes.ok) {
        const coreData = await civCoreRes.json();
        if (coreData.success) {
          setCoreState(coreData.latest);
          setRunHistory(coreData.history || []);
        }
      }
    } catch (err: any) {
      console.warn('Gracefully handled civilization state sync issue:', err.message || err);
    }
  };

  const handleToggleLoop = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/civilization/toggle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCivState(prev => ({ ...prev, isActive: data.isActive }));
        }
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
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCivState(data.state);
        }
      }
    } catch (err: any) {
      console.warn('Gracefully handled manual civilization tick trigger issue:', err.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Civilization Core (Master Plan 39)
  const handleRunCivilizationCore = async () => {
    setIsSimulatingCore(true);
    try {
      const res = await fetch('/api/civilization/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setCoreState(prev => ({
          ...prev,
          pop: data.pop,
          mode: data.mode
        }));
        // Fetch state to update execution histories
        await fetchState();
      }
    } catch (err: any) {
      console.warn('Failed running civilization core:', err);
    } finally {
      setIsSimulatingCore(false);
    }
  };

  // GAP 1: Trigger Webhook
  const handleTriggerWebhook = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch('/api/civilization/gap-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: {
            type: "payment_success",
            amount: paymentAmount
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // GAP 2: Register Domain
  const handleRegisterDomain = async () => {
    setIsBuyingDomain(true);
    try {
      const res = await fetch('/api/civilization/gap-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: domainToBuy,
          action: "buy"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDomainResult(data);
        
        // Refresh domain list
        const listRes = await fetch('/api/civilization/gap-domain', { method: 'POST' });
        if (listRes.ok) {
          const listData = await listRes.json();
          setOwnedDomains(listData.domains || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBuyingDomain(false);
    }
  };

  // GAP 3: AI Negotiation Protocol
  const handleNegotiate = async () => {
    setIsNegotiating(true);
    try {
      const res = await fetch('/api/civilization/gap-negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer: offerPrice,
          demand: demandPrice
        })
      });
      if (res.ok) {
        const data = await res.json();
        setNegotiationResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsNegotiating(false);
    }
  };

  // GAP 4: Self-Repair pipeline
  const handleTriggerSelfRepair = async () => {
    setIsRepairing(true);
    try {
      const res = await fetch('/api/civilization/gap-selfrepair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: errorCodeInput
        })
      });
      if (res.ok) {
        const data = await res.json();
        setRepairResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRepairing(false);
    }
  };

  useEffect(() => {
    fetchState();
    // Initial domain lookup
    fetch('/api/civilization/gap-domain', { method: 'POST' })
      .then(r => r.json())
      .then(d => setOwnedDomains(d.domains || []))
      .catch(() => {});

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
              MASTER PLAN 39 ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[9px] uppercase font-black tracking-widest">
              AGI CIVILIZATION LAYER
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5 uppercase font-display">
            <Globe className="w-7 h-7 text-amber-400 animate-[spin_30s_linear_infinite]" />
            <span>AGI Civilization OS</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Supervising a decentralized society network governed by algorithmic policy constitutions, active trade layers, and automated governance daemons.
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
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Mesh...</span>
              </>
            ) : (
              <>
                <Sliders className="w-3.5 h-3.5" />
                <span>Tick Mesh System</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CORE COGNITIVE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* SOCIETY POPULATION */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Civilization Population</p>
              <h3 className="text-2xl font-black text-indigo-400 mt-2">{coreState.pop} AI Citizens</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-indigo-400/80">
            <span>● Growing autonomously (+10 / epoch)</span>
          </div>
        </div>

        {/* POLICY MODE */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Dynamic Law Mode</p>
              <h3 className="text-2xl font-black text-purple-400 mt-2">{coreState.mode}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10">
              <Gavel className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-purple-400/80">
            <span>● Strict Mode triggers if risk &gt; 5</span>
          </div>
        </div>

        {/* TREASURY ECONOMY */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Treasury Reserve</p>
              <h3 className="text-2xl font-black text-amber-400 mt-2">${civState.balance}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10">
              <Coins className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-amber-500/80">
            <span>● Minting trade rewards chronologically</span>
          </div>
        </div>

        {/* GOVERNANCE CONSTITUTION */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Governance Safety</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-2">SECURE CORE</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-emerald-400/80">
            <span>● 4 constitution statutes active</span>
          </div>
        </div>

      </div>

      {/* DASHBOARD CONSOLE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT MAIN MODULES PANEL */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap border-b border-slate-900 pb-2.5 gap-1.5">
            <button
              onClick={() => setActiveSubTab('civilization')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all ${
                activeSubTab === 'civilization'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              🌐 Civilization Core (MP 39)
            </button>
            <button
              onClick={() => setActiveSubTab('gaps')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all ${
                activeSubTab === 'gaps'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              ⚠️ Gaps & Security Fixes
            </button>
            <button
              onClick={() => setActiveSubTab('ecosystem')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all ${
                activeSubTab === 'ecosystem'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              🧱 App Mesh ({civState.apps?.length || 0})
            </button>
            <button
              onClick={() => setActiveSubTab('governance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer transition-all ${
                activeSubTab === 'governance'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950/20'
              }`}
            >
              📜 AI Constitution
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
            
            {/* CIVILIZATION TAB (MASTER PLAN 39) */}
            {activeSubTab === 'civilization' && (
              <motion.div
                key="civilization"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Simulation trigger */}
                <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Civilization Society Simulator Engine</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Instantly simulate a civilization epoch loop to trigger citizen growth, legal enforcement policies, and multi-agent resource allocations.
                    </p>
                  </div>
                  <button
                    onClick={handleRunCivilizationCore}
                    disabled={isSimulatingCore}
                    className="px-5 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    {isSimulatingCore ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Running Epoch...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Epoch Loop</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Society Agents Grid */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                    Multi-Agent Coordination Matrix
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {coreState.agents.map((agent) => (
                      <div key={agent} className="bg-slate-950/40 border border-slate-900 p-3.5 rounded-xl text-center space-y-1.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono text-xs mx-auto uppercase">
                          {agent[0]}
                        </div>
                        <h5 className="text-xs font-black text-slate-200 uppercase">{agent}</h5>
                        <span className="inline-block text-[9px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded uppercase border border-emerald-500/10">
                          Active Job
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical results logs */}
                <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                    <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                      <span>Epoch Run History Ledger</span>
                    </h4>
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-black">
                      Live Output Logs
                    </span>
                  </div>

                  <div className="bg-slate-950 rounded-xl border border-slate-900 divide-y divide-slate-900/60 max-h-[220px] overflow-y-auto custom-scrollbar">
                    {runHistory.length === 0 ? (
                      <p className="p-4 text-center text-slate-500 text-xs font-mono">
                        📭 Run history is empty. Click "Run Epoch Loop" to begin.
                      </p>
                    ) : (
                      runHistory.map((item, index) => (
                        <div key={index} className="p-3 space-y-2 font-mono text-xs">
                          <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-900/30 pb-1">
                            <span>Epoch {runHistory.length - index}</span>
                            <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
                            <div>
                              <span className="text-slate-500">Citizens:</span>{" "}
                              <span className="text-indigo-400 font-bold">{item.pop}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Law Status:</span>{" "}
                              <span className="text-emerald-400 font-bold">{item.law}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Policy Mode:</span>{" "}
                              <span className="text-purple-400 font-bold">{item.mode}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Agent Roles:</span>{" "}
                              <span className="text-amber-400 font-bold">{item.assign?.length || 0} Assgn</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {/* GAPS & SECURITY FIXES TAB (MASTER PLAN 39) */}
            {activeSubTab === 'gaps' && (
              <motion.div
                key="gaps"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                
                {/* GAP 1: Webhook Payment */}
                <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider">Gap 1: Payment Webhook</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Live Money Incoming Verification</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-black">Transaction Amount (USD)</label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                      />
                    </div>

                    {paymentResult && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 font-mono text-[10px] space-y-1 text-slate-300">
                        <p className="text-emerald-400 font-bold">● Result: {paymentResult.status}</p>
                        <p>Tx Amount: ${paymentResult.amount}</p>
                        <p className="text-[8.5px] text-slate-500">ID: {paymentResult.txId}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleTriggerWebhook}
                    disabled={isProcessingPayment}
                    className="w-full mt-3 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/15 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isProcessingPayment ? <Loader2 className="w-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    <span>Test Payment Webhook</span>
                  </button>
                </div>

                {/* GAP 2: Asset / Domain Buy */}
                <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15 text-amber-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider">Gap 2: Domain AI Ownership</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Registry & Assets Controller</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-black">Register Domain Name</label>
                      <input
                        type="text"
                        value={domainToBuy}
                        onChange={(e) => setDomainToBuy(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                      />
                    </div>

                    {domainResult && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 font-mono text-[10px] space-y-1 text-slate-300">
                        <p className="text-amber-400 font-bold">● Status: {domainResult.status}</p>
                        <p>Registered: {domainResult.domain}</p>
                        <p>DNS Configured: {domainResult.dnsConfigured ? "SUCCESS" : "NO"}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRegisterDomain}
                    disabled={isBuyingDomain}
                    className="w-full mt-3 px-4 py-2.5 bg-amber-500/10 border border-amber-500/15 hover:bg-amber-500/20 text-amber-400 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isBuyingDomain ? <Loader2 className="w-3 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>Acquire AI Domain Asset</span>
                  </button>
                </div>

                {/* GAP 3: AI Negotiation Protocol */}
                <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-400">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider">Gap 3: Negotiation AI</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Bilateral Decision Consensus</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase font-black">Offer Price ($)</label>
                        <input
                          type="number"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase font-black">Demand Price ($)</label>
                        <input
                          type="number"
                          value={demandPrice}
                          onChange={(e) => setDemandPrice(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                        />
                      </div>
                    </div>

                    {negotiationResult && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 font-mono text-[10px] space-y-1 text-slate-300">
                        <p className={negotiationResult.decision === 'ACCEPT' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          ● Response: {negotiationResult.decision}
                        </p>
                        <p>Settlement: ${negotiationResult.finalPrice}</p>
                        <p className="text-slate-400 italic text-[9.5px] leading-relaxed">"{negotiationResult.message}"</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNegotiate}
                    disabled={isNegotiating}
                    className="w-full mt-3 px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/15 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isNegotiating ? <Loader2 className="w-3 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    <span>Negotiate Settlement</span>
                  </button>
                </div>

                {/* GAP 4: Self-Heal Pipeline */}
                <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                      <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/15 text-rose-400">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider">Gap 4: Self-Repair System</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Automated Code Correction</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-black">Error Signature</label>
                      <input
                        type="text"
                        value={errorCodeInput}
                        onChange={(e) => setErrorCodeInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                      />
                    </div>

                    {repairResult && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 font-mono text-[10px] space-y-1 text-slate-300">
                        <p className="text-emerald-400 font-bold">● Status: {repairResult.result?.status}</p>
                        <p>Action: {repairResult.result?.action}</p>
                        <p className="text-[8.5px] text-slate-500">Log ID: {repairResult.result?.logId}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleTriggerSelfRepair}
                    disabled={isRepairing}
                    className="w-full mt-3 px-4 py-2.5 bg-rose-500/10 border border-rose-500/15 hover:bg-rose-500/20 text-rose-400 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isRepairing ? <Loader2 className="w-3 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>Deploy Patch / Heal</span>
                  </button>
                </div>

              </motion.div>
            )}

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
                      <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
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

        {/* RIGHT COLUMN: Chronological logs & state statuses */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* STATE OVERVIEW & WEBHOOK METADATA */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Civilization Active Nodes</h3>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/15 font-mono text-[9px] font-black uppercase">
                {civState.isActive ? "RUNNING" : "PAUSED"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Tick Cycles:</span>
                <span className="text-slate-200 font-bold">{civState.tickCount} Epochs</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Latest Action:</span>
                <span className="text-amber-400 font-bold text-[10.5px] max-w-[150px] truncate" title={civState.lastAction}>
                  {civState.lastAction}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Consensus Status:</span>
                <span className="text-emerald-400 font-bold">{civState.lastActionStatus}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Live Domain Registry:</span>
                <span className="text-indigo-400 font-bold">{ownedDomains.length} Owned</span>
              </div>
            </div>

            <div className="border-t border-slate-900/60 pt-3.5 space-y-1.5">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">AI Domain Ledger:</p>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-900/80 font-mono text-[10px] text-slate-400 leading-relaxed max-h-[80px] overflow-y-auto custom-scrollbar space-y-1">
                {ownedDomains.map((d) => (
                  <div key={d} className="flex items-center justify-between text-slate-300">
                    <span>{d}</span>
                    <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 rounded uppercase font-bold">OWNED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CHRONOLOGICAL LIVE FEED LOGS */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Ecosystem Logs Stream</h3>
              </div>
              <button
                onClick={fetchState}
                className="text-[8px] text-slate-500 hover:text-slate-300 font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-900 cursor-pointer"
              >
                Refresh
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
          </div>

        </div>

      </div>

    </div>
  );
}
