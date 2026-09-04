import React from 'react';
import { MapPin, Circle } from 'lucide-react';

const RouteTimeline = ({ stops = [] }) => {
  if (!stops || stops.length === 0) {
    return <p className="text-sm text-gray-500 italic">No intermediate station data available.</p>;
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
      {stops.map((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;
        const station = stop.station || {};

        return (
          <div key={stop.stopOrder || index} className="relative flex items-start justify-between gap-4">
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white ${
                isFirst || isLast
                  ? 'border-blue-600 text-blue-600'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {isFirst || isLast ? (
                <MapPin className="w-3 h-3 text-blue-600 fill-blue-600" />
              ) : (
                <Circle className="w-2 h-2 fill-gray-300" />
              )}
            </div>

            <div className="flex-1">
              <h5 className={`text-sm ${isFirst || isLast ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                {station.name || `Station ${index + 1}`}
              </h5>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span>Code: {station.code || 'N/A'}</span>
                {stop.distanceFromOrigin !== undefined && (
                  <span>{stop.distanceFromOrigin} km from origin</span>
                )}
              </div>
            </div>

            <div className="text-right text-xs">
              {stop.arrivalTime && (
                <div className="text-gray-600">
                  <span className="text-gray-400 mr-1">Arr:</span>
                  <span className="font-semibold font-mono">{stop.arrivalTime}</span>
                </div>
              )}
              {stop.departureTime && (
                <div className="text-gray-600">
                  <span className="text-gray-400 mr-1">Dep:</span>
                  <span className="font-semibold font-mono">{stop.departureTime}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RouteTimeline;
