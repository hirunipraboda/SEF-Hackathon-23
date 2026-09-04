import React from 'react';
import { Link } from 'react-router-dom';

const TrainDetails = ({ train, details, onClose }) => {
  if (!train) return null;

  const activeData = details || train;
  const stations = activeData.stations || (activeData.journeyProgress ? activeData.journeyProgress.map((jp) => ({
    name: jp.stationName,
    passed: jp.state === 'COMPLETED',
    isCurrent: jp.state === 'CURRENT',
    eta: jp.state === 'CURRENT' ? (activeData.etaNextStation || '--') : null,
  })) : [
    { name: activeData.origin || 'Origin', passed: true },
    { name: activeData.currentStation || 'Current Location', passed: true, isCurrent: true },
    { name: activeData.nextStation || 'Next Station', passed: false, eta: activeData.etaNextStation },
    { name: activeData.destination || 'Destination', passed: false, eta: activeData.destinationEta },
  ]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col h-full overflow-hidden transition-all animate-fadeIn">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400">#{activeData.trainNumber}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">{activeData.routeName}</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">{activeData.trainName}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeData.origin} → {activeData.destination}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Close details"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[580px]">
        {/* Status and Speed Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Status</div>
            <div className="text-xs font-bold mt-1">
              {activeData.status === 'ON_TIME' && <span className="text-emerald-700">On Time</span>}
              {activeData.status === 'DELAYED' && (
                <span className="text-amber-700">Delayed (+{activeData.delayMinutes}m)</span>
              )}
              {activeData.status === 'STOPPED' && <span className="text-red-700">Stopped</span>}
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Live Speed</div>
            <div className="text-xs font-bold text-slate-800 mt-1 flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {activeData.speedKmh ?? activeData.speed ?? 0} km/h
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Next ETA</div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              {activeData.etaNextStation || '--'}
            </div>
          </div>
        </div>

        {/* Current Location Highlight */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Current Track Sector
          </div>
          <p className="mt-1 text-emerald-800">
            Currently at or passing <strong>{activeData.currentStation}</strong>. Proceeding towards{' '}
            <strong>{activeData.nextStation}</strong>.
          </p>
        </div>

        {/* Vertical Journey Progression */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Journey Progression
          </h4>
          <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {stations.map((st, idx) => {
              const isDone = st.passed && !st.isCurrent;
              const isCurrent = st.isCurrent;

              return (
                <div key={idx} className="relative flex items-center justify-between text-xs">
                  {/* Node icon */}
                  <span
                    className={`absolute -left-5 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isDone ? '✓' : isCurrent ? '●' : ''}
                  </span>

                  {/* Station label */}
                  <div className="pl-2">
                    <span className={`font-semibold ${isCurrent ? 'text-blue-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                      {st.name}
                    </span>
                    {isCurrent && (
                      <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-medium">
                        Current
                      </span>
                    )}
                  </div>

                  {/* ETA or Status */}
                  <div className="text-[11px] text-slate-400 font-mono">
                    {st.eta ? (
                      <span className="text-slate-700 font-medium">ETA: {st.eta}</span>
                    ) : isDone ? (
                      <span className="text-emerald-700">Departed</span>
                    ) : (
                      'Upcoming'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integrated Quick Action Buttons */}
        <div className="border-t border-slate-100 pt-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Train Actions & Tools
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/routes?from=${encodeURIComponent(activeData.origin || 'Colombo Fort')}&to=${encodeURIComponent(activeData.destination || 'Kandy')}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Schedule
            </Link>

            <Link
              to={`/fare-calculator?origin=${encodeURIComponent(activeData.origin || 'Colombo Fort')}&destination=${encodeURIComponent(activeData.destination || 'Kandy')}&trainNumber=${encodeURIComponent(activeData.trainNumber || '')}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Fare
            </Link>

            <Link
              to={`/report-issue?trainNumber=${encodeURIComponent(activeData.trainNumber || '')}&trainId=${encodeURIComponent(activeData.id || '')}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Report Issue
            </Link>

            <Link
              to={`/feedback?trainNumber=${encodeURIComponent(activeData.trainNumber || '')}&trainId=${encodeURIComponent(activeData.id || '')}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainDetails;
