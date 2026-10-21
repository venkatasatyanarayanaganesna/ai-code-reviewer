'use client';

import { useState } from 'react';
import { FileText, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import CodeInput from '@/components/CodeInput';
import AnalysisResults from '@/components/AnalysisResults';
import { analyzeCode } from '@/lib/api';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [filename, setFilename] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please paste some code to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await analyzeCode({ code, language, filename });
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze code. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Code Reviewer
            </h1>
          </div>
          <p className="text-slate-400">
            Get instant AI-powered code analysis • Find bugs • Security issues • Performance tips
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div>
            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* Language & Filename */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Filename (optional)
                  </label>
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="e.g., app.js"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Code Input */}
              <CodeInput value={code} onChange={setCode} />

              {/* Error Message */}
              {error && (
                <div className="flex gap-3 p-4 bg-red-900/30 border border-red-600 rounded-lg fade-in">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-200">{error}</p>
                    <p className="text-sm text-red-300 mt-1">
                      Make sure the backend server is running on http://localhost:3001
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Analyze Code
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Results */}
          <div>
            {analysis ? (
              <AnalysisResults analysis={analysis} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    {loading ? 'Analyzing your code...' : 'Results will appear here'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-slate-700">
          <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500 transition">
            <h3 className="font-semibold text-lg mb-2">🐛 Bug Detection</h3>
            <p className="text-slate-400">Find logic errors, edge cases, and potential runtime issues</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500 transition">
            <h3 className="font-semibold text-lg mb-2">🔒 Security Review</h3>
            <p className="text-slate-400">Identify vulnerabilities and security best practices</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500 transition">
            <h3 className="font-semibold text-lg mb-2">⚡ Performance</h3>
            <p className="text-slate-400">Get optimization suggestions and efficiency improvements</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400">
          <p>AI Code Reviewer • Completely Free • Open Source</p>
        </div>
      </footer>
    </div>
  );
}
