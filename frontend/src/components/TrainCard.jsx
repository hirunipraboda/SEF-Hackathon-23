import React from 'react';
import { Link } from 'react-router-dom';
import { Train, Clock, ArrowRight, MapPin } from 'lucide-react';
import TrainStatusBadge from './TrainStatusBadge';

const TrainCard = ({ schedule, onSelect }) => {
  const train = schedule.trainId || {};
  const route = schedule.routeId || {};

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-all shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 text-base">{train.trainName || 'Express Train'}</h4>
              <span className="text-xs text-gray-500 font-mono">#{train.trainNumber || 'N/A'}</span>
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {train.trainType || 'Express'}
            </span>
          </div>
        </div>
        <TrainStatusBadge status={schedule.status || train.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider block">Departure</span>
          <span className="text-xl font-bold text-gray-900">{schedule.departureTime || '--:--'}</span>
          <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400" />
            {route.originStation?.name || 'Origin Station'}
          </p>
        </div>

        <div className="text-center py-2 md:py-0 border-y md:border-y-0 md:border-x border-gray-100 px-2">
          <span className="text-xs text-gray-400 block mb-1">Duration</span>
          <div className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>{route.duration || '2-3 hrs'}</span>
          </div>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs text-gray-400 uppercase tracking-wider block">Arrival</span>
          <span className="text-xl font-bold text-gray-900">{schedule.arrivalTime || '--:--'}</span>
          <p className="text-xs text-gray-600 flex items-center justify-start md:justify-end gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400" />
            {route.destinationStation?.name || 'Destination Station'}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-500">
          Operates: {(schedule.operatingDays || ['DAILY']).join(', ')}
        </span>
        {route._id ? (
          <Link
            to={`/routes/${route._id}`}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
          >
            <span>View Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          onSelect && (
            <button
              onClick={() => onSelect(schedule)}
              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default TrainCard;
