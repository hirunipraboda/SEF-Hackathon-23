import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const getStatusColor = (status) => {
  switch (status) {
    case 'ON_TIME':
      return {
        bg: '#16a34a',
        border: '#15803d',
        text: 'On Time',
        textColor: 'text-emerald-700',
        badgeBg: 'bg-emerald-50 border-emerald-200',
        pulse: '#22c55e',
      };
    case 'DELAYED':
      return {
        bg: '#d97706',
        border: '#b45309',
        text: 'Delayed',
        textColor: 'text-amber-700',
        badgeBg: 'bg-amber-50 border-amber-200',
        pulse: '#f59e0b',
      };
    case 'STOPPED':
      return {
        bg: '#dc2626',
        border: '#b91c1c',
        text: 'Stopped',
        textColor: 'text-red-700',
        badgeBg: 'bg-red-50 border-red-200',
        pulse: '#ef4444',
      };
    default:
      return {
        bg: '#475569',
        border: '#334155',
        text: 'Unknown',
        textColor: 'text-slate-700',
        badgeBg: 'bg-slate-50 border-slate-200',
        pulse: '#64748b',
      };
  }
};

const createTrainIcon = (status, isSelected, heading = 0) => {
  const color = getStatusColor(status);
  const size = isSelected ? 42 : 34;
  const pulseHtml = isSelected
    ? `<div style="position:absolute; width:100%; height:100%; border-radius:50%; background:${color.pulse}; opacity:0.4; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>`
    : '';

  return L.divIcon({
    className: 'custom-train-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
    html: `
      <div style="position:relative; width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
        ${pulseHtml}
        <div style="
          position:relative;
          width:${size - 4}px;
          height:${size - 4}px;
          background:${color.bg};
          border: 2.5px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3), 0 0 0 2px ${isSelected ? color.border : 'rgba(0,0,0,0.1)'};
          display:flex;
          align-items:center;
          justify-content:center;
          transition: transform 0.2s ease;
        ">
          <svg style="width:${size * 0.52}px; height:${size * 0.52}px; fill:#ffffff;" viewBox="0 0 24 24">
            <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
          </svg>
        </div>
      </div>
    `,
  });
};

const TrainMarker = ({ train, isSelected, onSelect }) => {
  if (!train) return null;
  const lat = train.currentLocation?.lat ?? train.latitude;
  const lng = train.currentLocation?.lng ?? train.longitude;
  if (lat == null || lng == null) return null;

  const position = [lat, lng];
  const color = getStatusColor(train.status);
  const speed = train.speedKmh ?? train.speed ?? 0;

  const icon = useMemo(() => {
    return createTrainIcon(train.status, isSelected, train.heading);
  }, [train.status, isSelected, train.heading]);

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => onSelect && onSelect(train),
      }}
    >
      <Popup className="custom-popup" closeButton={true}>
        <div className="p-1 min-w-[210px] text-slate-800">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-slate-600">#{train.trainNumber}</span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${color.badgeBg} ${color.textColor}`}
            >
              {color.text}
              {train.delayMinutes > 0 ? ` (+${train.delayMinutes}m)` : ''}
            </span>
          </div>

          <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">{train.trainName}</h4>
          <p className="text-xs text-slate-500 mb-2">{train.routeName}</p>

          <div className="space-y-1 bg-slate-50 rounded p-2 text-xs mb-2">
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Current / Near:</span>
              <span className="font-medium text-slate-800">{train.currentStation}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Next Stop:</span>
              <span className="font-medium text-slate-800">{train.nextStation}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Speed:</span>
              <span className="font-semibold text-emerald-700">{speed} km/h</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Next ETA:</span>
              <span className="font-medium text-slate-800">{train.etaNextStation || '--'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(train);
            }}
            className="w-full text-center py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-colors"
          >
            Track This Train
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default TrainMarker;
