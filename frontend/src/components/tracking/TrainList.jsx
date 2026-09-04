import React from 'react';
import TrainTrackingCard from './TrainTrackingCard';

const TrainList = ({
  trains = [],
  allTrains = [],
  routes = [],
  selectedTrain,
  onSelectTrain,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  selectedRouteFilter,
  onRouteChange,
}) => {
  // Compute counts based on allTrains
  const counts = {
    ALL: allTrains.length,
    ON_TIME: allTrains.filter((t) => t.status === 'ON_TIME').length,
    DELAYED: allTrains.filter((t) => t.status === 'DELAYED').length,
    STOPPED: allTrains.filter((t) => t.status === 'STOPPED').length,
  };

  const filterButtons = [
    { key: 'ALL', label: 'All Trains', count: counts.ALL },
    { key: 'ON_TIME', label: 'On Time', count: counts.ON_TIME, color: 'text-emerald-700' },
    { key: 'DELAYED', label: 'Delayed', count: counts.DELAYED, color: 'text-amber-700' },
    { key: 'STOPPED', label: 'Stopped', count: counts.STOPPED, color: 'text-red-700' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Active Trains
            <span className="text-xs font-normal text-slate-500">({trains.length} shown)</span>
          </h3>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search train name, #number, station..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Route Selector Filter */}
        {routes && routes.length > 0 && (
          <div>
            <select
              value={selectedRouteFilter || ''}
              onChange={(e) => onRouteChange && onRouteChange(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Railway Lines</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {filterButtons.map((btn) => {
            const isActive = statusFilter === btn.key;
            return (
              <button
                key={btn.key}
                onClick={() => onStatusFilterChange(btn.key)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{btn.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {btn.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Train Cards Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[580px]">
        {trains.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">No trains found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or filter options.
            </p>
          </div>
        ) : (
          trains.map((train) => (
            <TrainTrackingCard
              key={train.id || train.trainNumber}
              train={train}
              isSelected={selectedTrain && (selectedTrain.id === train.id || selectedTrain.trainNumber === train.trainNumber)}
              onSelect={onSelectTrain}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TrainList;
