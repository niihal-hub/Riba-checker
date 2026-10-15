import React from 'react';
import { Disclaimer } from '@/components/Disclaimer';
import { StatusBadge } from '@/components/StatusBadge';
import { ResultCard } from '@/components/ResultCard';

// Mock data for UI skeleton verification
const MOCK_RESULT = {
  document_type: 'Personal Loan',
  overall_status: 'likely_not_ok',
  confidence: 'high',
  summary: 'This document contains clear evidence of interest-based lending (riba al-nasia), specifically a fixed annual interest rate and compounding penalties.',
  flags: [
    {
      quote: 'The borrower agrees to pay an annual interest rate of 12% compounded monthly.',
      category: 'riba',
      severity: 'high',
      why: 'Charging interest on a loan is the core definition of riba al-nasia.',
      scholars_differ: false,
      halal_alternative: 'Consider a Murabaha (cost-plus-profit) agreement or a Qard Hassan (interest-free loan).'
    },
    {
      quote: 'Late payments will incur a 5% penalty fee per month.',
      category: 'riba',
      severity: 'medium',
      why: 'Many scholars consider late fees that increase the debt to be a form of riba.',
      scholars_differ: true,
      halal_alternative: 'Some Sharia-compliant contracts use a fixed donation to charity for late payments instead of a fee to the lender.'
    }
  ],
  questions_for_scholar: [
    'Is the processing fee a flat service charge or a hidden interest cost?',
    'Are there any options for a profit-sharing arrangement instead of a fixed rate?'
  ]
};

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Disclaimer />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
            ← Back to check
          </a>
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50">
            Copy Report
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{MOCK_RESULT.document_type}</h2>
            <StatusBadge status={MOCK_RESULT.overall_status} />
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{MOCK_RESULT.summary}</p>
          <div className="text-xs text-gray-400">
            Confidence: <span className="font-medium text-gray-600 uppercase">{MOCK_RESULT.confidence}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">Potential Concerns</h3>
        <div className="mb-8">
          {MOCK_RESULT.flags.map((flag, i) => (
            <ResultCard key={i} flag={flag} />
          ))}
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9//a 4.989 4.989 0 013.5 2.4 4.989 4.989 0 013.5-2.4m-12 0a4.989 4.989 0 003.5-2.4 4.989 4.989 0 003.5-2.4m-12 0a4.989 4.989 0 003.5-2.4 4.989 4.989 0 003.5-2.4" />
            </svg>
            Questions to ask a scholar
          </h3>
          <ul className="space-y-2">
            {MOCK_RESULT.questions_for_scholar.map((q, i) => (
              <li key={i} className="text-sm text-blue-800 flex gap-2">
                <span className="font-bold">•</span>
                {q}
              </li>
            ))}
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
