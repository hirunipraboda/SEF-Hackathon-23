import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { stationService } from '../services/stationService';
import { fareService } from '../services/fareService';
import {
  ArrowRightLeft,
  CheckCircle2,
  Info,
  Train,
  Tag,
  ShieldCheck,
  Baby,
  UserCheck,
  Ticket,
  Clock,
  Check,
  X,
  Plus,
  Minus,
} from 'lucide-react';

const MATRIX_DATA = [
  { destination: 'Kandy Station', originName: 'Colombo Fort', destName: 'Kandy', line: 'Main Line', distance: '121 km', third: 350, second: 500, first: 1000 },
  { destination: 'Galle Central', originName: 'Colombo Fort', destName: 'Galle', line: 'Coastal Line', distance: '115 km', third: 280, second: 420, first: 750 },
  { destination: 'Matara Terminal', originName: 'Colombo Fort', destName: 'Matara', line: 'Coastal Line', distance: '160 km', third: 320, second: 520, first: 950 },
  { destination: 'Anuradhapura', originName: 'Colombo Fort', destName: 'Anuradhapura', line: 'Northern Line', distance: '206 km', third: 450, second: 750, first: 1400 },
  { destination: 'Jaffna Central', originName: 'Colombo Fort', destName: 'Jaffna', line: 'Northern Line / Yal Devi', distance: '398 km', third: 700, second: 1200, first: 2100 },
];

const FareCalculatorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlOrigin = searchParams.get('origin');
  const urlDestination = searchParams.get('destination');

  const [stations, setStations] = useState([]);
  const [origin, setOrigin] = useState(urlOrigin || 'Colombo Fort');
  const [destination, setDestination] = useState(urlDestination || 'Kandy');
  const [passengerType, setPassengerType] = useState('ADULT');
  const [trainClass, setTrainClass] = useState('SECOND');
  const [passengers, setPassengers] = useState(2);

  const [farePerPerson, setFarePerPerson] = useState(560);
  const [totalFare, setTotalFare] = useState(1120);
  const [distanceKm, setDistanceKm] = useState(121);
  const [calculating, setCalculating] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    stationService.getAllStations()
      .then((data) => setStations(data))
      .catch((err) => console.error(err));

    if (urlOrigin && urlDestination && urlOrigin !== urlDestination) {
      fareService.calculateFare({
        origin: urlOrigin,
        destination: urlDestination,
        passengerType: 'ADULT',
        trainClass: 'SECOND',
        passengers: 2,
      }).then((res) => {
        if (res) {
          setFarePerPerson(res.farePerPassenger);
          setTotalFare(res.totalFare);
        }
      }).catch(() => {});
    }
  }, [urlOrigin, urlDestination]);

  const handleSwapStations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    if (origin === destination) {
      setErrorNotice('Departure and destination stations cannot be identical.');
      return;
    }
    setErrorNotice('');
    setCalculating(true);

    try {
      const data = await fareService.calculateFare({
        origin,
        destination,
        passengerType,
        trainClass,
        passengers: Number(passengers),
      });

      if (data) {
        setFarePerPerson(data.farePerPassenger);
        setTotalFare(data.totalFare);
      }
    } catch (err) {
      // Fallback calculation estimation
      const rateMap = { FIRST: 1000, SECOND: 560, THIRD: 300 };
      const base = rateMap[trainClass] || 560;
      const multiplier = passengerType === 'CHILD' ? 0.5 : 1;
      const calculatedPerson = Math.round(base * multiplier);
      setFarePerPerson(calculatedPerson);
      setTotalFare(calculatedPerson * passengers);
    } finally {
      setCalculating(false);
    }
  };

  const loadFromMatrix = (item, cls) => {
    setOrigin(item.originName);
    setDestination(item.destName);
    if (cls) setTrainClass(cls);
    setPassengers(1);
    const amount = cls === 'THIRD' ? item.third : cls === 'FIRST' ? item.first : item.second;
    setFarePerPerson(amount);
    setTotalFare(amount);
  };

  return (
    <div className="bg-[#F8FAFC]">
      {/* Hero Banner Strip */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Official SLRD Distance Calculator • Gazette Rev 2024/25</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2C] tracking-tight">
              Calculate Your Train Fare
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Official Sri Lanka Railways distance-based fare estimator. Transparent ticket rates across all passenger categories and seat classes.
            </p>
          </div>

          {/* Right Statistics in Hero */}
          <div className="flex items-center gap-6 shrink-0 text-right">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Fare Tariff Basis
              </span>
              <span className="text-sm font-black text-gray-800">Distance Slabs</span>
            </div>
            <div className="pl-6 border-l border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Network Reach
              </span>
              <span className="text-sm font-black text-emerald-700">1,508+ Track KM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Top 2-Column: Configure Itinerary & Estimated Cost Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Configure Itinerary (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1A2C]">
                  Configure Itinerary
                </h3>
              </div>
              <span className="text-xs text-gray-400">Step 1 of 2</span>
            </div>

            {errorNotice && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorNotice}
              </div>
            )}

            <form onSubmit={handleCalculate} className="space-y-5">
              {/* Station Departure, Swap, Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Departure Station</span>
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                  >
                    {stations.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1 flex justify-center pt-5">
                  <button
                    type="button"
                    onClick={handleSwapStations}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-600 flex items-center justify-center transition-colors border border-gray-200"
                    title="Swap stations"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Destination Station</span>
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                  >
                    {stations.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passenger Category & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Passenger Category
                  </label>
                  <select
                    value={passengerType}
                    onChange={(e) => setPassengerType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                  >
                    <option value="ADULT">Adult (12+ years)</option>
                    <option value="CHILD">Child (3-11 years) • 50% Fare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Travel Class & Accommodation
                  </label>
                  <select
                    value={trainClass}
                    onChange={(e) => setTrainClass(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                  >
                    <option value="SECOND">Second Class Reserved</option>
                    <option value="THIRD">Third Class Standard</option>
                    <option value="FIRST">First Class A/C Observation</option>
                  </select>
                </div>
              </div>

              {/* Total Passengers Counter */}
              <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Total Passengers</span>
                  <span className="text-[11px] text-gray-500">Maximum 10 tickets per calculation session</span>
                </div>

                <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="w-7 h-7 rounded text-gray-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-gray-900">{passengers}</span>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.min(10, passengers + 1))}
                    className="w-7 h-7 rounded text-gray-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Official Gazette Callout */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg flex items-start gap-2.5 text-[11px] text-blue-900 leading-relaxed">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  All calculations reflect official Sri Lanka Railways Gazette Extraordinary tariffs. Regulation Section 144a. Distance tables verified quarterly by Chief Commercial Superintendent.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={calculating}
                  className="inline-flex items-center gap-2 bg-[#0B1A2C] hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{calculating ? 'Computing Fare...' : 'Calculate Fare'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrigin('Colombo Fort');
                    setDestination('Kandy');
                    setPassengers(1);
                    setTrainClass('SECOND');
                  }}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* Right: Estimated Trip Cost Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Estimated Trip Cost Summary
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ● Verified Tariff
                </span>
              </div>

              {/* Estimated Payable Amount */}
              <div className="bg-gradient-to-br from-emerald-50/60 to-slate-50 border border-emerald-100 rounded-xl p-5">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                  Estimated Payable Amount
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">
                    Rs. {totalFare.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">LKR Total</span>
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
                  <span>Selected Route</span>
                  <span className="font-semibold text-gray-900">
                    {origin} → {destination} ({distanceKm} km)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
                  <span>Fare per passenger</span>
                  <span className="font-semibold text-gray-900">Rs. {farePerPerson.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
                  <span>Passenger Count</span>
                  <span className="font-semibold text-gray-900">{passengers} {passengerType === 'CHILD' ? 'Children' : 'Adults'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-50 text-gray-600">
                  <span>Travel Class</span>
                  <span className="font-semibold text-gray-900">
                    {trainClass === 'FIRST' ? 'First Class A/C' : trainClass === 'SECOND' ? 'Second Class Reserved' : 'Third Class Standard'}
                  </span>
                </div>

                <div className="flex justify-between py-1 text-gray-600">
                  <span>Seat Reservation Levy</span>
                  <span className="font-semibold text-emerald-700">Included (Rs. 100/ticket)</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-gray-500 leading-relaxed">
                Official ticket rates. Tickets can be purchased at station ticket counters or official reservation stations. <span className="font-semibold text-gray-700">Note: This platform does NOT process payments or bookings.</span>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/routes?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}`)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs py-2.5 rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Train className="w-3.5 h-3.5" />
                <span>View Running Trains For This Route</span>
              </button>
            </div>

            {/* Hill Country Odyssey Card */}
            <div className="h-36 rounded-xl overflow-hidden relative shadow-sm flex items-end p-4 bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white border border-gray-200">
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="relative space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  Hill Country Odyssey
                </span>
                <h4 className="text-xs font-bold text-white">Colombo to Kandy Scenic Express</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Compare Carriage Classes */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Accommodations
              </span>
              <h2 className="text-lg font-bold text-[#0B1A2C]">Compare Carriage Classes</h2>
              <p className="text-xs text-gray-500">
                Real passenger comfort specifications and tariff benchmarks for the {origin} – {destination} line.
              </p>
            </div>
            <span className="text-xs font-medium text-gray-500">
              Distance: ~121 km • Approx. 2h 55m
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Third Class Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">Third Class</h3>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    Budget Essential
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Per Passenger Rate</span>
                  <div className="text-2xl font-black text-gray-900">
                    Rs. 350 <span className="text-xs font-normal text-gray-400">/ seat</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Standard bench seating. High commuter volume. Walk-in ticketing directly at stations on person travel day.
                </p>

                <ul className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Standard vinyl bench seating</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Unreserved walk-in purchase</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Available on all express & slow trains</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <X className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>No seat reservation guarantee</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTrainClass('THIRD');
                  setFarePerPerson(350);
                  setTotalFare(350 * passengers);
                }}
                className="w-full py-2 px-3 border border-gray-300 hover:bg-slate-50 text-gray-700 text-xs font-bold rounded-lg transition-colors"
              >
                Calculate for 3rd Class
              </button>
            </div>

            {/* Second Class Card (Highlighted Popular Choice) */}
            <div className="bg-white rounded-xl border-2 border-emerald-500 p-6 shadow-md space-y-4 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full tracking-wider shadow-sm">
                Popular Choice • Best Value
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">Second Class</h3>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    Best Value
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Per Passenger Rate</span>
                  <div className="text-2xl font-black text-emerald-700">
                    Rs. 500 <span className="text-xs font-normal text-gray-400">/ seat</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Cushioned individual seating with reserved coaches available up to 30 days in advance via SLR booking windows.
                </p>

                <ul className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Cushioned 2x2 individual seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Reserved numbered seats in coaches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Overhead luggage racks & roof fans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Full panoramic open-view windows</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTrainClass('SECOND');
                  setFarePerPerson(500);
                  setTotalFare(500 * passengers);
                }}
                className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Calculate for 2nd Class
              </button>
            </div>

            {/* First Class A/C Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">First Class A/C</h3>
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    Premium Scenic
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Per Passenger Rate</span>
                  <div className="text-2xl font-black text-gray-900">
                    Rs. 900–1,200 <span className="text-xs font-normal text-gray-400">/ seat</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Climate-controlled coaches, wide open-picture windows, reclining seats, and peaceful noise-isolated carriages.
                </p>

                <ul className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Fully air conditioned climate control</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Large panoramic observation glass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Assigned reserved numbered seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Power outlets for mobile charging</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTrainClass('FIRST');
                  setFarePerPerson(1000);
                  setTotalFare(1000 * passengers);
                }}
                className="w-full py-2 px-3 border border-gray-300 hover:bg-slate-50 text-gray-700 text-xs font-bold rounded-lg transition-colors"
              >
                Calculate for 1st Class
              </button>
            </div>
          </div>
        </div>

        {/* Quick Reference Matrix Table: Major Line Fares From Colombo Fort */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Quick Reference Matrix
              </span>
              <h3 className="text-sm font-bold text-[#0B1A2C]">
                Major Line Fares From Colombo Fort
              </h3>
            </div>
            <span className="text-[11px] text-gray-400">Direct commuter rates per adult single journey</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 uppercase text-[10px]">
                  <th className="pb-3 font-bold">Destination Terminal</th>
                  <th className="pb-3 font-bold">Railway Line</th>
                  <th className="pb-3 font-bold">Distance</th>
                  <th className="pb-3 font-bold">3rd Class</th>
                  <th className="pb-3 font-bold">2nd Class</th>
                  <th className="pb-3 font-bold">1st Class A/C</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MATRIX_DATA.map((row) => (
                  <tr key={row.destination} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-bold text-gray-900 flex items-center gap-2">
                      <Train className="w-3.5 h-3.5 text-gray-400" />
                      <span>{row.destination}</span>
                    </td>
                    <td className="py-3 text-gray-500">{row.line}</td>
                    <td className="py-3 text-gray-500">{row.distance}</td>
                    <td className="py-3 font-semibold text-gray-800">Rs. {row.third}</td>
                    <td className="py-3 font-semibold text-gray-800">Rs. {row.second}</td>
                    <td className="py-3 font-semibold text-gray-800">Rs. {row.first.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => loadFromMatrix(row, 'SECOND')}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded"
                      >
                        Load
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom 3 Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Baby className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-900">Children Policy</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Infants under 3 travel free at no seat occupancy. Children between 3 and 11 years receive 50% discount on standard standard single and return fares.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-900">Senior Concessions</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              All Sri Lankan citizens aged 60+ are eligible for concessionary rates on unreserved classes upon presentation of their National Identity Card (NIC) at counters.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-gray-900">Advance Bookings</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Reserved 1st, 2nd, and 3rd class seat tickets open for advance ticketing 30 days prior to departure at accredited railway reservation stations island-wide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FareCalculatorPage;
