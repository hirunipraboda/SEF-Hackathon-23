import React from 'react';
import { Tag, Users, CheckCircle2 } from 'lucide-react';

const FareCard = ({ result }) => {
  if (!result) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-blue-100 pb-4 mb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-600">Calculated Journey Fare</span>
          <h3 className="text-xl font-bold text-gray-900 mt-0.5">
            {result.origin} → {result.destination}
          </h3>
        </div>
        <div className="p-3 bg-blue-600 text-white rounded-lg shadow-sm">
          <Tag className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 rounded-lg border border-blue-100">
          <span className="text-xs text-gray-500 block">Class</span>
          <span className="font-semibold text-gray-800 text-sm">{result.trainClass} Class</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-blue-100">
          <span className="text-xs text-gray-500 block">Passenger Type</span>
          <span className="font-semibold text-gray-800 text-sm">{result.passengerType}</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-blue-100">
          <span className="text-xs text-gray-500 block">Passengers</span>
          <span className="font-semibold text-gray-800 text-sm flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            {result.passengers}
          </span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-blue-100">
          <span className="text-xs text-gray-500 block">Per Passenger</span>
          <span className="font-semibold text-gray-800 text-sm">LKR {result.farePerPassenger?.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
        <div>
          <span className="text-xs text-gray-500 block uppercase font-medium">Total Estimated Cost</span>
          <span className="text-2xl font-extrabold text-blue-700">
            LKR {result.totalFare?.toLocaleString()}
          </span>
        </div>
        <div className="mt-2 sm:mt-0 text-xs text-gray-500 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Official Sri Lanka Railways rate calculation</span>
        </div>
      </div>
    </div>
  );
};

export default FareCard;
