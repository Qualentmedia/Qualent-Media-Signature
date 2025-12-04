import React from 'react';
import { SignatureConfig } from '../types';
import { Linkedin, Calendar, Twitter, Youtube, Instagram } from 'lucide-react';

interface PreviewProps {
  config: SignatureConfig;
}

export const Preview: React.FC<PreviewProps> = ({ config }) => {
  // Check if there is at least one non-empty social link
  const hasSocialLinks = Object.values(config.socialLinks).some(link => (link as string).trim() !== '');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
       <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">2. Live Preview</h2>
          <p className="text-sm text-gray-500 mt-1">This is how your signature will look.</p>
        </div>
        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          Responsive
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto bg-gray-100 flex items-center justify-center">
        {/* Email Client Simulator Container */}
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden min-h-[400px]">
          {/* Fake Email Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-4">
             <div className="flex gap-2 mb-2">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
             </div>
             <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>

          {/* Signature Content Area */}
          <div className="p-8">
            <div className="mb-6 text-gray-700 font-serif">
              <p>Hello,</p>
              <br />
              <p>Here is the requested document. Let me know if you need anything else.</p>
              <br />
              <p>Best regards,</p>
            </div>

            {/* Actual Signature Preview */}
            <div className="mt-8 border-t-0 border-gray-200 pt-0">
              
              {/* Header Section: Logo + Name */}
              <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
                {config.logo && (
                  <div className="shrink-0">
                    {config.logoLink ? (
                        <a href={config.logoLink} target="_blank" rel="noopener noreferrer">
                             <img
                              src={config.logo}
                              alt="Logo"
                              className="w-20 h-20 object-contain"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        </a>
                    ) : (
                         <img
                          src={config.logo}
                          alt="Logo"
                          className="w-20 h-20 object-contain"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    )}
                  </div>
                )}
                
                <div className="flex flex-col pt-1">
                  <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight">
                    {config.fullName || "Your Name"}
                  </h1>
                  <p className="text-sm font-mono uppercase tracking-[0.2em] text-gray-600 mt-2">
                    {config.jobTitle || "Job Title"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-300 my-6" />

              {/* Contact Details */}
              <div className="space-y-3 mb-6">
                {config.contactFields.map((field) => (
                  <div key={field.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className="font-mono font-bold text-gray-900 text-sm uppercase min-w-[100px]">
                      {field.label}:
                    </span>
                    <span className="font-serif text-gray-600 text-base">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Social Media Links */}
              {hasSocialLinks && (
                  <div className="flex flex-wrap gap-2 mb-8">
                      {config.socialLinks.linkedin?.trim() && (
                          <a href={config.socialLinks.linkedin} className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition">
                              <Linkedin className="w-4 h-4" />
                          </a>
                      )}
                      {config.socialLinks.calendly?.trim() && (
                          <a href={config.socialLinks.calendly} className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition">
                              <Calendar className="w-4 h-4" />
                          </a>
                      )}
                      {config.socialLinks.twitter?.trim() && (
                          <a href={config.socialLinks.twitter} className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition">
                              <Twitter className="w-4 h-4" />
                          </a>
                      )}
                      {config.socialLinks.youtube?.trim() && (
                          <a href={config.socialLinks.youtube} className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition">
                              <Youtube className="w-4 h-4" />
                          </a>
                      )}
                      {config.socialLinks.instagram?.trim() && (
                          <a href={config.socialLinks.instagram} className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition">
                              <Instagram className="w-4 h-4" />
                          </a>
                      )}
                  </div>
              )}

              {/* Banner */}
              {config.banner && (
                <div className="mb-6 w-full">
                  {config.bannerLink ? (
                      <a href={config.bannerLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                          <img
                            src={config.banner}
                            alt="Banner"
                            className="w-full max-w-full h-auto object-cover rounded-sm"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                      </a>
                  ) : (
                      <img
                        src={config.banner}
                        alt="Banner"
                        className="w-full max-w-full h-auto object-cover rounded-sm"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                  )}
                </div>
              )}

              {/* Disclaimer */}
              {config.disclaimer && (
                <div className="text-[10px] leading-tight text-gray-400 border-t border-gray-100 pt-4 font-sans text-justify">
                  {config.disclaimer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};