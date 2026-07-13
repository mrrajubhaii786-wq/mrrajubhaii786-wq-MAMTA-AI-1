// src/components/LiveTerminal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, Pause, Trash2, ShieldAlert, Cpu, HardDrive, Database, Send } from 'lucide-react';

export default function LiveTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [command, setCommand] = useState<string>('');
  const [cpuUsage, setCpuUsage] = useState<number>(14.5);
  const [memoryUsage, setMemoryUsage] = useState<number>(312); // MB
  const [containerId] = useState<string>('mamta-sandbox-node-3e2f');
  
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Connect to SSE stream-logs
  useEffect(() => {
    if (isStreaming) {
      const es = new EventSource('/api/stream-logs');
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        setLogs((prev) => {
          const next = [...prev, event.data];
          // Limit to last 100 lines for performance
          if (next.length > 100) {
            return next.slice(next.length - 100);
          }
          return next;
        });
        
        // Randomly fluctuate vitals for realism
        setCpuUsage((c) => Math.max(5, Math.min(95, +(c + (Math.random() * 4 - 2)).toFixed(1))));
        setMemoryUsage((m) => Math.max(250, Math.min(512, +(m + (Math.random() * 6 - 3)).toFixed(0))));
      };

      es.onerror = () => {
        console.warn('SSE EventSource disconnected. Reconnecting...');
      };

      return () => {
        es.close();
      };
    } else {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    }
  }, [isStreaming]);

  // Auto scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Custom command execution simulation
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim();
    const userPromptLine = `root@${containerId}:~$ ${cmd}`;
    let outputLines: string[] = [];

    // Add simulated outputs for specific commands
    if (cmd === 'help') {
      outputLines = [
        'Available terminal commands:',
        '  help              - List all available operations',
        '  docker ps         - List active AGI containers',
        '  npm run dev       - Verify dev process logs',
        '  clear             - Clear screen buffer',
        '  agi-status        - Inspect Mamta Swarm Consensus health'
      ];
    } else if (cmd === 'docker ps') {
      outputLines = [
        'CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS         PORTS',
        'mamta-3e2f     mamtadevs/sandbox-19  "docker-entrypoint.s…"   2 hours ago     Up 2 hours     0.0.0.0:3000->3000/tcp',
        'raft-consensus mamtadevs/raft-v19    "raft-start.sh"          30 mins ago     Up 30 mins     0.0.0.0:8001->8001/tcp'
      ];
    } else if (cmd === 'npm run dev') {
      outputLines = [
        '> mamta-ai@19.0.0 dev',
        '> tsx server.ts',
        '',
        '[SYSTEM] Starting AGI Core OS...',
        '🔥 Express Server initialized on Port 3000',
        '🚀 Vite Middleware mounted on Host 0.0.0.0',
        '⚡ [AGIOS] Consensus Engine (Raft Ballot) active and listening...'
      ];
    } else if (cmd === 'agi-status') {
      outputLines = [
        '--- Swarm Consensus Diagnostics ---',
        'Node Count  : 4 Swarm Sub-Agents',
        'Ballot Type : Majority Rule (3/4 Required)',
        'Latest Vote : APPROVED (4x APPROVE, 0x REJECT)',
        'Memory Sync : Geo-replicated (Federated AWS + GCP Region Active)'
      ];
    } else if (cmd === 'clear') {
      setLogs([]);
      setCommand('');
      return;
    } else {
      outputLines = [
        `bash: ${cmd}: command not found. Type 'help' for support.`
      ];
    }

    setLogs((prev) => [...prev, userPromptLine, ...outputLines]);
    setCommand('');
  };

  return (
    <div id="live-terminal-panel" className="bg-slate-950/90 border border-slate-800 rounded-2xl shadow-2xl p-6 font-sans">
      {/* Container Header Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-4 mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <TerminalIcon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
              Docker Sandbox CLI <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">Container ID: <span className="text-emerald-400/80">{containerId}</span></p>
          </div>
        </div>

        {/* Real-time Diagnostics Vitals Bar */}
        <div className="flex items-center gap-6 text-xs text-slate-400 font-mono bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>CPU: <strong className="text-slate-200">{cpuUsage}%</strong></span>
          </div>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>RAM: <strong className="text-slate-200">{memoryUsage} MB</strong></span>
          </div>
        </div>

        {/* Streaming Controls */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-stream-btn"
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
              isStreaming
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Streaming
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Resume Streaming
              </>
            )}
          </button>
          <button
            id="clear-logs-btn"
            onClick={() => setLogs([])}
            className="p-1.5 bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 rounded-lg transition-all"
            title="Clear Console Buffer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Display Code Panel */}
      <div className="bg-black/95 rounded-xl border border-slate-900 p-4 h-80 overflow-y-auto font-mono text-xs text-slate-300 relative selection:bg-emerald-500/30 selection:text-emerald-300">
        <div className="space-y-1.5">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic flex items-center justify-center h-64 flex-col gap-2">
              <ShieldAlert className="w-8 h-8 text-slate-600 animate-bounce" />
              <span>No terminal log buffers cached yet. Enter commands below or resume streaming.</span>
            </div>
          ) : (
            logs.map((log, index) => {
              // Highlight colors depending on line flags
              let colorClass = 'text-emerald-400/90';
              if (log.includes('[MamtaGuard-19]')) colorClass = 'text-rose-400 font-semibold';
              if (log.includes('[MamtaSpeed-19]')) colorClass = 'text-amber-300';
              if (log.includes('[MamtaMonetize-19]')) colorClass = 'text-cyan-400';
              if (log.includes('[MamtaCoder-19]')) colorClass = 'text-fuchsia-400';
              if (log.includes('~$')) colorClass = 'text-slate-200 font-bold border-t border-slate-900 pt-2 first:pt-0';
              if (log.includes('ERROR') || log.includes('Rejected')) colorClass = 'text-red-400 bg-red-950/20 px-1 rounded';

              return (
                <div key={index} className={`leading-relaxed whitespace-pre-wrap ${colorClass}`}>
                  {log}
                </div>
              );
            })
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Command Prompt Submission Form */}
      <form onSubmit={handleSendCommand} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-mono text-xs select-none">root@mamtalabs:~$</span>
          <input
            id="terminal-command-input"
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type 'help' and press Enter to simulate sandbox triggers..."
            className="w-full bg-black/80 border border-slate-800 focus:border-emerald-500/50 rounded-xl pl-32 pr-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none transition-all placeholder:text-slate-600"
          />
        </div>
        <button
          id="submit-command-btn"
          type="submit"
          className="px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center transition-all duration-200"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
