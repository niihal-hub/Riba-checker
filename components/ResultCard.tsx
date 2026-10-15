import React from 'react';
import { StatusBadge } from './StatusBadge';

interface Flag {
  quote: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  why: string;
  scholars_differ: boolean;
  halal_alternative: string;
}

export const ResultCard = ({ flag }: { flag: Flag }) => {
  const severityColor = {
    low: 'border-blue-200 bg-blue-50',
    medium: 'border-yellow-200 bg-yellow-50',
    high: 'border-red-200 bg-red-50',
  };

  return (
    <div className={`p-4 border-l-4 rounded-r-lg shadow-sm mb-4 ${severityColor[flag.severity]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{flag.category}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${severityColor[flag.severity].replace('bg-', 'text-').replace('border-', 'bg-')}`}>
          {flag.severity} severity
        </span>
      </div>
      <p className="italic text-gray-700 mb-2 font-serif">"{flag.quote}"</p>
      <p className="text-sm text-gray-800 mb-3">{flag.why}</p>
      {flag.scholars_differ && (
        <p className="text-xs text-amber-700 mb-3 font-medium italic">
          Note: Scholars have different views on this specific point.
        </p>
      )}
      {flag.halal_alternative && (
        <div className="mt-2 p-2 bg-white rounded border border-gray-100 text-xs">
          <span className="font-bold text-green-700">Alternative: </span>
          {flag.halal_alternative}
        </div>
      )}
    </div>
  );
};
