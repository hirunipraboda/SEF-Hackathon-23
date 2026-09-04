import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { scheduleService } from '../services/scheduleService';
import { stationService } from '../services/stationService';
import { trainService } from '../services/trainService';
import { fareService } from '../services/fareService';
import { bookingService } from '../services/bookingService';
import BookingSummary from '../components/booking/BookingSummary';
import TrainStatusBadge from '../components/TrainStatusBadge';
import {
  Train,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Ticket,
} from 'lucide-react';

const BookingPage = () => {
  const { scheduleId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramOrigin = searchParams.get('origin');
  const paramDest = searchParams.get('destination');
  const paramTrainNumber = searchParams.get('trainNumber');

  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [allSchedules, setAllSchedules] = useState([]);

  // Booking Form State
  const [travelDate, setTravelDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [trainClass, setTrainClass] = useState('SECOND');
  const [passengers, setPassengers] = useState(1);
  const [primaryName, setPrimaryName] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');

  // Fare Preview State
  const [fareLoading, setFareLoading] = useState(false);
  const [calculatedFare, setCalculatedFare] = useState({
    farePerPassenger: 500,
    totalFare: 500,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  // 1. Fetch Schedule Data
  useEffect(() => {
    const loadData = async () => {
      setLoadingSchedule(true);
      setErrorNotice('');
      try {
        const schedules = await scheduleService.getAllSchedules();
        setAllSchedules(schedules);

        let matched = null;
        if (scheduleId) {
          matched = schedules.find((s) => s._id === scheduleId);
        } else if (paramTrainNumber) {
          matched = schedules.find(
            (s) => s.trainId?.trainNumber === paramTrainNumber || s.trainId?._id === paramTrainNumber
          );
        }

        if (!matched && schedules.length > 0) {
          matched = schedules[0];
        }

        setSelectedSchedule(matched);
      } catch (err) {
        console.error('Failed to load schedules', err);
        setErrorNotice('Could not load train schedule details.');
      } finally {
        setLoadingSchedule(false);
      }
    };
    loadData();
  }, [scheduleId, paramTrainNumber]);

  // 2. Recalculate Fare Preview
  useEffect(() => {
    if (!selectedSchedule) return;

    const originName =
      selectedSchedule.routeId?.originStation?.name || paramOrigin || 'Colombo Fort';
    const destName =
      selectedSchedule.routeId?.destinationStation?.name || paramDest || 'Kandy';

    setFareLoading(true);
    fareService
      .calculateFare({
        origin: originName,
        destination: destName,
        trainClass,
        passengers,
      })
      .then((data) => {
        setCalculatedFare({
          farePerPassenger: data.farePerPassenger,
          totalFare: data.totalFare,
        });
      })
      .catch((err) => {
        console.warn('Fare preview fallback', err);
        const fallbackRate = trainClass === 'FIRST' ? 1200 : trainClass === 'SECOND' ? 500 : 250;
        setCalculatedFare({
          farePerPassenger: fallbackRate,
          totalFare: fallbackRate * passengers,
        });
      })
      .finally(() => setFareLoading(false));
  }, [selectedSchedule, trainClass, passengers, paramOrigin, paramDest]);

  const train = selectedSchedule?.trainId || {};
  const route = selectedSchedule?.routeId || {};
  const originStation = route.originStation?.name || paramOrigin || 'Colombo Fort';
  const destinationStation = route.destinationStation?.name || paramDest || 'Kandy';
  const isCancelled =
    selectedSchedule?.status === 'CANCELLED' || train?.status === 'CANCELLED';

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSchedule) return;
    if (isCancelled) {
      setErrorNotice('Booking unavailable. This train has been cancelled.');
      return;
    }

    setSubmitting(true);
    setErrorNotice('');

    try {
      const payload = {
        scheduleId: selectedSchedule._id,
        originStationId: route.originStation?._id || route.originStation,
        destinationStationId: route.destinationStation?._id || route.destinationStation,
        travelDate,
        trainClass,
        passengers,
        passengerDetails: [
          {
            name: primaryName.trim(),
            email: primaryEmail.trim(),
            phone: primaryPhone.trim(),
          },
        ],
      };

      const booking = await bookingService.createBooking(payload);
      // Navigate to Payment Portal
      navigate(`/payment/${booking._id}`);
    } catch (err) {
      setErrorNotice(err.message || 'Unable to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSchedule) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#0B1A2C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-gray-500">Preparing Railway Booking Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/routes" className="hover:text-black flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Routes & Schedules</span>
          </Link>
          <span>/</span>
          <span className="font-bold text-gray-800">Book Train</span>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Official Passenger Ticketing
                </span>
                <TrainStatusBadge status={selectedSchedule?.status || train?.status || 'ON_TIME'} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                Book Your Train Journey
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Reserve your tickets on Sri Lanka Railways intercity and express network with instant confirmation.
              </p>
            </div>

            {/* Schedule Switcher Dropdown if multiple exist */}
            {allSchedules.length > 1 && (
              <div className="shrink-0">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  Selected Train Schedule:
                </label>
                <select
                  value={selectedSchedule?._id}
                  onChange={(e) => {
                    const found = allSchedules.find((s) => s._id === e.target.value);
                    if (found) setSelectedSchedule(found);
                  }}
                  className="text-xs font-semibold border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allSchedules.map((s) => (
                    <option key={s._id} value={s._id}>
                      #{s.trainId?.trainNumber} {s.trainId?.trainName} ({s.departureTime} - {s.routeId?.originStation?.name} → {s.routeId?.destinationStation?.name})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid: Form & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Booking Form (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            {isCancelled && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <div className="text-xs">
                  <strong className="font-bold block">Booking Unavailable</strong>
                  This train schedule has been cancelled due to railway operational notices.
                </div>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Step 1: Travel Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  1. Choose Travel Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full sm:w-72 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-gray-800"
                  />
                </div>
              </div>

              {/* Step 2: Class Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  2. Select Travel Class
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'FIRST', name: 'First Class', desc: 'Air-conditioned & Reserved' },
                    { id: 'SECOND', name: 'Second Class', desc: 'Comfortable Padded Seating' },
                    { id: 'THIRD', name: 'Third Class', desc: 'Standard Civic Transit' },
                  ].map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setTrainClass(cls.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        trainClass === cls.id
                          ? 'border-[#0B1A2C] bg-slate-50 ring-2 ring-[#0B1A2C]/10 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="block font-bold text-sm text-gray-900">{cls.name}</span>
                      <span className="block text-xs text-gray-500 mt-0.5">{cls.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Passenger Count */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  3. Number of Passengers
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-gray-300 rounded-lg p-1 bg-white">
                    <button
                      type="button"
                      disabled={passengers <= 1}
                      onClick={() => setPassengers((prev) => Math.max(1, prev - 1))}
                      className="w-9 h-9 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold text-gray-800 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-base text-gray-900">
                      {passengers}
                    </span>
                    <button
                      type="button"
                      disabled={passengers >= 10}
                      onClick={() => setPassengers((prev) => Math.min(10, prev + 1))}
                      className="w-9 h-9 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold text-gray-800 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    Max 10 tickets per online booking session.
                  </span>
                </div>
              </div>

              {/* Step 4: Primary Passenger Details */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                  4. Primary Passenger Contact Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Perera"
                      value={primaryName}
                      onChange={(e) => setPrimaryName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="passenger@example.com"
                      value={primaryEmail}
                      onChange={(e) => setPrimaryEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0771234567"
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {errorNotice && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorNotice}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500 block">Total Payable:</span>
                  <span className="text-2xl font-black text-gray-900">
                    Rs. {Number(calculatedFare.totalFare).toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || isCancelled || !primaryName.trim()}
                  className="bg-[#0B1A2C] hover:bg-slate-900 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? 'Creating Booking...' : 'Proceed to Payment'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Summary Card (Right 1 col) */}
          <div className="space-y-4">
            <BookingSummary
              train={train}
              origin={originStation}
              destination={destinationStation}
              travelDate={travelDate}
              departureTime={selectedSchedule?.departureTime}
              arrivalTime={selectedSchedule?.arrivalTime}
              trainClass={trainClass}
              passengers={passengers}
              farePerPassenger={calculatedFare.farePerPassenger}
              totalAmount={calculatedFare.totalFare}
            />

            {/* Quick Policies Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 text-xs text-gray-500 space-y-2">
              <span className="font-bold text-gray-700 block">Booking Conditions:</span>
              <ul className="list-disc list-inside space-y-1">
                <li>Seats held in pending state for 15 minutes before checkout.</li>
                <li>Valid government ID or passport required when boarding.</li>
                <li>Tickets can be viewed and managed from My Bookings.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
