
import React, { ChangeEvent } from 'react';
import { SignatureConfig, ContactField, SocialLinks } from '../types';
import { Plus, Trash2, Link as LinkIcon, X, Linkedin, Calendar, Twitter, Youtube, Instagram, ExternalLink } from 'lucide-react';

interface EditorProps {
  config: SignatureConfig;
  setConfig: React.Dispatch<React.SetStateAction<SignatureConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const Editor: React.FC<EditorProps> = ({ config, setConfig, onGenerate, isGenerating }) => {

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const updateContactField = (id: string, key: keyof ContactField, value: string) => {
    setConfig((prev) => ({
      ...prev,
      contactFields: prev.contactFields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      ),
    }));
  };

  const addContactField = () => {
    const newField: ContactField = {
      id: crypto.randomUUID(),
      label: 'NEW LABEL',
      value: 'Detail here',
    };
    setConfig((prev) => ({
      ...prev,
      contactFields: [...prev.contactFields, newField],
    }));
  };

  const removeContactField = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      contactFields: prev.contactFields.filter((field) => field.id !== id),
    }));
  };

  const clearImage = (field: 'logo' | 'banner') => {
    setConfig((prev) => ({ ...prev, [field]: null }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          1. Edit Details
        </h2>
        <p className="text-sm text-gray-500 mt-1">Fill in your information below.</p>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sign-off</label>
              <input
                type="text"
                name="signOff"
                value={config.signOff}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Best Regards,"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={config.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={config.jobTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="CEO & Founder"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Contact Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Details</h3>
             <button
              onClick={addContactField}
              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
             >
               <Plus className="w-3 h-3" /> Add Field
             </button>
          </div>
          
          <div className="space-y-3">
            {config.contactFields.map((field) => (
              <div key={field.id} className="flex items-start gap-2 group">
                <div className="w-1/3">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateContactField(field.id, 'label', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm font-mono font-bold bg-gray-50 border border-transparent hover:border-gray-300 rounded focus:border-blue-500 focus:bg-white outline-none"
                    placeholder="LABEL"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateContactField(field.id, 'value', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm font-serif border border-transparent hover:border-gray-300 rounded focus:border-blue-500 focus:bg-white outline-none"
                    placeholder="Value"
                  />
                </div>
                <button
                  onClick={() => removeContactField(field.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  title="Remove field"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Social Media</h3>
            <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Linkedin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="linkedin"
                        value={config.socialLinks.linkedin}
                        onChange={handleSocialChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                        placeholder="LinkedIn URL"
                    />
                </div>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="calendly"
                        value={config.socialLinks.calendly}
                        onChange={handleSocialChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                        placeholder="Calendly / Booking URL"
                    />
                </div>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Twitter className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="twitter"
                        value={config.socialLinks.twitter}
                        onChange={handleSocialChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                        placeholder="X / Twitter URL"
                    />
                </div>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Youtube className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="youtube"
                        value={config.socialLinks.youtube}
                        onChange={handleSocialChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                        placeholder="YouTube URL"
                    />
                </div>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Instagram className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="instagram"
                        value={config.socialLinks.instagram}
                        onChange={handleSocialChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                        placeholder="Instagram URL"
                    />
                </div>
            </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Visuals (Image Links)</h3>
          
          {/* Logo */}
          <div className="space-y-2">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="logo"
                            value={config.logo || ''}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm font-mono text-gray-600"
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                    {config.logo && (
                        <button
                            onClick={() => clearImage('logo')}
                            className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-md hover:bg-gray-50 transition"
                            title="Clear logo"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
            {config.logo && (
                <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Link on click (Optional)</label>
                     <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="logoLink"
                            value={config.logoLink || ''}
                            onChange={handleInputChange}
                            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-xs text-gray-600"
                            placeholder="https://yourcompany.com"
                        />
                    </div>
                </div>
            )}
            {config.logo && (
                <div className="mt-1 p-2 border border-gray-100 rounded bg-gray-50 inline-block">
                    <p className="text-xs text-gray-400 mb-1">Preview:</p>
                    <img 
                      src={config.logo} 
                      alt="Logo preview" 
                      className="h-12 w-auto object-contain" 
                      onError={(e) => (e.currentTarget.style.display = 'none')} 
                    />
                </div>
            )}
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bottom Banner URL</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="banner"
                            value={config.banner || ''}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm font-mono text-gray-600"
                            placeholder="https://example.com/banner.png"
                        />
                    </div>
                    {config.banner && (
                        <button
                            onClick={() => clearImage('banner')}
                            className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-md hover:bg-gray-50 transition"
                            title="Clear banner"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
            {config.banner && (
                <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Link on click (Optional)</label>
                     <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="bannerLink"
                            value={config.bannerLink || ''}
                            onChange={handleInputChange}
                            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-xs text-gray-600"
                            placeholder="https://promotions.com"
                        />
                    </div>
                </div>
            )}
            {config.banner && (
                 <div className="mt-1 p-2 border border-gray-100 rounded bg-gray-50 w-full">
                    <p className="text-xs text-gray-400 mb-1">Preview:</p>
                    <img 
                      src={config.banner} 
                      alt="Banner preview" 
                      className="w-full h-auto max-h-32 object-contain bg-white" 
                      onError={(e) => (e.currentTarget.style.display = 'none')} 
                    />
                </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="space-y-2">
           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Footer</h3>
           <label className="block text-sm font-medium text-gray-700">Disclaimer Text</label>
           <textarea
            name="disclaimer"
            rows={3}
            value={config.disclaimer}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-xs text-gray-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
           />
        </div>

      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition shadow-lg ${
            isGenerating
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Signature...
            </>
          ) : (
            <>
              Generate Signature
            </>
          )}
        </button>
      </div>
    </div>
  );
};
