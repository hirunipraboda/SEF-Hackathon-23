import React, { useEffect } from 'react';
import { useLiveTracking } from '../hooks/useLiveTracking';
import TrackingStatus from '../components/tracking/TrackingStatus';
import TrackingMap from '../components/tracking/TrackingMap';
import TrainList from '../components/tracking/TrainList';
import TrainDetails from '../components/tracking/TrainDetails';

const LiveTrackingPage = () => {
  const {
    trains,
    allTrains,
    routes,
    stations,
    selectedTrain,
    selectedTrainDetails,
    loading,
    error,
    lastUpdated,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedRouteFilter,
    setSelectedRouteFilter,
    selectTrain,
    selectStation,
    clearSelection,
    refresh,
  } = useLiveTracking({ pollingInterval: 8000 });

  useEffect(() => {
    document.title = 'Live Train Tracking | TrainTrack Sri Lanka';
  }, []);

  // Compute status counts for the header metrics
  const counts = {
    total: allTrains.length,
    onTime: allTrains.filter((t) => t.status === 'ON_TIME').length,
    delayed: allTrains.filter((t) => t.status === 'DELAYED').length,
    stopped: allTrains.filter((t) => t.status === 'STOPPED').length,
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] pb-12">
      {/* Header Banner */}
      <div className="bg-[#0B1A2C] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Sri Lanka Railways Network
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Live Train Tracking
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-1">
                Track trains across Sri Lanka in real time.
              </p>
            </div>

            {/* Simulated Live Disclaimer Badge */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-xl p-3 max-w-sm text-xs text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-white mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Simulated Live Tracking
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Train positions are simulated along official railway routes with live deterministic updates every 8 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Tracking Status Bar */}
        <TrackingStatus
          lastUpdated={lastUpdated}
          onRefresh={refresh}
          trainsCount={trains.length}
          counts={counts}
          loading={loading}
        />

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 mb-4 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={refresh}
              className="text-xs font-semibold text-red-900 underline hover:text-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* 2-Column Responsive Workspace: Map + Train Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column (7 Cols on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <TrackingMap
              trains={trains}
              routes={routes}
              stations={stations}
              selectedTrain={selectedTrain}
              onSelectTrain={selectTrain}
              onSelectStation={selectStation}
              height="620px"
            />
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>Tip: Click any train or station marker on the map to view instant schedule & status.</span>
              <span className="font-mono">OpenStreetMap • Leaflet</span>
            </div>
          </div>

          {/* Sidebar Column (5 Cols on desktop): Train List or Train Details */}
          <div className="lg:col-span-5 xl:col-span-4 h-[620px] flex flex-col">
            {selectedTrain ? (
              <TrainDetails
                train={selectedTrain}
                details={selectedTrainDetails}
                onClose={clearSelection}
              />
            ) : (
              <TrainList
                trains={trains}
                allTrains={allTrains}
                routes={routes}
                selectedTrain={selectedTrain}
                onSelectTrain={selectTrain}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                selectedRouteFilter={selectedRouteFilter}
                onRouteChange={setSelectedRouteFilter}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPage;
