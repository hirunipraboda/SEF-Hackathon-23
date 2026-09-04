import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createStationIcon = (isMajor, isSelected) => {
  const size = isMajor ? 18 : 14;
  return L.divIcon({
    className: 'custom-station-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        background:#ffffff;
        border:${isMajor ? '3px' : '2px'} solid ${isMajor ? '#0f172a' : '#475569'};
        border-radius:50%;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:pointer;
      ">
        <div style="
          width:${isMajor ? '6px' : '4px'};
          height:${isMajor ? '6px' : '4px'};
          background:${isMajor ? '#0f172a' : '#64748b'};
          border-radius:50%;
        "></div>
      </div>
    `,
  });
};

const StationMarker = ({ station, isSelected, onSelect }) => {
  if (!station) return null;
  const lat = station.coordinates?.lat ?? station.latitude;
  const lng = station.coordinates?.lng ?? station.longitude;
  if (lat == null || lng == null) return null;

  const isMajor = station.isMajor || ['FOT', 'KDY', 'GAL', 'JAF', 'BDA'].includes(station.code);
  const icon = useMemo(() => createStationIcon(isMajor, isSelected), [isMajor, isSelected]);
  const position = [lat, lng];

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => onSelect && onSelect(station),
      }}
    >
      <Popup className="station-popup">
        <div className="p-1 min-w-[180px] text-slate-800">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="bg-slate-100 text-slate-800 font-mono text-[11px] font-bold px-1.5 py-0.5 rounded border border-slate-300">
              {station.code}
            </span>
            {isMajor && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Major Terminal
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm text-slate-900">{station.name}</h4>
          <p className="text-xs text-slate-500 mb-2">{station.city || 'Sri Lanka Railways'}</p>

          <div className="text-[11px] text-slate-600 border-t border-slate-100 pt-1.5">
            <span className="text-slate-400">Lines: </span>
            <span className="font-medium">{station.lines?.join(', ') || 'Sri Lanka Rail'}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default StationMarker;
