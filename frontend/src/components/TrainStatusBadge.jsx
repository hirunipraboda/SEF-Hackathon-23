import React from 'react';

const TrainStatusBadge = ({ status = 'ON_TIME', className = '' }) => {
  const statusStyles = {
    ON_TIME: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    DELAYED: 'bg-amber-100 text-amber-800 border-amber-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    DISRUPTED: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const formattedText = (status || 'ON_TIME').replace('_', ' ');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
      } ${className}`}
    >
      {formattedText}
    </span>
  );
};

export default TrainStatusBadge;
