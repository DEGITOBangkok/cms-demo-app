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
    <footer className="bg-[#17191F] text-white font-sarabun">
      {/* Main Footer Content */}
       <div className=" max-w-full mx-auto pl-8 pr-2 sm:pl-12 sm:pr-4 lg:pl-20 lg:pr-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start">
          
          {/* Company Information - Mobile: Full width, Desktop: Left */}
          <div className="w-full md:w-auto space-y-4 md:flex-shrink-0">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/images/demo_logo.png" 
                alt="Digi Proxima Logo" 
                className="h-8 w-auto"
              />
            </div>
            
            {/* Address */}
            <div className="text-sm text-gray-300 leading-relaxed">
              {t('addressLine1')}<br />
              {t('addressLine2')}
            </div>
            
            {/* Contact Information */}
            <div className="space-y-2">
              {/* Phone */}
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm text-gray-300">+662 323 3232</span>
              </div>
              
              {/* Email */}
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm text-gray-300">contact@digiproxima.com</span>
              </div>
            </div>
          </div>

          {/* Mobile Separator Line */}
          <div className="w-full my-6 md:hidden"></div>

          {/* Middle Group - Navigation + Social Media (Desktop: Close Together, Mobile: Separated) */}
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-40">
            {/* Navigation Links */}
            <div className="space-y-4 md:pl-12">
              <div className="space-y-6 md:space-y-8">
                <a href={`/${locale}/newslist`} className="block text-sm text-gray-300 hover:text-white transition-colors border-b border-gray-700 pb-2 md:border-b-0 md:pb-0">
                  {t('newsArticle')}
                </a>
                <a href={`/${locale}/contact`} className="block text-sm text-gray-300 hover:text-white transition-colors border-b border-gray-700 pb-2 md:border-b-0 md:pb-0">
                  {t('contactUs')}
                </a>
                <a href={`/${locale}/privacy`} className="block text-sm text-gray-300 hover:text-white transition-colors border-b border-gray-700 pb-2 md:border-b-0 md:pb-0">
                  {t('privacyPolicy')}
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{t('followUs')}</h3>
              
              <div className="flex space-x-4">
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
                        className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                    
                    {/* Instagram */}
                    {socialMedia.instagram?.URL && (
                      <a 
                        href={socialMedia.instagram.URL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center rounded-full hover:opacity-90 transition-opacity"
                      >
                        <img 
                          src="/images/IG.svg" 
                          alt="Instagram" 
                          className="w-5 h-5"
                        />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Separator Line */}
          <div className="w-full my-6 md:hidden"></div>

          {/* Top Button - Mobile: Full width centered, Desktop: Right */}
          <div className="w-full md:w-auto flex flex-col items-center justify-start space-y-1 md:flex-shrink-0 md:px-10">
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
            <span className="text-xs text-gray-300 leading-none">{t('top')}</span>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="border-t border-gray-700"></div>

      {/* Copyright Section */}
      <div className="max-w-full mx-auto pl-8 pr-2 sm:pl-12 sm:pr-4 lg:pl-20 lg:pr-8 py-6">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            {t('license')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
