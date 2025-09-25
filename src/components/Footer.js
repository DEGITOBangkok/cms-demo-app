'use client';

import { ArrowWithTailIcon } from './icons';
import { useLocale, useTranslations } from 'next-intl';
import { useSocialMedia } from '../hooks/useSocialMedia';
import { useEffect } from 'react';


/**
 * Footer Component
 * 
 * A footer component that displays company information, navigation links, and social media
 * with a dark background and white text.
 */
const Footer = () => {
  const locale = useLocale();
  const t = useTranslations('Footer');
  const { socialMedia, loading } = useSocialMedia();

  // Force re-render when locale changes
  useEffect(() => {
  }, [locale]);

  return (
    <footer className="bg-[#17191F] text-white font-sarabun relative z-2">
      {/* Main Footer Content */}
       <div className=" max-w-full mx-auto px-4 py-6 lg:px-[64px] lg:py-[40px]">
        <div className="flex flex-col lg:flex-row justify-between items-start self-stretch" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', alignSelf: 'stretch' }}>
          
          {/* Company Information - Mobile: Full width, Desktop: Left */}
          <div className="w-full lg:w-auto space-y-2 lg:flex-shrink-0">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/images/demo_logo.png" 
                alt="Digi Proxima Logo" 
                className="h-7 lg:h-8 w-auto"
              />
            </div>
            
            {/* Address */}
            <div className="text-[16px] font-[400] text-gray-300 leading-relaxed my-4">
              {t('addressLine1')}<br />
              {t('addressLine2')}
            </div>
            
            {/* Contact Information */}
            <div className="space-y-2">
              {/* Phone */}
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/Phone.png" 
                  alt="Phone icon" 
                  className="w-[24px] h-[24px]"
                />
                <span className="text-[14px] font-[400] text-gray-300">+662 323 3232</span>
              </div>
              
              {/* Email */}
              <div className="flex items-center space-x-3">
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
          <div className="w-full lg:hidden mb-6"></div>

          {/* Navigation & Social Media Group - Desktop */}
          <div className="w-full lg:w-auto">
            {/* Navigation Links */}
            <div className="w-full lg:w-auto lg:space-y-6">
              <div className="space-y-6">
                <a href={`/${locale}/newslist`} className="block text-[14px] font-[400] text-white hover:text-white transition-colors border-b border-white pb-2 lg:border-b-0 lg:pb-0">
                  {t('newsArticle')}
                </a>
                <a href={`/${locale}/contact`} className="block text-[14px] font-[400] text-white hover:text-white transition-colors border-b border-white pb-2 lg:border-b-0 lg:pb-0">
                  {t('contactUs')}
                </a>
                <a href={`/${locale}/privacy`} className="block text-[14px] font-[400] text-white hover:text-white transition-colors border-b border-white pb-2 lg:border-b-0 lg:pb-0">
                  {t('privacyPolicy')}
                </a>
              </div>
            </div>

            {/* Mobile Separator Line */}
            <div className="w-full my-6 lg:hidden bg-none"></div>

            {/* Social Media Section */}
            <div className="w-full lg:w-auto">
              <div className="flex justify-between items-center lg:flex-col lg:space-y-4">
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg font-semibold text-white">{t('followUs')}</h3>
                  
                  <div className="flex gap-2">
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
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
                      >
                        <img 
                          src="/images/facebook_icon.png" 
                          alt="Facebook" 
                          className="w-[24px] h-[24px]"
                        />
                      </a>
                    )}
                    
                    {/* Instagram */}
                    {socialMedia.instagram?.URL && (
                      <a 
                        href={socialMedia.instagram.URL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
                      >
                        <img 
                          src="/images/ig_icon.png" 
                          alt="Instagram" 
                          className="w-[24px] h-[24px]"
                        />
                      </a>
                    )}
                  </>
                )}
                  </div>
                </div>
                
                {/* Top Button - Mobile */}
                <div className="lg:hidden flex flex-col items-center gap-1">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-10 h-10 bg-[#E60000] border-2 border-white flex items-center justify-center rounded-full hover:bg-[#CC0000] transition-colors group"
                    aria-label="Scroll to top"
                  >
                    <ArrowWithTailIcon 
                      width={16} 
                      height={16} 
                      direction="left" 
                      color="white"
                      className="transform rotate-90"
                    />
                  </button>
                  <span className="text-[16px] text-white leading-none">{t('top')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Button - Desktop Only */}
          <div className="hidden lg:flex lg:flex-col lg:items-center lg:space-y-1">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 bg-[#E60000] border-2 border-white flex items-center justify-center rounded-full hover:bg-[#CC0000] transition-colors group"
              aria-label="Scroll to top"
            >
              <ArrowWithTailIcon 
                width={16} 
                height={16} 
                direction="left" 
                color="white"
                className="transform rotate-90"
              />
            </button>
            <span className="text-[16px] text-white leading-none">{t('top')}</span>
          </div>
        </div>
      </div>

      {/* Separator Line */}
        <div className="border-t-1" style={{ borderColor: 'rgba(255, 255, 255, 0.50)' }}></div>

      {/* Copyright Section */}
      <div className="max-w-full mx-auto px-4 lg:px-16 pt-6 pb-6">
        <div className="text-center">
          <p className="text-[14px] font-[400] text-white">
            {t('license')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
