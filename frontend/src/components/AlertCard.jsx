import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const AlertCard = ({ type = 'info', title, message, className = '' }) => {
  const configs = {
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    },
    error: {
      bg: 'bg-red-50 border-red-200 text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
  };

  const config = configs[type] || configs.info;

  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${config.bg} ${className}`}>
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <div>
        {title && <h5 className="font-semibold text-sm mb-0.5">{title}</h5>}
        {message && <p className="text-sm opacity-90">{message}</p>}
      </div>
    </div>
  );
};

export default AlertCard;
