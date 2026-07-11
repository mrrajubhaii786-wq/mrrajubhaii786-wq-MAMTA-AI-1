import React, { useEffect, useRef } from "react";
import { Terminal, Shield, Trash2, Cpu, ArrowDown } from "lucide-react";

interface TerminalViewProps {
  logs: string[];
  onClearLogs?: () => void;
  title?: string;
}

export function TerminalView({ logs, onClearLogs, title = "Mamta AI - Live Neural Loop Trace" }: TerminalViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div id="terminal-container-view" className="w-full bg-[#0a0f1d] border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 select-none">
        <div className="flex items-center gap-3">
          {/* Mock Window Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold tracking-wide">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status badge */}
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold animate-pulse">
            <Cpu className="w-2.5 h-2.5" />
            <span>L10 active</span>
          </div>

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="p-1 text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-850 hover:bg-slate-800 rounded transition-all cursor-pointer"
              title="Clear Neural Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Lines Content */}
      <div className="p-4 h-64 overflow-y-auto flex flex-col gap-1.5 bg-[#070b14] text-slate-300 font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <Shield className="w-5 h-5 text-indigo-500/40 animate-pulse" />
            <span>Neural telemetry stream offline. Activate loop or post queries to spawn traces.</span>
          </div>
        ) : (
          logs.map((log, index) => {
            let lineClass = "text-slate-300";
            if (log.includes("❌") || log.includes("Error") || log.includes("failed")) {
              lineClass = "text-rose-400 font-medium";
            } else if (log.includes("✅") || log.includes("successful") || log.includes("complete")) {
              lineClass = "text-emerald-400 font-medium";
            } else if (log.includes("⚡") || log.includes("Decision") || log.includes("🧠")) {
              lineClass = "text-amber-400 font-semibold";
            } else if (log.includes("🤖") || log.includes("Loop")) {
              lineClass = "text-cyan-400 font-semibold";
            } else if (log.includes("☁️") || log.includes("Cloud")) {
              lineClass = "text-blue-400";
            } else if (log.includes("🎓") || log.includes("Learned") || log.includes("Recall")) {
              lineClass = "text-violet-400";
            } else if (log.startsWith(">")) {
              lineClass = "text-indigo-400/90 font-mono";
            }

            return (
              <div key={index} className={`flex items-start gap-2 select-all hover:bg-slate-900/40 px-1 py-0.5 rounded transition-all ${lineClass}`}>
                <span className="text-slate-600 shrink-0 select-none">[{new Date().toLocaleTimeString()}]</span>
                <span className="whitespace-pre-wrap break-all">{log}</span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
