import React from 'react';

export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    likely_ok: 'bg-green-100 text-green-800 border-green-200',
    has_concerns: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    likely_not_ok: 'bg-red-100 text-red-800 border-red-200',
    unclear: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const labels: Record<string, string> = {
    likely_ok: 'Likely OK',
    has_concerns: 'Has Concerns',
    likely_not_ok: 'Likely Not OK',
    unclear: 'Unclear',
  };

  return (
    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${styles[status] || styles.unclear}`}>
      {labels[status] || 'Unclear'}
    </span>
  );
};
