import React from 'react';
import { SignatureConfig } from '../types';

interface PreviewProps {
  config: SignatureConfig;
}

export const Preview: React.FC<PreviewProps> = ({ config }) => {
  // Check if there is at least one non-empty social link
  const hasSocialLinks = Object.values(config.socialLinks).some(link => (link as string).trim() !== '');

  const SocialIcon = ({ url, slug, alt }: { url: string; slug: string; alt: string }) => {
    if (!url || !url.trim()) return null;
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block mr-1.5 no-underline"
      >
        <div className="bg-black rounded-full w-7 h-7 flex items-center justify-center overflow-hidden">
            <img 
                src={`https://img.icons8.com/ios-filled/50/ffffff/${slug}.png`} 
                alt={alt} 
                className="w-4 h-4 block border-none object-contain" 
            />
        </div>
      </a>
    );
  };

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
            {/* Reduced margin-bottom here to rely on the signature's own spacing */}
            <div className="mb-0 text-gray-700 font-serif leading-relaxed">
              <p>Hello,</p>
              <br />
              <p>Here is the requested document. Let me know if you need anything else.</p>
            </div>

            {/* Actual Signature Preview - Wrapper mimics the main table container */}
            <div className="mt-0 border-t-0 border-gray-200 pt-0 text-left font-sans text-gray-900 leading-[1.2]">
              
              {/* Two line spaces above Best Regards */}
              <br />
              <br />

              {/* Sign-off Section */}
              {config.signOff && (
                <p className="mb-4 font-serif text-gray-700 m-0 p-0">
                  {config.signOff}
                </p>
              )}

              {/* Header Section: Logo + Name */}
              {/* Simulating <tr><td>...</td><td>...</td></tr> structure with flex, but tight gaps */}
              <div className="flex flex-col sm:flex-row gap-4 items-start mb-3">
                {config.logo && (
                  <div className="shrink-0">
                    {config.logoLink ? (
                        <a href={config.logoLink} target="_blank" rel="noopener noreferrer">
                             <img
                              src={config.logo}
                              alt="Logo"
                              className="w-[80px] h-[80px] object-contain block"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        </a>
                    ) : (
                         <img
                          src={config.logo}
                          alt="Logo"
                          className="w-[80px] h-[80px] object-contain block"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    )}
                  </div>
                )}
                
                <div className="flex flex-col pt-1">
                  <h1 className="text-[22px] font-serif font-bold text-gray-900 leading-tight m-0 p-0">
                    {config.fullName || "Your Name"}
                  </h1>
                  <p className="text-[12px] font-mono uppercase tracking-widest text-gray-600 mt-1 m-0 p-0">
                    {config.jobTitle || "Job Title"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-300 w-full my-3"></div>

              {/* Contact Details */}
              <div className="space-y-1 mb-3">
                {config.contactFields.map((field) => (
                  <div key={field.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-[14px]">
                    <span className="font-mono font-bold text-gray-900 uppercase min-w-[80px] text-xs">
                      {field.label}:
                    </span>
                    <span className="font-serif text-gray-600">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Social Media Links */}
              {hasSocialLinks && (
                  <div className="flex flex-wrap items-center mb-4">
                      <SocialIcon url={config.socialLinks.linkedin} slug="linkedin" alt="LinkedIn" />
                      <SocialIcon url={config.socialLinks.calendly} slug="calendly" alt="Calendly" />
                      <SocialIcon url={config.socialLinks.twitter} slug="x" alt="X" />
                      <SocialIcon url={config.socialLinks.youtube} slug="youtube" alt="YouTube" />
                      <SocialIcon url={config.socialLinks.instagram} slug="instagram-new" alt="Instagram" />
                  </div>
              )}

              {/* Banner */}
              {config.banner && (
                <div className="mb-4 w-full max-w-[600px]">
                  {config.bannerLink ? (
                      <a href={config.bannerLink} target="_blank" rel="noopener noreferrer" className="block w-full text-decoration-none">
                          <img
                            src={config.banner}
                            alt="Banner"
                            className="w-full h-auto object-cover block border-none"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                      </a>
                  ) : (
                      <img
                        src={config.banner}
                        alt="Banner"
                        className="w-full h-auto object-cover block border-none"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                  )}
                </div>
              )}

              {/* Disclaimer */}
              {config.disclaimer && (
                <div className="text-[10px] leading-snug text-gray-400 font-sans text-justify m-0 p-0">
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