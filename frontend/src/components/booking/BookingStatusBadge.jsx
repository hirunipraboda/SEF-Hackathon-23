import React from 'react';

const BookingStatusBadge = ({ status, size = 'sm' }) => {
  const configs = {
    CONFIRMED: {
      label: 'Confirmed',
      dot: 'bg-emerald-500',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    PENDING_PAYMENT: {
      label: 'Payment Pending',
      dot: 'bg-amber-500',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    CANCELLED: {
      label: 'Cancelled',
      dot: 'bg-red-500',
      bg: 'bg-red-50 text-red-800 border-red-200',
    },
    EXPIRED: {
      label: 'Expired',
      dot: 'bg-gray-400',
      bg: 'bg-gray-50 text-gray-700 border-gray-200',
    },
  };

  const conf = configs[status] || configs.PENDING_PAYMENT;
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${conf.bg} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${conf.dot}`}></span>
      <span>{conf.label}</span>
    </span>
  );
};

export default BookingStatusBadge;
