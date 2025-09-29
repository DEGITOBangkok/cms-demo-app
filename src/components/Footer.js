'use client';

import { ArrowWithTailIcon } from './icons';
import { useLocale, useTranslations } from 'next-intl';
import { useSocialMedia } from '../hooks/useSocialMedia';
import { useEffect, useState } from 'react';


/**
 * Footer Component
 * 
 * A footer component that displays company information, navigation links, and social media
 * with a dark background and white text.
 */
const Footer = () => {
  const [isClient, setIsClient] = useState(false);
  const locale = useLocale();
  const t = useTranslations('Footer');
  const { socialMedia, loading } = useSocialMedia();

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Force re-render when locale changes
  useEffect(() => {
  }, [locale]);

  return (
    <footer className="bg-[#17191F] text-white relative z-2 px-4 py-10 md:px-8 lg:px-[64px] md:py-[40px]">
      {/* Main Footer Content */}
       <div className=" max-w-full mx-auto ">
        <div className="flex flex-col md:flex-row justify-between items-start self-stretch pb-8">
          
          {/* Company Information - Mobile: Full width, Desktop: Left */}
          <div className="w-full md:w-auto space-y-2 md:flex-shrink-0">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/images/demo_logo.png" 
                alt="Digi Proxima Logo" 
                className="w-[266px] h-[30px]"
              />
            </div>
            
            {/* Address */}
            <div className="text-[16px] font-[400] text-gray-300 leading-relaxed my-6">
              {t('addressLine1')}<br />
              {t('addressLine2')}
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6 md:space-y-0 md:flex md:flex-row md:space-x-6 md:space-y-0">
              {/* Phone */}
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/Phone.png" 
                  alt="Phone icon" 
                  className="w-[24px] h-[24px]"
                />
                <span className="text-[14px] font-[400] text-gray-300">+662 323 3232</span>
              </div>
              
              {/* Email */}
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/Email.png" 
                  alt="Email icon" 
                  className="w-[24px] h-[24px]"
                />
                <span className="text-[14px] font-[400] text-gray-300">contact@digiproxima.com</span>
              </div>
            </div>
          </div>

          {/*Mobile Separator Line*/}
          <div className="w-full md:hidden md:mb-6"></div>

          {/* Navigation Links */}
          <div className="w-full my-10 md:my-0 md:w-auto md:space-y-6">
            <div className="md:space-y-10">
              <a href={isClient ? `/${locale}/newslist` : '/en/newslist'} className="block text-[14px] font-[400] text-white hover:text-white transition-colors border-b border-white pb-4 md:pt-0 md:border-b-0 md:pb-0">
                {t('newsArticle')}
              </a>
              <a href={isClient ? `/${locale}/contact` : '/en/contact'} className="block text-[14px] font-[400] text-white hover:text-white transition-colors border-b border-white pb-4 pt-4 md:pt-0 md:pb-0 md:border-b-0 md:pb-0">
                {t('contactUs')}
              </a>
              <a href={isClient ? `/${locale}/privacy` : '/en/privacy'} className="block text-[14px] font-[400] text-white hover:text-white transition-colors border-b border-white pb-4 pt-4 md:pt-0 md:pb-0 md:border-b-0 md:pb-0">
                {t('privacyPolicy')}
              </a>
            </div>
          </div>

          {/* Mobile Separator Line */}
          <div className="w-full md:hidden bg-none"></div>

          {/* Social Media Section */}
          <div className="w-full md:w-auto">
            <div className="flex justify-between items-center md:flex-col">
              <div className="flex flex-col space-y-4">
                <h3 className="text-[16px] font-[400] text-white">{t('followUs')}</h3>
                
                <div className="flex gap-4">
              {loading ? (
                // Loading skeleton
                <>
                  <div className="w-10 h-10 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-600 rounded-full animate-pulse"></div>
                </>
              ) : (
                <>
                  {/* Facebook */}
                  {socialMedia.facebook?.URL && (
                    <a 
                      href={socialMedia.facebook.URL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src="/images/facebook_icon.png" 
                        alt="Facebook" 
                        className="w-full h-full object-contain"
                      />
                    </a>
                  )}
                  
                  {/* Instagram */}
                  {socialMedia.instagram?.URL && (
                    <a 
                      href={socialMedia.instagram.URL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-6 h-6 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src="/images/ig_icon.png" 
                        alt="Instagram" 
                        className="w-full h-full object-contain"
                      />
                    </a>
                  )}
                </>
              )}
                </div>
              </div>
              
              {/* Top Button - Mobile */}
              <div className="md:hidden flex flex-col items-center gap-1">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-10 h-10 bg-[#E60000] border-2 border-white flex items-center justify-center rounded-full hover:bg-white transition-colors group"
                  aria-label="Scroll to top"
                >
                  <ArrowWithTailIcon 
                    width={20} 
                    height={20} 
                    direction="left" 
                    color="white"
                    className="transform rotate-90 transition-colors group-hover:[&>path]:fill-[#E60000]"
                  />
                </button>
                <span className="text-[16px] text-white leading-none pt-[7.5px] pb-[0.5px] !font-sarabun">{t('top')}</span>
              </div>
            </div>
          </div>

          {/* Top Button - Desktop Only */}
          <div className="hidden md:flex md:flex-col md:items-center gap-1">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 bg-[#E60000] border-2 border-white flex items-center justify-center rounded-full hover:bg-white transition-colors group"
                aria-label="Scroll to top"
              >
              <ArrowWithTailIcon 
                width={20} 
                height={20} 
                direction="left" 
                color="white"
                className="transform rotate-90 transition-colors group-hover:[&>path]:fill-[#E60000]"
              />
            </button>
            <span className="text-[16px] font-[400] text-white leading-none pt-[7.5px] pb-[0.5px] !font-sarabun">{t('top')}</span>
          </div>
        </div>
      </div>

      {/* Separator Line */}

        <div className="border-t-[1px]" style={{ borderColor: 'rgba(255, 255, 255, 0.50)' }}></div>

       {/* Copyright Section */}
       <div className="max-w-full mx-auto pt-8">
         <div className="md:text-left text-center">
           <p className="text-[14px] font-[400] text-white">
             {t('license')}
           </p>
         </div>
       </div>
    </footer>
  );
};

export default Footer;
