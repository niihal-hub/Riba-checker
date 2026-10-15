import React, { useState } from 'react';
import { Disclaimer } from './components/Disclaimer';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please paste some text or upload a document first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Analysis failed. Please try again.');

      const result = await response.json();
      localStorage.setItem('ribacheck_last_result', JSON.stringify(result));
      router.push('/results');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      if (file.type === 'text/plain') {
        const content = await file.text();
        setText(content);
      } else {
        // For PDF/Images, we send the file to the API
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Analysis failed. Please try again.');

        const result = await response.json();
        localStorage.setItem('ribacheck_last_result', JSON.stringify(result));
        router.push('/results');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Disclaimer />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">RibaCheck</h1>
          <p className="text-lg text-gray-600">
            Check if your financial documents contain potential riba, gharar, or maysir.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800"
              placeholder="Paste loan terms, credit card agreements, or insurance policies here..."
            />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  <Upload className="h-4 w-4" />
                  Upload File
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.pdf,image/*" />
                </label>
                <div className="flex items-center gap-2 text-xs text-gray-500 ml-2">
                  <FileText className="h-4 w-4" />
                  <span>Privacy: Processed in memory only.</span>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Analyzing...' : 'Check Document'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
