'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function CodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearCode = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-slate-300">Code</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyToClipboard}
            className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 flex items-center gap-1 transition"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
          <button
            type="button"
            onClick={clearCode}
            className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition"
          >
            Clear
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your code here... (max 10,000 characters)"
        maxLength={10000}
        className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-sm resize-none"
      />
      <p className="text-xs text-slate-500">{value.length} / 10000 characters</p>
    </div>
  );
}
