import React from 'react';
import { Train, Calendar, Clock, MapPin, Users, ShieldCheck, Ticket } from 'lucide-react';

const BookingSummary = ({
  train,
  origin,
  destination,
  travelDate,
  departureTime,
  arrivalTime,
  trainClass,
  passengers,
  farePerPassenger,
  totalAmount,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#0B1A2C] text-white flex items-center justify-center font-bold">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Booking Summary</h3>
            <span className="text-xs text-gray-500">Review Journey & Fare Breakdown</span>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
          {trainClass} Class
        </span>
      </div>

      {/* Train & Route Details */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-gray-400" />
            Service:
          </span>
          <span className="font-bold text-gray-900">
            {train?.trainName || 'Intercity Express'} #{train?.trainNumber || ''}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            Route:
          </span>
          <span className="font-semibold text-gray-800">
            {origin} → {destination}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            Date:
          </span>
          <span className="font-semibold text-gray-800">{travelDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            Timings:
          </span>
          <span className="font-semibold text-gray-800">
            {departureTime || '06:30 AM'} → {arrivalTime || '09:45 AM'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            Passengers:
          </span>
          <span className="font-semibold text-gray-800">{passengers} Person(s)</span>
        </div>
      </div>

      {/* Fare Calculation Breakdown */}
      <div className="bg-slate-50 rounded-lg p-4 space-y-2.5 border border-gray-100 text-xs">
        <div className="flex items-center justify-between text-gray-600">
          <span>Fare per passenger:</span>
          <span className="font-semibold text-gray-900">Rs. {Number(farePerPassenger || 0).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal ({passengers} × Rs. {farePerPassenger}):</span>
          <span className="font-semibold text-gray-900">
            Rs. {Number((farePerPassenger || 0) * passengers).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Civic Transit Surcharge:</span>
          <span className="font-semibold text-emerald-700">Rs. 0 (Waived)</span>
        </div>

        <div className="border-t border-gray-200 pt-2 flex items-center justify-between text-sm">
          <span className="font-black text-gray-900">Total Payable:</span>
          <span className="font-black text-[#0B1A2C] text-lg">
            Rs. {Number(totalAmount || (farePerPassenger || 0) * passengers).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Assurance Disclaimer */}
      <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Official Sri Lanka Railways verified tariff schedule.</span>
      </div>
    </div>
  );
};

export default BookingSummary;
