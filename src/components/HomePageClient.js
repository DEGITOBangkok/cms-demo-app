'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHome } from '../hooks/useArticles';
import Banner from './Banner';
import { getStrapiMediaURL } from '../lib/api';
import ArrowIcon from './icons/ArrowIcon';

export default function HomePageClient({ locale = 'en' }) {
  const { homeData, loading, error } = useHome(locale);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const videoRef = useRef(null);

  // Extract banner data (always run, even if loading/error)
  const banners = homeData?.banners || [];
  const bannerImages = banners.map(banner => {
    // Try different possible image field paths
    const imageUrl = banner?.image?.url || 
                     banner?.thumbnail?.url || 
                     banner?.url || 
                     banner?.image?.formats?.large?.url ||
                     banner?.image?.formats?.medium?.url;
    return getStrapiMediaURL(imageUrl);
  }).filter(Boolean);
  

  // Get current banner content for display
  const currentBanner = banners[currentSlide] || banners[0] || {};
  const currentImage = bannerImages[currentSlide] || bannerImages[0];
  
  // Fallback gradient background if no images
  const hasImages = bannerImages.length > 0;
  
  // Extract YouTube video ID from URL
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Handle slide change and video playback
  const handleSlideChange = (newSlide) => {
    setCurrentSlide(newSlide);
    const banner = banners[newSlide];
    if (banner?.youtubeUrl) {
      const videoId = extractYouTubeId(banner.youtubeUrl);
      setCurrentVideoId(videoId);
    } else {
      setCurrentVideoId(null);
    }
  };

  // Initialize video for first slide
  useEffect(() => {
    if (banners.length > 0 && banners[0]?.youtubeUrl) {
      const videoId = extractYouTubeId(banners[0].youtubeUrl);
      setCurrentVideoId(videoId);
    }
  }, [banners]);

  // Auto-play video when videoId changes
  useEffect(() => {
    if (currentVideoId && videoRef.current) {
      // Reset video to start and play
      videoRef.current.src = `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=1&loop=1&playlist=${currentVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1`;
    }
  }, [currentVideoId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homepage...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-2">Error Loading Homepage</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

    return (
    <>
      <style jsx>{`
        .youtube-video-responsive {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          width: 100vw !important;
          transform: translate(-50%, -50%) !important;
          min-height: 100% !important;
        }
        
        /* Mobile: full width like desktop/tablet */
        @media (max-width: 768px) {
          .youtube-video-responsive {
            height: 75vw !important;
            min-width: 300.33vh !important;
          }
        }
        
        /* Tablet: width > height (4:3 aspect ratio) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .youtube-video-responsive {
            height: 75vw !important;
            min-width: 200.33vh !important;
          }
        }
        
        /* Desktop: 16:9 aspect ratio */
        @media (min-width: 1025px) {
          .youtube-video-responsive {
            height: 56.25vw !important;
            min-width: 200.77vh !important;
          }
        }
        
      `}</style>
      <div className=" bg-white min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative mb-8 overflow-hidden">
        <Banner 
          images={bannerImages}
          backgroundImage={hasImages ? currentImage : null}
          currentSlide={currentSlide}
          className={`${!hasImages ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800' : ''}`}
        >
        <div className="h-full flex items-end justify-center relative pl-0 pr-0">
          {/* Main Content - Bottom Left */}
          <div className="text-left text-white w-full relative z-30 p-4 sm:p-8 pb-12 mobile-text-breakout">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl">
              {currentBanner?.title || homeData?.homeTitle || 'Welcome to Our News'}
            </h1>
            <div className="text-base md:text-lg lg:text-xl w-full sm:max-w-2xl lg:max-w-3xl drop-shadow-xl">
              {currentBanner?.description ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: currentBanner.description.replace(/<[^>]*>/g, '') 
                  }}
                />
              ) : (
                <p>{homeData?.homeDesc || 'Stay updated with the latest news and stories'}</p>
              )}
            </div>
             <div className="flex justify-start mt-10 sm:mt-12">
                 <button className="bg-[#E60000] text-white font-bold text-[14px] px-9 py-3 rounded-full flex items-center gap-2 hover:bg-[#D40000] transition-colors duration-200">
                     <span>{homeData?.exploreButton|| 'Explore More'}</span>
                     <ArrowIcon className="w-4 h-4" />
                 </button>
             </div>
          </div>

          {/* Thumbnail Indicators - Desktop: right side, Mobile: under button */}
          {banners.length > 1 && (
            <>
              {/* Desktop: Right side */}
              <div className="hidden md:block absolute bottom-8 right-8 flex space-x-3 z-40 gap-4">
                {banners.map((banner, index) => {
                  const thumbnailUrl = banner?.thumbnail?.url || banner?.image?.formats?.thumbnail?.url;
                  const isActive = index === currentSlide;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                        isActive 
                          ? 'ring-2 ring-[#E60000]' 
                          : 'opacity-100'
                      }`}
                      aria-label={`Go to slide ${index + 1}${banner.youtubeUrl ? ' (has video)' : ''}`}
                      title={banner.youtubeUrl ? 'This slide has a video' : ''}
                    >
                      {thumbnailUrl ? (
                        <img
                          src={getStrapiMediaURL(thumbnailUrl)}
                          alt={`Banner ${index + 1} thumbnail`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full ${
                          isActive ? 'bg-white' : 'bg-white/50'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile: Under Explore More button */}
              <div className="md:hidden flex justify-center mt-8 space-x-2 z-40 mobile-thumbnails">
                {banners.map((banner, index) => {
                  const thumbnailUrl = banner?.thumbnail?.url || banner?.image?.formats?.thumbnail?.url;
                  const isActive = index === currentSlide;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                        isActive 
                          ? 'ring-2 ring-[#E60000]' 
                          : 'opacity-100'
                      }`}
                      aria-label={`Go to slide ${index + 1}${banner.youtubeUrl ? ' (has video)' : ''}`}
                      title={banner.youtubeUrl ? 'This slide has a video' : ''}
                    >
                      {thumbnailUrl ? (
                        <img
                          src={getStrapiMediaURL(thumbnailUrl)}
                          alt={`Banner ${index + 1} thumbnail`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full ${
                          isActive ? 'bg-white' : 'bg-white/50'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </Banner>

      {/* YouTube Video Overlay - Full Width */}
      {currentVideoId && (
        <div className="absolute inset-0 w-screen h-full z-0 overflow-hidden" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <iframe
            ref={videoRef}
            className="youtube-video-responsive"
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=1&loop=1&playlist=${currentVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&modestbranding=1`}
            title="Banner Video"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>
      )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">
            {homeData?.homeTitle}
          </h2>
          
          {homeData?.homeDesc && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-2xl font-bold">
                {homeData.homeDesc}
              </p>
            </div>
          )}

          {/* Banner Services Section */}
          {banners.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8 text-center text-black">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {banners.map((banner, index) => (
                  <div key={banner.id || index} className="bg-white p-8 rounded-lg shadow-lg border">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                      {banner.title}
                    </h3>
                    {banner.description && (
                      <div 
                        className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: banner.description 
                        }}
                      />
                    )}
                    {banner.youtubeUrl && (
                      <div className="mt-4">
                        <a 
                          href={banner.youtubeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Watch Video →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
