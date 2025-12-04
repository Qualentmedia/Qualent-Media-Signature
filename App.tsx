import React, { useState } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { CodeViewer } from './components/CodeViewer';
import { SignatureConfig, GeneratedResult } from './types';
import { generateSignatureCode } from './services/geminiService';
import { FileSignature } from 'lucide-react';

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [config, setConfig] = useState<SignatureConfig>({
    fullName: 'Asim Siddiqui',
    jobTitle: 'VP OF MARKETING & SALES',
    logo: null, 
    logoLink: '',
    banner: null,
    bannerLink: '',
    contactFields: [
      { id: '1', label: 'WEBSITE', value: 'qualentmedia.com' },
      { id: '2', label: 'EMAIL', value: 'asim@qualentmedia.com' },
      { id: '3', label: 'ADDRESS', value: 'Austin, TX 78750, United States' },
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/asim',
      calendly: '',
      twitter: '',
      youtube: '',
      instagram: ''
    },
    disclaimer: 'IMPORTANT: The contents of this email and any attachments are confidential. They are intended for the named recipient(s) only. If you have received this email by mistake, please notify the sender immediately.',
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateSignatureCode(config);
      setGeneratedResult(result);
    } catch (error) {
      alert("Failed to generate signature. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <FileSignature className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              SigGen AI
            </h1>
          </div>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
            View on GitHub
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
          {/* Left Column: Editor */}
          <div className="h-full">
            <Editor
              config={config}
              setConfig={setConfig}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="h-full hidden lg:block">
            <Preview config={config} />
          </div>

          {/* Mobile Preview (Below Editor) */}
          <div className="h-[500px] lg:hidden">
             <Preview config={config} />
          </div>
        </div>
      </main>

      {/* Modal for Results */}
      {generatedResult && (
        <CodeViewer
          result={generatedResult}
          onClose={() => setGeneratedResult(null)}
        />
      )}
    </div>
  );
};

export default App;