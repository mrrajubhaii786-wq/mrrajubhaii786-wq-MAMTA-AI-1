import React from 'react';

export function ChatSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex gap-4 max-w-2xl mx-auto ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-800 rounded w-full mb-1" />
          <div className="h-3 bg-slate-800 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 animate-pulse">
          <div className="h-3 bg-slate-800 rounded w-20 mb-2" />
          <div className="h-6 bg-slate-800 rounded w-12" />
        </div>
      ))}
    </div>
  );
}
