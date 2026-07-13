import React, { useState, useEffect } from 'react';
import {
  Brain,
  Cpu,
  Shield,
  Zap,
  TrendingUp,
  Code,
  Database,
  Activity,
  Globe,
  RefreshCw,
  Server
} from 'lucide-react';
import { CodeGenerator } from '../brain/CodeGenerator';
import { ArchitectureAI, OptimizationTarget } from '../brain/ArchitectureAI';
import { BusinessAI, SaaSProductIdea } from '../brain/BusinessAI';

interface AgentTelemetry {
  id: string;
  name: string;
  role: 'Security Scanner' | 'Performance Optimizer' | 'Business Strategist' | 'Autonomous Coder';
  status: 'SCANNING' | 'OPTIMIZING' | 'PITCHING' | 'CODING' | 'IDLE';
  activity: string;
  cpu: number;
  memory: string;
}

export default function AgentHiveView() {
  const [telemetry, setTelemetry] = useState<AgentTelemetry[]>([
    { id: '1', name: 'MamtaGuard-18', role: 'Security Scanner', status: 'SCANNING', activity: 'Inspecting Docker Sandbox logs...', cpu: 14, memory: '180 MB' },
    { id: '2', name: 'MamtaSpeed-18', role: 'Performance Optimizer', status: 'OPTIMIZING', activity: 'Evaluating Redis geo-replication latencies...', cpu: 32, memory: '240 MB' },
    { id: '3', name: 'MamtaMonetize-18', role: 'Business Strategist', status: 'PITCHING', activity: 'Generating micro-SaaS niche pricing tiers...', cpu: 8, memory: '110 MB' },
    { id: '4', name: 'MamtaCoder-18', role: 'Autonomous Coder', status: 'CODING', activity: 'Compiling React tsx component templates...', cpu: 45, memory: '310 MB' }
  ]);

  const [codeResult, setCodeResult] = useState<string>('');
  const [targets, setTargets] = useState<OptimizationTarget[]>([]);
  const [ideas, setIdeas] = useState<SaaSProductIdea[]>([]);
  const [syncLogs, setSyncLogs] = useState<{ id: string; cluster: string; latency: number; payload: string }[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    runEvolutions();
    const interval = setInterval(() => {
      // Simulate telemetry oscillation
      setTelemetry(prev => prev.map(agent => ({
        ...agent,
        cpu: Math.min(99, Math.max(5, agent.cpu + Math.floor(Math.random() * 11) - 5)),
        status: Math.random() > 0.7 ? (agent.status === 'IDLE' ? 'SCANNING' : 'IDLE') as any : agent.status
      })));

      // Add a simulated federated log
      const clusters = ['cluster-gcp-us-east', 'cluster-gcp-europe-west', 'cluster-gcp-asia-east'];
      const cluster = clusters[Math.floor(Math.random() * clusters.length)];
      const latency = Math.floor(Math.random() * 45) + 12;
      const payloads = ['Synced checkLimit() threshold', 'Replicated versions.json snapshot', 'Shared federated_sync_log_learning', 'Flushed Redis buffer'];
      const payload = payloads[Math.floor(Math.random() * payloads.length)];
      
      setSyncLogs(prev => [
        { id: Math.random().toString(36).substring(7), cluster, latency, payload },
        ...prev.slice(0, 9)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const runEvolutions = () => {
    setIsRefreshing(true);
    
    // Instantiation
    const generator = new CodeGenerator();
    const arch = new ArchitectureAI();
    const biz = new BusinessAI();

    const gen = generator.generateComponent('AutoDashboard', 'Evolved system visualizer');
    setCodeResult(gen.code);

    setTargets(arch.analyzeSystemArchitecture());
    setIdeas(biz.generateBusinessIdeas());

    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div id="agent_hive_view_root" className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 text-slate-100 bg-slate-950 rounded-2xl border border-slate-800">
      
      {/* HEADER SECTION */}
      <div className="lg:col-span-12 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-md font-bold tracking-tight text-white">🧠 Agent Hive Mind Dashboard (V18.0)</h2>
            <p className="text-[11px] text-slate-400">Self-Observing, Self-Scaling & Self-Evolving AGI Control Center</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
            ● AGILoop Active
          </div>
          <button
            onClick={runEvolutions}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Swarm</span>
          </button>
        </div>
      </div>

      {/* LEFT COLUMN: Telemetry & Swarm List (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* TELEMETRY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {telemetry.map(agent => (
            <div key={agent.id} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2.5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    agent.role === 'Security Scanner' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    agent.role === 'Performance Optimizer' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    agent.role === 'Business Strategist' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  } border`}>
                    {agent.role === 'Security Scanner' && <Shield className="w-4 h-4" />}
                    {agent.role === 'Performance Optimizer' && <Cpu className="w-4 h-4" />}
                    {agent.role === 'Business Strategist' && <TrendingUp className="w-4 h-4" />}
                    {agent.role === 'Autonomous Coder' && <Code className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                    <p className="text-[9px] text-slate-400 font-medium">{agent.role}</p>
                  </div>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  agent.status === 'IDLE' ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-400 animate-pulse'
                }`}>
                  {agent.status}
                </span>
              </div>

              <p className="text-[10px] text-slate-300 font-mono leading-relaxed bg-slate-950/40 p-2 rounded border border-slate-900">
                {agent.activity}
              </p>

              <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">⚡ CPU: <b className="text-slate-200">{agent.cpu}%</b></span>
                <span className="flex items-center gap-1">📦 MEM: <b className="text-slate-200">{agent.memory}</b></span>
              </div>
            </div>
          ))}
        </div>

        {/* INTEGRATED BUSINESS IDEAS & ARCHITECT TARGETS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Architecture Optimizations */}
          <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2.5">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Optimizations Detected (ArchitectureAI)</span>
            </h3>
            <div className="space-y-2">
              {targets.map((t, i) => (
                <div key={i} className="p-2 bg-slate-950/40 rounded border border-slate-900 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-300">{t.component}</span>
                    <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 py-0.2 rounded font-mono font-bold">
                      Impact: {t.impactScore}%
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400">{t.recommendedFix}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Pitch Ideas */}
          <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2.5">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>SaaS Monetization Hooks (BusinessAI)</span>
            </h3>
            <div className="space-y-2">
              {ideas.map((idea, i) => (
                <div key={i} className="p-2 bg-slate-950/40 rounded border border-slate-900 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-300">{idea.title}</span>
                    <span className="text-[9px] text-emerald-400 font-bold font-mono">
                      ${idea.monthlyPricingUSD}/mo
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-relaxed">{idea.coreHook}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT COLUMN: Federated Memory & Code Output (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* FEDERATED MEMORY GEO-REPLICATION STATE */}
        <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2.5">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Active-Active Geo-Replication (FederatedMemory)</span>
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {['cluster-us-east', 'cluster-europe-west', 'cluster-asia-east'].map(c => (
              <div key={c} className="p-2 bg-slate-950/60 rounded border border-slate-900 text-center space-y-1">
                <Server className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-[8px] font-mono font-bold block text-slate-300">{c}</span>
                <span className="text-[8px] text-emerald-400 font-bold block">100% Synced</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
            {syncLogs.length === 0 ? (
              <p className="text-[9px] text-slate-500 italic text-center py-6">Listening for federated cluster logs...</p>
            ) : (
              syncLogs.map(log => (
                <div key={log.id} className="flex justify-between items-center text-[9px] font-mono p-1.5 bg-slate-950/40 rounded border border-slate-900">
                  <span className="text-indigo-400 truncate max-w-[130px]">{log.cluster}</span>
                  <span className="text-slate-300 truncate max-w-[180px]">{log.payload}</span>
                  <span className="text-emerald-400 shrink-0">+{log.latency}ms</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CODEN COMPILER VISUALIZER */}
        <div className="p-3.5 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2.5 flex flex-col">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 shrink-0">
            <Code className="w-4 h-4 text-emerald-400" />
            <span>Auto-Generated Component Buffer (CodeGenerator)</span>
          </h3>
          
          <div className="flex-1 min-h-[160px] bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[9px] text-emerald-300 overflow-auto custom-scrollbar leading-relaxed">
            <pre>{codeResult}</pre>
          </div>
        </div>

      </div>

    </div>
  );
}
