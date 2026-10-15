import React, { useState, useEffect } from 'react';
import { Disclaimer } from '@/components/Disclaimer';
import { StatusBadge } from '@/components/StatusBadge';
import { ResultCard } from '@/components/ResultCard';

export default function ResultsPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('ribacheck_last_result');
    if (data) {
      setResult(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  const copyReport = () => {
    if (!result) return;
    const text = `RibaCheck Report: ${result.document_type}\nStatus: ${result.overall_status}\nSummary: ${result.summary}\n\nQuestions for Scholar:\n${result.questions_for_scholar.join('\n')}`;
    navigator.clipboard.writeText(text);
    alert('Report copied to clipboard!');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!result) return <div className="min-h-screen flex items-center justify-center">No result found. Please go back and check a document.</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <Disclaimer />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
            ← Back to check
          </a>
          <button
            onClick={copyReport}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
          >
            Copy Report
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{result.document_type}</h2>
            <StatusBadge status={result.overall_status} />
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{result.summary}</p>
          <div className="text-xs text-gray-400">
            Confidence: <span className="font-medium text-gray-600 uppercase">{result.confidence}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">Potential Concerns</h3>
        <div className="mb-8">
          {result.flags && result.flags.length > 0 ? (
            result.flags.map((flag: any, i: number) => (
              <ResultCard key={i} flag={flag} />
            ))
          ) : (
            <p className="text-gray-500 italic">No major concerns were detected.</p>
          )}
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            Questions to ask a scholar
          </h3>
          <ul className="space-y-2">
            {result.questions_for_scholar?.map((q: string, i: number) => (
              <li key={i} className="text-sm text-blue-800 flex gap-2">
                <span className="font-bold">•</span>
                {q}
              </li>
            )) || <li>No specific questions suggested.</li>}
          </ul>
        </div>

        <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <p className="text-sm text-amber-800 font-medium italic">
            Reminder: This report is for information only. Please consult a qualified Islamic finance scholar for a final ruling.
          </p>
        </div>
      </div>
    </main>
  );
}
