import React from 'react';
import { Train, ShieldCheck, CreditCard, Calendar, Users, MapPin } from 'lucide-react';

const PaymentSummary = ({ booking }) => {
  if (!booking) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <span className="text-xs text-gray-500 font-mono">
          Ref: <strong className="text-slate-800 font-bold">{booking.bookingReference}</strong>
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
          {booking.trainClass} Class
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-gray-400" />
            Train:
          </span>
          <span className="font-bold text-gray-900">{booking.train?.trainName || 'Express'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            Corridor:
          </span>
          <span className="font-medium text-gray-800">
            {booking.originStation?.name} → {booking.destinationStation?.name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            Travel Date:
          </span>
          <span className="font-medium text-gray-800">{booking.travelDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            Passengers:
          </span>
          <span className="font-medium text-gray-800">{booking.passengers} Adult(s)</span>
        </div>
      </div>

      <div className="bg-slate-50 border border-gray-200 rounded-lg p-3.5 flex items-center justify-between mt-2">
        <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Amount Due:</span>
        <span className="text-xl font-black text-emerald-700">
          Rs. {Number(booking.totalAmount || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PaymentSummary;
