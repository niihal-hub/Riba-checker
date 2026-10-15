import React from 'react';
import { Disclaimer } from './components/Disclaimer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Disclaimer />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">RibaCheck</h1>
          <p className="text-lg text-gray-600">
            Paste your financial document text below to check for potential riba, gharar, or maysir.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800"
            placeholder="Paste loan terms, credit card agreements, or insurance policies here..."
          />

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Privacy: Your text is processed in memory and never stored.</span>
            </div>
            <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              Check Document
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
