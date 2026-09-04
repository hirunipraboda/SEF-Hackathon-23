import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import TrainMarker from './TrainMarker';
import StationMarker from './StationMarker';
import RouteLine from './RouteLine';

// Helper controller for camera movement when train is selected or reset requested
const MapCameraController = ({ selectedTrain, focusTrigger, onResetDone }) => {
  const map = useMap();
  const prevTrainIdRef = useRef(null);

  useEffect(() => {
    if (selectedTrain) {
      const lat = selectedTrain.currentLocation?.lat ?? selectedTrain.latitude;
      const lng = selectedTrain.currentLocation?.lng ?? selectedTrain.longitude;
      if (lat != null && lng != null) {
        const isNewSelection = prevTrainIdRef.current !== (selectedTrain.id || selectedTrain.trainNumber);
        prevTrainIdRef.current = selectedTrain.id || selectedTrain.trainNumber;

        if (isNewSelection) {
          map.flyTo([lat, lng], 11, { duration: 1.2 });
        } else {
          map.panTo([lat, lng], {
            animate: true,
            duration: 0.8,
          });
        }
      }
    } else {
      prevTrainIdRef.current = null;
    }
  }, [selectedTrain, map]);

  useEffect(() => {
    if (focusTrigger > 0) {
      map.flyTo([7.8731, 80.7718], 8, { duration: 1.0 });
      if (onResetDone) onResetDone();
    }
  }, [focusTrigger, map, onResetDone]);

  return null;
};

const SRI_LANKA_CENTER = [7.8731, 80.7718];
const SRI_LANKA_BOUNDS = [
  [5.5, 79.0],
  [10.2, 82.5],
];

const TrackingMap = ({
  trains = [],
  routes = [],
  stations = [],
  selectedTrain = null,
  onSelectTrain,
  onSelectStation,
  height = '600px',
  className = '',
  showLegend = true,
  showRecenterButton = true,
}) => {
  const [focusTrigger, setFocusTrigger] = React.useState(0);

  const handleRecenter = () => {
    setFocusTrigger((prev) => prev + 1);
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md ${className}`} style={{ height }}>
      <MapContainer
        center={SRI_LANKA_CENTER}
        zoom={8}
        minZoom={7}
        maxZoom={16}
        maxBounds={SRI_LANKA_BOUNDS}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCameraController
          selectedTrain={selectedTrain}
          focusTrigger={focusTrigger}
        />

        {/* Railway Route Lines */}
        {routes.map((route) => (
          <RouteLine
            key={route.id}
            route={route}
            isSelectedTrainRoute={selectedTrain && selectedTrain.routeId === route.id}
          />
        ))}

        {/* Station Markers */}
        {stations.map((station) => (
          <StationMarker
            key={station.code}
            station={station}
            isSelected={false}
            onSelect={onSelectStation}
          />
        ))}

        {/* Train Markers */}
        {trains.map((train) => (
          <TrainMarker
            key={train.id || train.trainNumber}
            train={train}
            isSelected={selectedTrain && (selectedTrain.id === train.id || selectedTrain.trainNumber === train.trainNumber)}
            onSelect={onSelectTrain}
          />
        ))}
      </MapContainer>

      {/* Recenter / Full Sri Lanka View Button */}
      {showRecenterButton && (
        <button
          type="button"
          onClick={handleRecenter}
          title="Reset to Full Sri Lanka Railway Map"
          className="absolute top-3 right-3 z-[1000] bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg shadow-md border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
        >
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Fit Sri Lanka
        </button>
      )}

      {/* Interactive Map Legend */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-lg text-xs max-w-xs pointer-events-auto">
          <div className="font-bold text-slate-900 mb-1.5 flex items-center justify-between">
            <span>Map Legend</span>
            <span className="text-[10px] text-slate-400 font-normal">Railway Grid</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block ring-2 ring-emerald-200"></span>
              <span>On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ring-2 ring-amber-200"></span>
              <span>Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block ring-2 ring-red-200"></span>
              <span>Stopped</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-700 bg-white inline-block"></span>
              <span>Station</span>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center gap-2 text-slate-500 text-[11px]">
            <span className="w-5 h-1 bg-blue-600 rounded-full inline-block"></span>
            <span>Active Rail Route</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingMap;
