import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import {
  CheckCircle2,
  Train,
  Calendar,
  Clock,
  MapPin,
  Users,
  Printer,
  ChevronRight,
  Home,
  ShieldCheck,
  Ticket,
} from 'lucide-react';

const PaymentSuccessPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bData, pData] = await Promise.all([
          bookingService.getBooking(bookingId),
          paymentService.getPaymentByBooking(bookingId).catch(() => null),
        ]);
        setBooking(bData);
        setPayment(pData);
      } catch (err) {
        console.error('Error fetching confirmed booking', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-gray-500">Generating Official Ticket Confirmation...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Booking Confirmation Not Found</h2>
        <Link to="/" className="inline-block bg-[#0B1A2C] text-white text-xs font-bold px-4 py-2 rounded-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  const origin = booking.originStation?.name || 'Origin';
  const destination = booking.destinationStation?.name || 'Destination';
  const train = booking.train || {};

  return (
    <div className="bg-[#F8FAFC] py-10 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Success Banner Card */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            Payment Verified & Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Your Train Booking is Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            A verified electronic railway ticket has been issued for your journey across Sri Lanka.
          </p>
        </div>

        {/* Printable Ticket Receipt */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden printable-ticket">
          {/* Ticket Header Strip */}
          <div className="bg-[#0B1A2C] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">Sri Lanka Railways Boarding Pass</span>
            </div>
            <span className="font-mono text-xs font-bold bg-white/10 px-2.5 py-1 rounded border border-white/20">
              {booking.bookingReference}
            </span>
          </div>

          {/* Ticket Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Origin -> Destination Route */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Departure Station
                </span>
                <span className="text-lg sm:text-xl font-black text-gray-900">{origin}</span>
                <span className="text-xs text-gray-500 block font-mono">{booking.departureTime || '06:30 AM'}</span>
              </div>

              <div className="text-center px-4">
                <span className="text-xs font-bold text-slate-400 block mb-1">Direct Express</span>
                <div className="w-20 sm:w-28 h-0.5 bg-slate-200 relative flex items-center justify-center mx-auto">
                  <Train className="w-4 h-4 text-[#0B1A2C] bg-white px-0.5" />
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Arrival Station
                </span>
                <span className="text-lg sm:text-xl font-black text-gray-900">{destination}</span>
                <span className="text-xs text-gray-500 block font-mono">{booking.arrivalTime || '09:45 AM'}</span>
              </div>
            </div>

            {/* Train Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Train Service</span>
                <span className="font-bold text-gray-900">{train.trainName || 'Intercity'}</span>
                <span className="text-gray-500 block font-mono">#{train.trainNumber || ''}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Travel Date</span>
                <span className="font-bold text-gray-900">{booking.travelDate}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Carriage Class</span>
                <span className="font-bold text-gray-900">{booking.trainClass} Class</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Passenger Count</span>
                <span className="font-bold text-gray-900">{booking.passengers} Passenger(s)</span>
              </div>
            </div>

            {/* Passenger Contacts */}
            {booking.passengerDetails?.[0] && (
              <div className="bg-slate-50 rounded-xl p-4 border border-gray-100 text-xs">
                <span className="text-[11px] uppercase font-bold text-gray-400 block mb-1">
                  Primary Passenger
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2 font-medium text-gray-800">
                  <span>{booking.passengerDetails[0].name}</span>
                  <span className="text-gray-500">{booking.passengerDetails[0].phone}</span>
                  <span className="text-gray-500">{booking.passengerDetails[0].email}</span>
                </div>
              </div>
            )}

            {/* Payment Audit Summary */}
            <div className="border-t border-dashed border-gray-200 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Payment Reference</span>
                <span className="font-mono font-bold text-slate-800">
                  {payment?.paymentReference || booking.paymentId?.paymentReference || 'PAY-VERIFIED-AUTH'}
                </span>
                <span className="text-[10px] text-emerald-600 block font-semibold mt-0.5">
                  ✓ Paid via Demo Sandbox Card (•••• {payment?.cardLastFour || '4242'})
                </span>
              </div>

              <div className="text-right">
                <span className="text-gray-400 block text-[11px]">Total Paid Amount</span>
                <span className="text-xl font-black text-emerald-700">
                  Rs. {Number(booking.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black py-2 px-3 rounded-lg border border-gray-200 bg-white"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-gray-300 py-2 px-3.5 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Ticket</span>
            </button>

            <Link
              to={`/my-bookings/${booking._id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0B1A2C] hover:bg-slate-900 py-2 px-4 rounded-lg shadow-sm transition-colors"
            >
              <span>View in My Bookings</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
