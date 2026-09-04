import React from 'react';

const getStatusBadge = (status, delayMinutes) => {
  switch (status) {
    case 'ON_TIME':
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          On Time
        </span>
      );
    case 'DELAYED':
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Delayed {delayMinutes > 0 ? `+${delayMinutes}m` : ''}
        </span>
      );
    case 'STOPPED':
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Stopped
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
          {status}
        </span>
      );
  }
};

const TrainTrackingCard = ({ train, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(train)}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-white ${
        isSelected
          ? 'border-emerald-600 bg-emerald-50/20 shadow-md ring-1 ring-emerald-500'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500">#{train.trainNumber}</span>
            <span className="text-[11px] font-medium text-slate-400">|</span>
            <span className="text-[11px] font-medium text-slate-500">{train.routeName}</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 mt-0.5 leading-snug">{train.trainName}</h4>
        </div>
        <div>{getStatusBadge(train.status, train.delayMinutes)}</div>
      </div>

      <div className="bg-slate-50 rounded-lg p-2 text-xs space-y-1 text-slate-600 border border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Location:</span>
          <span className="font-semibold text-slate-800 truncate max-w-[170px] text-right">
            {train.currentStation}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Heading towards:</span>
          <span className="font-medium text-slate-700 truncate max-w-[170px] text-right">
            {train.nextStation}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{train.speedKmh ?? train.speed ?? 0} km/h</span>
          </div>
          <span className="text-[11px] text-slate-500">
            ETA: <strong className="text-slate-700">{train.etaNextStation || '--'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrainTrackingCard;
