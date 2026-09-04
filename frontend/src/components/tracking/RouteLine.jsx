import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';

const RouteLine = ({ route, isSelectedTrainRoute }) => {
  if (!route) return null;

  let positions = [];
  if (Array.isArray(route.path) && route.path.length >= 2) {
    positions = route.path.map((pt) => (Array.isArray(pt) ? pt : [pt.lat, pt.lng]));
  } else if (Array.isArray(route.coordinates) && route.coordinates.length >= 2) {
    positions = route.coordinates.map((pt) => (Array.isArray(pt) ? pt : [pt.lat, pt.lng]));
  }

  if (positions.length < 2) return null;
  const defaultColor = route.color || '#2563eb';

  return (
    <>
      {/* Outer shadow / glow for contrast */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: isSelectedTrainRoute ? '#0284c7' : '#94a3b8',
          weight: isSelectedTrainRoute ? 7 : 4,
          opacity: isSelectedTrainRoute ? 0.35 : 0.2,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
      {/* Main track line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: isSelectedTrainRoute ? '#0284c7' : defaultColor,
          weight: isSelectedTrainRoute ? 4.5 : 2.5,
          opacity: isSelectedTrainRoute ? 0.95 : 0.65,
          dashArray: isSelectedTrainRoute ? undefined : '4, 4',
          lineCap: 'round',
          lineJoin: 'round',
        }}
      >
        <Tooltip sticky>
          <div className="text-xs font-semibold text-slate-800">
            {route.name}
            <div className="text-[10px] text-slate-500 font-normal">
              {route.originStation?.name || route.origin} → {route.destinationStation?.name || route.destination}
            </div>
          </div>
        </Tooltip>
      </Polyline>
    </>
  );
};

export default RouteLine;
