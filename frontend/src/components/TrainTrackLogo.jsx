import React from 'react';

export const TrainTrackIcon = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Dark rounded container */}
    <rect width="100" height="100" rx="24" fill="#0B1A2C" />
    
    {/* Tracks */}
    <path
      d="M24 82L38 72M76 82L62 72"
      stroke="#5B7693"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <rect x="22" y="80" width="56" height="6" rx="3" fill="#15803D" />

    {/* Train body */}
    <rect x="30" y="24" width="40" height="48" rx="10" fill="#166534" />
    
    {/* Windshield */}
    <rect x="36" y="32" width="28" height="15" rx="5" fill="#E2E8F0" />
    
    {/* Headlights */}
    <circle cx="39" cy="59" r="4" fill="#FDE047" />
    <circle cx="61" cy="59" r="4" fill="#FDE047" />
    
    {/* Cowcatcher / Front bumper line */}
    <rect x="34" y="68" width="32" height="3" rx="1.5" fill="#0F3A22" />
  </svg>
);

export const TrainTrackLogo = ({ variant = 'light', showSubtitle = true, className = '' }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <TrainTrackIcon className="w-9 h-9 shrink-0 shadow-sm" />
      <div className="flex flex-col leading-tight">
        <span
          className={`font-black text-xl tracking-tight ${
            isDark ? 'text-white' : 'text-[#0B1A2C]'
          }`}
        >
          TrainTrack
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-extrabold tracking-[0.18em] text-[#15803D] uppercase">
            Sri Lanka Railways
          </span>
        )}
      </div>
    </div>
  );
};

export default TrainTrackLogo;
