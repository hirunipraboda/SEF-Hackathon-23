import React from 'react';
import { Link } from 'react-router-dom';
import { Train, Calendar, Clock, MapPin, Users, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const BookingCard = ({ booking }) => {
  const train = booking.train || {};
  const origin = booking.originStation?.name || 'Origin';
  const destination = booking.destinationStation?.name || 'Destination';
  const isPending = booking.bookingStatus === 'PENDING_PAYMENT' || booking.paymentStatus === 'PENDING';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-gray-100 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-gray-200">
            {booking.bookingReference}
          </span>
          <span className="text-xs text-gray-500">
            Booked on {new Date(booking.createdAt).toLocaleDateString()}
          </span>
        </div>
        <BookingStatusBadge status={booking.bookingStatus} />
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-4">
        {/* Train & Route Details */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B1A2C] text-white flex items-center justify-center shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900">{train.trainName || 'Express Service'}</h3>
                <span className="text-xs text-slate-500 font-mono">#{train.trainNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{origin}</span>
                <span className="text-gray-400">→</span>
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{destination}</span>
              </div>
            </div>
          </div>

          {/* Fare Total */}
          <div className="text-left md:text-right">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-semibold">
              Total Amount
            </span>
            <span className="text-xl font-black text-gray-900">
              Rs. {Number(booking.totalAmount || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-500 block font-medium">
              {booking.passengers} {booking.passengers === 1 ? 'Passenger' : 'Passengers'} • {booking.trainClass} Class
            </span>
          </div>
        </div>

        {/* Schedule Timing Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{booking.travelDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Dep: {booking.departureTime || '06:30 AM'}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {booking.passengerDetails?.[0]?.name ? `${booking.passengerDetails[0].name}${booking.passengers > 1 ? ` +${booking.passengers - 1}` : ''}` : `${booking.passengers} Passenger(s)`}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link
            to={`/my-bookings/${booking._id}`}
            className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1 transition-colors"
          >
            <span>View Ticket Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {isPending && (
            <Link
              to={`/payment/${booking._id}`}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Complete Payment</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
