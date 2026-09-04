import React from 'react';

const TrackingStatus = ({ lastUpdated, onRefresh, trainsCount, counts = {}, loading }) => {
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Simulation Indicator */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            SIMULATED LIVE DATA
          </div>
          <span className="hidden sm:inline-block text-xs text-slate-500">
            Railway Simulation Engine • Refreshes every 8s
          </span>
        </div>

        {/* Right: Refresh & Last Updated */}
        <div className="flex items-center gap-3 text-xs text-slate-500 ml-auto">
          <span>Updated: <strong className="text-slate-700 font-mono">{formatTime(lastUpdated)}</strong></span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh positions"
          >
            <svg
              className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {counts && (
        <div className="grid grid-cols-4 gap-2 pt-3 mt-3 border-t border-slate-100 text-center text-xs">
          <div className="p-1.5 bg-slate-50 rounded-lg">
            <div className="text-slate-400 font-medium text-[10px] uppercase">Active Trains</div>
            <div className="text-base font-bold text-slate-800">{counts.total ?? trainsCount ?? 0}</div>
          </div>
          <div className="p-1.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
            <div className="text-emerald-700 font-medium text-[10px] uppercase">On Time</div>
            <div className="text-base font-bold text-emerald-700">{counts.onTime ?? 0}</div>
          </div>
          <div className="p-1.5 bg-amber-50/60 rounded-lg border border-amber-100">
            <div className="text-amber-700 font-medium text-[10px] uppercase">Delayed</div>
            <div className="text-base font-bold text-amber-700">{counts.delayed ?? 0}</div>
          </div>
          <div className="p-1.5 bg-red-50/60 rounded-lg border border-red-100">
            <div className="text-red-700 font-medium text-[10px] uppercase">Stopped</div>
            <div className="text-base font-bold text-red-700">{counts.stopped ?? 0}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingStatus;
