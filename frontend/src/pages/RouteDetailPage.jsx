import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { routeService } from '../services/routeService';
import RouteTimeline from '../components/RouteTimeline';
import TrainStatusBadge from '../components/TrainStatusBadge';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ArrowLeft, Train, Clock, MapPin, Gauge } from 'lucide-react';

const RouteDetailPage = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    routeService.getRouteById(id)
      .then((data) => {
        if (!data) setError('Route details could not be found.');
        setRoute(data);
      })
      .catch((err) => setError(err.message || 'Failed to fetch route information.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading route details and stops..." />;
  if (error || !route) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-6">
        <Link to="/routes" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4" /> Back to schedules
        </Link>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Train className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Route Information Unavailable</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {error || 'This specific route schedule could not be retrieved from the database. Please select another service.'}
          </p>
          <div className="pt-2">
            <Link
              to="/routes"
              className="inline-flex items-center gap-2 bg-[#0B1A2C] text-white px-4 py-2 rounded-lg text-xs font-semibold"
            >
              Browse All Schedules
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const train = route.trainId || {};

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/routes" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all schedules</span>
      </Link>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{train.trainName || 'Railway Route'}</h1>
                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  #{train.trainNumber || 'N/A'}
                </span>
              </div>
              <span className="text-xs text-blue-600 font-medium">{train.trainType || 'Express'} Line</span>
            </div>
          </div>
          <TrainStatusBadge status={train.status || 'ON_TIME'} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Origin
            </span>
            <span className="font-semibold text-sm text-gray-900 mt-1 block">
              {route.originStation?.name || 'N/A'}
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Destination
            </span>
            <span className="font-semibold text-sm text-gray-900 mt-1 block">
              {route.destinationStation?.name || 'N/A'}
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" /> Duration
            </span>
            <span className="font-semibold text-sm text-gray-900 mt-1 block">
              {route.duration || 'N/A'}
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-gray-400" /> Distance
            </span>
            <span className="font-semibold text-sm text-gray-900 mt-1 block">
              {route.distance ? `${route.distance} km` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Station Timeline */}
      <Card title="Station Stop Timeline" subtitle="Detailed intermediate halts and timings along this route">
        <div className="py-2">
          <RouteTimeline stops={route.stops || []} />
        </div>
      </Card>
    </div>
  );
};

export default RouteDetailPage;
