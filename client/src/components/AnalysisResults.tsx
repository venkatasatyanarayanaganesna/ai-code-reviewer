'use client';

import { AlertCircle, CheckCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';

const severityIcons: Record<string, React.ReactNode> = {
  critical: <AlertCircle className="w-5 h-5 text-red-400" />,
  high: <AlertTriangle className="w-5 h-5 text-orange-400" />,
  medium: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  low: <Info className="w-5 h-5 text-blue-400" />,
};

const severityColors: Record<string, string> = {
  critical: 'bg-red-900/30 border-red-600',
  high: 'bg-orange-900/30 border-orange-600',
  medium: 'bg-yellow-900/30 border-yellow-600',
  low: 'bg-blue-900/30 border-blue-600',
};

const typeIcons: Record<string, string> = {
  bug: '🐛',
  security: '🔒',
  performance: '⚡',
  'best-practice': '✅',
  documentation: '📚',
};

export default function AnalysisResults({ analysis }: { analysis: any }) {
  if (!analysis) return null;

  const score = analysis.score || 0;
  const issues = analysis.issues || [];
  const improvements = analysis.improvements || [];

  return (
    <div className="space-y-6 fade-in">
      {/* Summary */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Analysis Summary</h2>
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{score}</span>
            </div>
            <span className="text-slate-400">/ 10</span>
          </div>
        </div>
        <p className="text-slate-300">{analysis.summary}</p>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Issues Found ({issues.length})
          </h3>
          <div className="space-y-3">
            {issues.map((issue: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${severityColors[issue.severity] || severityColors.low}`}
              >
                <div className="flex gap-3">
                  {severityIcons[issue.severity] || severityIcons.low}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{typeIcons[issue.type] || '📋'}</span>
                      <span className="font-semibold capitalize">{issue.type}</span>
                      <span className="text-xs px-2 py-1 bg-black/30 rounded capitalize">
                        {issue.severity}
                      </span>
                      {issue.line && (
                        <span className="text-xs text-slate-400">Line {issue.line}</span>
                      )}
                    </div>
                    <p className="text-sm mb-2">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-sm text-slate-300 bg-black/20 p-2 rounded">
                        <strong>Fix:</strong> {issue.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Improvement Suggestions
          </h3>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
            {improvements.map((imp: string, idx: number) => (
              <div key={idx} className="flex gap-3">
                <span className="text-yellow-400 font-bold flex-shrink-0">→</span>
                <p className="text-slate-300 text-sm">{imp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documentation */}
      {analysis.documentation && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Generated Documentation
          </h3>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <pre className="text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap break-words">
              {analysis.documentation}
            </pre>
          </div>
        </div>
      )}

      {/* No issues */}
      {issues.length === 0 && (
        <div className="text-center p-8 bg-green-900/20 border border-green-600 rounded-lg">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-green-300 font-semibold">Great code! No major issues found.</p>
        </div>
      )}
    </div>
  );
}
