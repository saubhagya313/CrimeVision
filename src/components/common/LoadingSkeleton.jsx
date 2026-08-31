import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-panel p-5 rounded-xl border border-slate-800 animate-pulse space-y-4">
    <div className="h-4 bg-slate-800 rounded w-1/3" />
    <div className="h-8 bg-slate-800 rounded w-1/2" />
    <div className="h-3 bg-slate-800/60 rounded w-2/3" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, idx) => (
      <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 animate-pulse flex items-center justify-between">
        <div className="space-y-2 w-1/3">
          <div className="h-4 bg-slate-800 rounded" />
          <div className="h-3 bg-slate-800/60 rounded w-2/3" />
        </div>
        <div className="h-6 bg-slate-800 rounded w-20" />
        <div className="h-6 bg-slate-800 rounded w-16" />
      </div>
    ))}
  </div>
);

export default CardSkeleton;
