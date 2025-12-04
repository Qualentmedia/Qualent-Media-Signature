
import React, { useState } from 'react';
import { GeneratedResult } from '../types';
import { Check, Copy, X, Eye, Code, FileSignature } from 'lucide-react';

interface CodeViewerProps {
  result: GeneratedResult | null;
  onClose: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [copiedVisual, setCopiedVisual] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!result) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(result.html);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyVisual = async () => {
    try {
        const type = "text/html";
        const blob = new Blob([result.html], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        await navigator.clipboard.write(data);
        setCopiedVisual(true);
        setTimeout(() => setCopiedVisual(false), 2000);
    } catch (err) {
        console.error("Failed to copy visual signature:", err);
        // Fallback for browsers that might block ClipboardItem or non-secure contexts
        // Try selecting the iframe content? Usually hard. 
        // Fallback to text copy
        alert("Could not copy rich text. Please copy the HTML code instead.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Your Signature is Ready</h3>
            <p className="text-sm text-gray-500">Choose how you want to use it below.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
            <button 
                onClick={() => setActiveTab('visual')}
                className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition ${activeTab === 'visual' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Eye className="w-4 h-4" />
                Visual Preview
            </button>
            <button 
                onClick={() => setActiveTab('code')}
                className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition ${activeTab === 'code' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Code className="w-4 h-4" />
                HTML Source Code
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative bg-gray-100 flex flex-col">
            {activeTab === 'visual' ? (
                 <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
                    <div className="bg-white shadow-lg p-8 rounded-lg max-w-2xl w-full">
                        <div className="mb-4 pb-4 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-widest text-center">
                            Rendered Output
                        </div>
                        {/* 
                          Using an iframe to isolate the generated HTML style 
                          ensures user sees exactly what the code produces.
                        */}
                        <iframe 
                            srcDoc={result.html} 
                            className="w-full min-h-[300px] border-0" 
                            title="Signature Preview"
                            sandbox="allow-same-origin"
                        />
                    </div>
                 </div>
            ) : (
                <div className="flex-1 p-6 overflow-y-auto bg-gray-900 text-gray-100 font-mono text-sm">
                   <pre className="whitespace-pre-wrap break-all">
                     {result.html}
                   </pre>
                </div>
            )}

            {/* Floating Action Button for the active view */}
            <div className="absolute bottom-6 right-6">
                {activeTab === 'visual' ? (
                    <button
                        onClick={handleCopyVisual}
                        className={`px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 transition transform hover:scale-105 ${copiedVisual ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {copiedVisual ? <Check className="w-5 h-5" /> : <FileSignature className="w-5 h-5" />}
                        {copiedVisual ? "Copied Signature!" : "Copy Signature"}
                    </button>
                ) : (
                    <button
                        onClick={handleCopyCode}
                         className={`px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 transition transform hover:scale-105 ${copiedCode ? 'bg-green-600 text-white' : 'bg-gray-800 text-white hover:bg-black'}`}
                    >
                        {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copiedCode ? "Copied Code!" : "Copy HTML"}
                    </button>
                )}
            </div>
        </div>

        {/* Footer / Tips */}
        {result.tips && (
            <div className="p-4 bg-blue-50 border-t border-blue-100 text-blue-800 text-xs sm:text-sm flex gap-3">
                <span className="font-bold shrink-0">💡 Tip:</span>
                <p>{result.tips}</p>
            </div>
        )}
      </div>
    </div>
  );
};
