'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHome, useFeaturedArticles } from '../hooks/useArticles';
import Banner from './Banner';
import { getStrapiMediaURL } from '../lib/api';
import ArrowIcon from './icons/ArrowIcon';
import AppIcon from './icons/AppIcon';
import ArticlesCard from './ArticlesCard';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePageClient({ locale = 'en' }) {
  const { homeData, loading, error } = useHome(locale);
  const { articles: featuredArticles, loading: articlesLoading } = useFeaturedArticles(3, locale);
  const router = useRouter();
  const t = useTranslations('HomePage')
  
  
  // Function to get translated category name
  const getTranslatedCategoryName = (categoryName) => {
    const categoryMap = {
      'Health': t('healthbt'),
      'Geography': t('geographybt'),
      'Events & Updates': t('eventbt'),
      // Add more category mappings as needed
    };
    return categoryMap[categoryName] || categoryName;
  };

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    const translatedCategoryName = getTranslatedCategoryName(categoryName);
    router.push(`/${locale}/newslist?category=${encodeURIComponent(translatedCategoryName)}`);
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const videoRef = useRef(null);

  // Extract banner data (always run, even if loading/error)
  const banners = homeData?.banners || [];
  const homeDetails = homeData?.homeDetails || [];
  const homeImg = homeData?.homeImg;
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
    console.log('Banners useEffect triggered:', { banners, firstBanner: banners[0] });
    if (banners.length > 0 && banners[0]?.youtubeUrl) {
      const videoId = extractYouTubeId(banners[0].youtubeUrl);
      console.log('Extracted video ID:', videoId);
      setCurrentVideoId(videoId);
    }
  }, [banners]);

  // Auto-play video when videoId changes
  useEffect(() => {
    if (currentVideoId && videoRef.current) {
      const videoUrl = `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=1&loop=1&playlist=${currentVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&enablejsapi=1&start=0&end=0`;
      // Reset video to start and play
      videoRef.current.src = videoUrl;
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
          width: 100% !important;
          transform: translate(-50%, -50%) !important;
          min-height: 100% !important;
        }
        
        /* Mobile: full width like desktop/tablet */
        @media (max-width: 768px) {
          .youtube-video-responsive {
            height: 80vw !important;
            min-width: 320vh !important;
          }
        }
        
        /* Tablet: width > height (4:3 aspect ratio) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .youtube-video-responsive {
            height: 80vw !important;
            min-width: 220vh !important;
          }
        }
        
        /* Desktop: 16:9 aspect ratio */
        @media (min-width: 1025px) {
          .youtube-video-responsive {
            height: 62.5vw !important;
            min-width: 220vh !important;
          }
        }
        
      `}</style>
      <div className=" bg-white min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden mb-2 lg:mb-8 md:mb-3 mt-[96px]">
        <Banner 
          variant="home"
          images={bannerImages}
          backgroundImage={hasImages ? currentImage : null}
          currentSlide={currentSlide}
          hasVideo={!!currentVideoId}
          className={`${!hasImages ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800' : ''}`}
        >
        <div className="h-full flex items-end justify-center relative">
          {/* Main Content - Bottom Left */}
          <div className="text-left text-white w-full relative z-20 px-4 md:px-8 lg:px-16 pb-16 md:pb-20 lg:pb-12 mobile-text-breakout">
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
             <div className="flex justify-start mt-8 pb-8">
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
              <div className="hidden md:block absolute bottom-8 right-8 flex space-x-3 z-30 gap-4">
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
              <div className="md:hidden flex justify-center mt-10 space-x-2 z-30 mobile-thumbnails">
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
        <div className="absolute inset-0 w-full h-full z-19 overflow-hidden">
          <iframe
            ref={videoRef}
            className="youtube-video-responsive"
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=1&loop=1&playlist=${currentVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&enablejsapi=1&start=0&end=0`}
            title="Banner Video"
            allow="autoplay; encrypted-media; fullscreen; accelerometer; gyroscope; picture-in-picture"
            allowFullScreen
            frameBorder="0"
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
        </div>
      )}
      </div>

      {/* Main Content */}
       <main className="w-full px-4 md:px-8 lg:px-16 py-12 relative">
         {/* Background AppIcon - Right Side - Fixed & Responsive */}
         <div className="fixed top-[200px] right-[-120px] sm:right-[-150px] md:right-[-180px] lg:right-[-200px] w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] opacity-40 pointer-events-none z-1">
           <AppIcon className="w-full h-full text-[#E60000]" />
         </div>
         
         {/* Left AppIcon - Fixed & Responsive */}
         <div className="fixed bottom-[100px] left-[-120px] sm:left-[-170px] md:left-[-300px] lg:left-[-380px] w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] opacity-40 pointer-events-none z-1">
           <AppIcon className="w-full h-full text-[#E60000]" />
         </div>
         <div className="max-w-7xl mx-auto text-left sm:text-center relative z-10">
          <h2 className="text-3xl md:text-3xl lg:text-5xl font-bold mb-6 text-black">
            {homeData?.homeTitle}
          </h2>
          
          {homeData?.homeDesc && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-lg sm:text-xl md:text-xl lg:text-3xl font-bold">
                {homeData.homeDesc}
              </p>
            </div>
          )}

          {/* Services Section - Two Column Layout */}
          {homeDetails.length > 0 && (
            <div className="mt-18">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 items-center">
                {/* Left Column - Home Image */}
                <div className="order-1 md:order-1">
                  {homeImg && (
                    <div className="relative aspect-[1/1] md:aspect-[2.3/3] lg:aspect-[1/1] w-full sm:w-3/5 md:w-full lg:w-2/3 mx-auto">
                      <img 
                        src={getStrapiMediaURL(homeImg.url)} 
                        alt="Our Services"
                        className="w-full h-full rounded-lg shadow-lg object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Right Column - Services List */}
                <div className="order-2 md:order-2 lg:space-y-7 md:space-y-8 space-y-8 lg:ml-[-60px] md:ml-4 mt-8 md:mt-0">
                  {homeDetails.map((service, index) => (
                    <div key={service.id || index} className="flex items-start space-x-4">
                      {/* Service Icon */}
                      {service.icon && (
                        <div className="flex-shrink-0">
                          <img 
                            src={getStrapiMediaURL(service.icon.url)} 
                            alt={service.title || 'Service Icon'}
                            className="w-18 h-18 object-contain"
                          />
                        </div>
                      )}
                      
                      {/* Service Content */}
                      <div className="flex-1 text-left lg:max-w-sm md:max-w-none sm:max-w-sm">
                        <h3 className="text-2xl font-regular mb-3 text-red-600">
                          {service.title}
                        </h3>
                        {service.description && (
                          <div 
                            className="text-gray-800 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: service.description 
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

           {/* News Content - Below Services */}
           <div className="container mx-auto px-2 py-8 mt-8 lg:mt-12">
             <div className="max-w-7xl mx-auto text-left sm:text-center">
              <h2 className="text-3xl md:text-3xl lg:text-5xl font-bold mb-6 text-black">
                {homeData?.homeNewsTitle}
              </h2>
              
                {homeData?.homeDesc && (
                  <div className="prose prose-lg max-w-none mb-8">
                    <p className="text-gray-700 leading-relaxed text-lg sm:text-xl md:text-xl lg:text-3xl font-bold">
                      {homeData.homeNewsDesc}
                    </p>
                  </div>
                )}
              </div>
            </div>
        </div>
      </main>

      {/* Article Cards Section - Outside Main Content Container */}
      <section className="py-16 mt-[-120px] lg:mt-[-60px]">
        {!articlesLoading && featuredArticles.length > 0 && (
          <div className="w-full px-4 md:px-8 lg:px-16">
            {/* Mobile: Swiper */}
            <div className="block md:hidden">
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                navigation={false}
                autoHeight={false}
                pagination={{
                  clickable: true,
                  renderBullet: function (index, className) {
                    return '<span class="' + className + '" style="background-color: #E60000;"></span>';
                  },
                }}
                className="!h-auto"
              >
                {featuredArticles.map((article, index) => (
                  <SwiperSlide key={article.id || index} className="h-full">
                    <ArticlesCard
                      article={article}
                      index={index}
                      locale={locale}
                      disableAnimation={true}
                      onCategoryClick={handleCategoryClick}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Tablet: Swiper */}
            <div className="hidden md:block xl:hidden">
              <Swiper
                spaceBetween={40}
                slidesPerView={2}
                navigation={false}
                autoHeight={false}
                pagination={{
                  clickable: true,
                  renderBullet: function (index, className) {
                    return '<span class="' + className + '" style="background-color: #E60000;"></span>';
                  },
                }}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                }}
                className="!h-auto"
              >
                {featuredArticles.map((article, index) => (
                  <SwiperSlide key={article.id || index} className="h-full">
                    <ArticlesCard
                      article={article}
                      index={index}
                      locale={locale}
                      disableAnimation={true}
                      onCategoryClick={handleCategoryClick}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden xl:grid grid-cols-1 xl:grid-cols-3 gap-10">
              {featuredArticles.map((article, index) => (
                <ArticlesCard
                  key={article.id || index}
                  article={article}
                  index={index}
                  locale={locale}
                  disableAnimation={false}
                  onCategoryClick={handleCategoryClick}
                />
              ))}
            </div>
          </div>
        )}
        
        {articlesLoading && (
          <div className="w-full px-4 md:px-8 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* View More Articles Button */}
        <div className="flex justify-center mt-12">
          <button 
            onClick={() => router.push(`/${locale}/newslist`)}
            className="bg-[#E60000] text-white font-bold text-[14px] px-9 py-3 rounded-full flex items-center gap-2 hover:bg-[#D40000] transition-colors duration-200"
          >
            <span>{t('exploreall')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </section>
      </div>
    </>
  );
}
