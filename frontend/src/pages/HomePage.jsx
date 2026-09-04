import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { stationService } from '../services/stationService';
import heroBridgeImg from '../assets/hero-nine-arch-bridge.jpg';
import {
  Search,
  Clock,
  MapPin,
  Calendar,
  Compass,
  ArrowRightLeft,
  ArrowRight,
  Train,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Radio,
  Ticket,
} from 'lucide-react';
import { useLiveTracking } from '../hooks/useLiveTracking';
import TrackingMap from '../components/tracking/TrackingMap';

const QUICK_ROUTES = [
  { from: 'Colombo Fort', to: 'Kandy', line: 'Main Line', time: '2h 55m' },
  { from: 'Colombo Fort', to: 'Galle', line: 'Coastal Line', time: '2h 15m' },
  { from: 'Colombo Fort', to: 'Jaffna', line: 'Northern Line (Yal Devi)', time: '6h 30m' },
  { from: 'Colombo Fort', to: 'Matara', line: 'Coastal Line', time: '2h 45m' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState('Colombo Fort');
  const [to, setTo] = useState('Kandy');
  const [date, setDate] = useState('2026-09-04');
  const [trainType, setTrainType] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  const {
    trains: liveTrains,
    routes: trackingRoutes,
    stations: trackingStations,
    selectedTrain,
    selectTrain,
    clearSelection,
    refresh: refreshTracking,
    lastUpdated: trackingLastUpdated,
    loading: trackingLoading,
  } = useLiveTracking({ pollingInterval: 8000 });

  useEffect(() => {
    stationService.getAllStations()
      .then((data) => setStations(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!from || !to) {
      setErrorNotice('Please select both departure and destination stations.');
      return;
    }
    if (from === to) {
      setErrorNotice('Departure and destination stations cannot be the same.');
      return;
    }
    setErrorNotice('');
    const query = new URLSearchParams({
      from,
      to,
      date,
      ...(trainType ? { trainType } : {}),
    }).toString();
    navigate(`/routes?${query}`);
  };

  const setQuickRoute = (route) => {
    setFrom(route.from);
    setTo(route.to);
    setErrorNotice('');
  };

  return (
    <div className="bg-[#F8FAFC] space-y-10 pb-16">
      {/* Full Background Hero Section with Nine Arch Bridge */}
      <div
        className="text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBridgeImg})`,
        }}
      >
        {/* Dark Navy Atmospheric Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A2C]/95 via-[#0B1A2C]/85 to-[#0B1A2C]/80 backdrop-blur-[0.5px]"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left Column: Heading & Text */}
          <div className="space-y-3.5 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 tracking-wider uppercase bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Official Sri Lanka Railways Transit System</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
              TrainTrack Sri Lanka
            </h1>

            <p className="text-base sm:text-lg text-emerald-300 font-semibold italic drop-shadow-sm">
              "Plan. Travel. Improve."
            </p>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              Real-time railway operations, timetable lookups, official gazetted fare estimates, and transparent incident reporting for Sri Lankan railway commuters.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all"
              >
                <Ticket className="w-4 h-4 text-slate-950" />
                <span>Book Train Tickets</span>
              </Link>

              <Link
                to="/live-tracking"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all"
              >
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Live Map</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Metric Badges & Location Tag */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[#0B1A2C]/80 backdrop-blur-md border border-slate-600/70 rounded-xl px-5 py-3 shadow-lg min-w-[150px] text-center lg:text-left">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
                  Active Network
                </span>
                <span className="text-lg font-black text-white">1,508+ KM</span>
              </div>

              <div className="bg-[#0B1A2C]/80 backdrop-blur-md border border-slate-600/70 rounded-xl px-5 py-3 shadow-lg min-w-[150px] text-center lg:text-left">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
                  Daily Services
                </span>
                <span className="text-lg font-black text-emerald-400">300+ Trains</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Your Journey Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Passenger Timetable & Route Planner</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0B1A2C] tracking-tight">
              Plan Your Journey
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select origin, destination, and departure date to find matching express, intercity, and slow trains.
            </p>
          </div>

          {/* Quick Route Shortcuts */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-1">Popular:</span>
            {QUICK_ROUTES.map((qr) => (
              <button
                key={`${qr.from}-${qr.to}`}
                type="button"
                onClick={() => setQuickRoute(qr)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  from === qr.from && to === qr.to
                    ? 'bg-[#0B1A2C] text-white border-[#0B1A2C] font-semibold'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-slate-50'
                }`}
              >
                {qr.from.replace('Colombo ', '')} → {qr.to}
              </button>
            ))}
          </div>
        </div>

        {/* Main Plan Your Journey Interactive Form Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          {errorNotice && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
              {/* Departure Station */}
              <div className="md:col-span-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>From (Departure Station)</span>
                </label>
                <select
                  value={from}
                  onChange={(e) => { setFrom(e.target.value); setErrorNotice(''); }}
                  className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                >
                  {stations.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name} ({s.code}) — {s.province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Station Swap Button */}
              <div className="md:col-span-1 flex justify-center pt-5">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-700 flex items-center justify-center transition-colors border border-gray-300 shadow-sm"
                  title="Swap departure and destination"
                  aria-label="Swap departure and destination"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Destination Station */}
              <div className="md:col-span-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <span>To (Destination Station)</span>
                </label>
                <select
                  value={to}
                  onChange={(e) => { setTo(e.target.value); setErrorNotice(''); }}
                  className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                >
                  {stations.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name} ({s.code}) — {s.province}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Date & Filter Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Travel Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-gray-400" />
                  <span>Train Type / Service</span>
                </label>
                <select
                  value={trainType}
                  onChange={(e) => setTrainType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                >
                  <option value="">All Services (Express, Intercity, Slow)</option>
                  <option value="Express">Express Trains</option>
                  <option value="Intercity">Intercity AC Services</option>
                  <option value="Normal">Normal Slow Trains</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0B1A2C] hover:bg-slate-800 text-white font-bold text-xs py-3 px-6 rounded-lg shadow-sm transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Train Schedules</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Route Highlights Cards */}
          <div className="pt-4 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
              Popular Railway Corridors
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {QUICK_ROUTES.map((route) => (
                <div
                  key={route.to}
                  onClick={() => setQuickRoute(route)}
                  className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                      <span>{route.line}</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-gray-400" /> {route.time}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-gray-900">
                      {route.from} → {route.to}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                    <span>Select route</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Train Tracking Map Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Live Railway Tracking Map</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0B1A2C] tracking-tight">
                Track Trains in Real-Time
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Interactive Sri Lanka railway network with simulated live train positions and track corridors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/live-tracking"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1A2C] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
              >
                <span>Full Screen Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Embedded Map */}
          <TrackingMap
            trains={liveTrains}
            routes={trackingRoutes}
            stations={trackingStations}
            selectedTrain={selectedTrain}
            onSelectTrain={selectTrain}
            height="440px"
          />

          {/* Train Cards Selector */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-semibold text-gray-700">
                Active Trains ({liveTrains.length}) — Click any train to focus on map:
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">● Simulated Live Positions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {liveTrains.slice(0, 6).map((train) => {
                const isSelected = selectedTrain && (selectedTrain.id === train.id || selectedTrain.trainNumber === train.trainNumber);
                return (
                  <div
                    key={train.id || train.trainNumber}
                    onClick={() => selectTrain(train)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500 shadow-sm'
                        : 'border-gray-200 bg-slate-50 hover:bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-bold text-gray-500 text-[11px]">#{train.trainNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          train.status === 'ON_TIME'
                            ? 'bg-emerald-100 text-emerald-800'
                            : train.status === 'DELAYED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {train.status === 'ON_TIME' ? 'On Time' : train.status === 'DELAYED' ? `Delayed +${train.delayMinutes}m` : 'Stopped'}
                      </span>
                    </div>
                    <div className="font-bold text-gray-900 truncate">{train.trainName}</div>
                    <div className="text-gray-500 text-[11px] mt-0.5 truncate">{train.routeName}</div>
                    <div className="flex items-center justify-between text-[11px] text-gray-600 mt-2 pt-1.5 border-t border-gray-200/60">
                      <span>Near: <strong className="text-gray-800">{train.currentStation}</strong></span>
                      <span className="font-semibold text-emerald-700">{train.speedKmh} km/h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Links Strip (Booking, Fare, Issues & Feedback) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/booking"
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Online Booking</h4>
                <p className="text-[11px] text-gray-500">Reserve train seats with instant confirmation</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-700 shrink-0" />
          </Link>

          <Link
            to="/fare-calculator"
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-emerald-400 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Fare Calculator</h4>
                <p className="text-[11px] text-gray-500">Official 1st, 2nd & 3rd class ticket rates</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0" />
          </Link>

          <Link
            to="/report-issue"
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Report an Issue</h4>
                <p className="text-[11px] text-gray-500">Trackable delay, sanitation & coach reports</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-700 shrink-0" />
          </Link>

          <Link
            to="/feedback"
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-purple-400 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Train className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Passenger Ratings</h4>
                <p className="text-[11px] text-gray-500">Community scores and verified train reviews</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-700 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
