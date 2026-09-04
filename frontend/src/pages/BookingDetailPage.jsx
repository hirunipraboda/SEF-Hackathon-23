import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import BookingStatusBadge from '../components/booking/BookingStatusBadge';
import {
  Train,
  Calendar,
  Clock,
  MapPin,
  Users,
  Printer,
  CreditCard,
  XCircle,
  ArrowLeft,
  ShieldCheck,
  Ticket,
  AlertCircle,
} from 'lucide-react';

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const fetchBooking = async () => {
    setLoading(true);
    setErrorNotice('');
    try {
      const data = await bookingService.getBooking(bookingId);
      setBooking(data);
    } catch (err) {
      console.error('Error loading booking detail', err);
      setErrorNotice(err.message || 'Could not load booking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this train booking? Note: Refund processing is not implemented in the current MVP.'
      )
    ) {
      return;
    }

    setCancelling(true);
    setErrorNotice('');
    setSuccessNotice('');

    try {
      const result = await bookingService.cancelBooking(booking._id);
      setBooking(result.booking);
      setSuccessNotice(result.message);
    } catch (err) {
      setErrorNotice(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#0B1A2C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-gray-500">Loading Ticket Record...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Booking Record Not Found</h2>
        <Link to="/my-bookings" className="inline-block bg-[#0B1A2C] text-white text-xs font-bold px-4 py-2 rounded-lg">
          Return to My Bookings
        </Link>
      </div>
    );
  }

  const train = booking.train || {};
  const origin = booking.originStation?.name || 'Origin';
  const destination = booking.destinationStation?.name || 'Destination';
  const isPending = booking.bookingStatus === 'PENDING_PAYMENT';
  const isCancelled = booking.bookingStatus === 'CANCELLED';

  return (
    <div className="bg-[#F8FAFC] py-8 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/my-bookings" className="hover:text-black flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>My Bookings</span>
          </Link>
          <span>/</span>
          <span className="font-bold text-gray-800">{booking.bookingReference}</span>
        </div>

        {/* Status Notification Alerts */}
        {successNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}
        {errorNotice && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Master Ticket Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden printable-ticket">
          {/* Top Banner */}
          <div className="bg-[#0B1A2C] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-300 block mb-1">
                Official Rail Reservation
              </span>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                  {booking.bookingReference}
                </h1>
                <BookingStatusBadge status={booking.bookingStatus} size="lg" />
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">Total Fare Payable</span>
              <span className="text-2xl font-black text-emerald-400">
                Rs. {Number(booking.totalAmount || 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-300 block">
                {booking.paymentStatus === 'PAID' ? '✓ Paid in Full' : '⚠️ Pending Settlement'}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Origin -> Destination Route Display */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Origin Station
                </span>
                <span className="text-xl font-black text-gray-900">{origin}</span>
                <span className="text-xs text-gray-500 block font-mono">{booking.departureTime || '06:30 AM'}</span>
              </div>

              <div className="text-center px-4">
                <span className="text-xs font-bold text-slate-400 block mb-1">Direct Express Route</span>
                <div className="w-24 sm:w-36 h-0.5 bg-slate-200 relative flex items-center justify-center mx-auto">
                  <Train className="w-4 h-4 text-[#0B1A2C] bg-white px-0.5" />
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Destination Station
                </span>
                <span className="text-xl font-black text-gray-900">{destination}</span>
                <span className="text-xs text-gray-500 block font-mono">{booking.arrivalTime || '09:45 AM'}</span>
              </div>
            </div>

            {/* Train Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Assigned Train</span>
                <span className="font-bold text-gray-900">{train.trainName || 'Intercity Express'}</span>
                <span className="text-gray-500 block font-mono">#{train.trainNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Scheduled Date</span>
                <span className="font-bold text-gray-900">{booking.travelDate}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Carriage Class</span>
                <span className="font-bold text-gray-900">{booking.trainClass} Class</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Passenger Quota</span>
                <span className="font-bold text-gray-900">{booking.passengers} Ticket(s)</span>
              </div>
            </div>

            {/* Passenger Manifest */}
            <div className="bg-slate-50 rounded-xl p-4 border border-gray-100 text-xs space-y-2">
              <span className="text-[11px] uppercase font-bold text-gray-400 block">
                Passenger Manifest
              </span>
              {booking.passengerDetails && booking.passengerDetails.length > 0 ? (
                booking.passengerDetails.map((p, idx) => (
                  <div key={idx} className="flex flex-wrap items-center justify-between gap-2 font-medium text-gray-800">
                    <span>
                      {idx + 1}. {p.name}
                    </span>
                    <span className="text-gray-500">{p.phone || 'N/A'}</span>
                    <span className="text-gray-500">{p.email || 'N/A'}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500">{booking.passengers} Passenger(s) booked</span>
              )}
            </div>

            {/* Payment & Audit Info */}
            <div className="border-t border-dashed border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Payment Audit Status</span>
                <span className="font-bold text-gray-800">{booking.paymentStatus}</span>
                {booking.paymentId?.paymentReference && (
                  <span className="font-mono text-gray-500 block text-[11px]">
                    Ref: {booking.paymentId.paymentReference}
                  </span>
                )}
              </div>
              <div className="text-left sm:text-right">
                <span className="text-gray-400 block text-[11px]">Reservation Timestamp</span>
                <span className="font-medium text-gray-600">
                  {new Date(booking.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white hover:bg-slate-100 border border-gray-300 py-2.5 px-4 rounded-xl shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print E-Ticket</span>
          </button>

          <div className="flex items-center gap-2">
            {!isCancelled && (
              <button
                disabled={cancelling}
                onClick={handleCancelBooking}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 py-2.5 px-3.5 rounded-xl transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>{cancelling ? 'Cancelling...' : 'Cancel Booking'}</span>
              </button>
            )}

            {isPending && (
              <Link
                to={`/payment/${booking._id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 py-2.5 px-4 rounded-xl shadow-sm transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>Complete Payment (Rs. {booking.totalAmount})</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
