import React, { useState } from 'react';
import { GeneratedResult } from '../types';
import { Check, Copy, X } from 'lucide-react';

interface CodeViewerProps {
  result: GeneratedResult | null;
  onClose: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Signature Generated!</h3>
            <p className="text-sm text-gray-500">Copy the code below into your email client settings.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-900 text-gray-100 font-mono text-sm relative group">
           <pre className="whitespace-pre-wrap break-all">
             {result.html}
           </pre>
           <button
            onClick={handleCopy}
            className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded shadow-lg font-sans text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition"
           >
             {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
             {copied ? "Copied!" : "Copy HTML"}
           </button>
        </div>

        {result.tips && (
            <div className="p-4 bg-blue-50 border-t border-blue-100 text-blue-800 text-sm flex gap-3">
                <span className="font-bold shrink-0">💡 Tip:</span>
                <p>{result.tips}</p>
            </div>
        )}

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
           <button
             onClick={onClose}
             className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};
