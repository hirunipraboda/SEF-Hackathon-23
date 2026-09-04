import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading data...', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-gray-500 ${className}`}>
      <Loader2 className={`animate-spin text-blue-600 ${sizeMap[size] || sizeMap.md}`} />
      {text && <p className="mt-2 text-sm text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
