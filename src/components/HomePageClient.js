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
import { useResponsiveContainer, useBannerContentPosition, useMobileColumnLayout, useBannerBottomPadding, useMainContentPadding } from '../hooks/useResponsiveContainer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePageClient({ locale = 'en' }) {
  const { homeData, loading, error } = useHome(locale);
  const { articles: featuredArticles, loading: articlesLoading } = useFeaturedArticles(3, locale);
  const router = useRouter();
  const t = useTranslations('HomePage')
  
  // Custom responsive container hooks
  const containerClasses = useResponsiveContainer();
  const bannerPositionClasses = useBannerContentPosition();
  const layoutClasses = useMobileColumnLayout();
  const bannerPaddingClasses = useBannerBottomPadding();
  const mainPaddingClasses = useMainContentPadding();
  
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
        
        /* Tablet: very large video to cover entire banner area */
        @media (min-width: 768px) and (max-width: 1024px) {
          .youtube-video-responsive {
            height: 100vh !important;
            width: 177.78vh !important;
            min-width: 100vw !important;
            min-height: 56.25vw !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
          }
        }
        
        /* Desktop: very large video to cover entire banner area */
        @media (min-width: 1025px) {
          .youtube-video-responsive {
            height: 200vh !important;
            width: 200vw !important;
            min-width: 200vw !important;
            top: -50vh !important;
            left: -50vw !important;
            transform: none !important;
          }
        }
        
      `}</style>
      <div className=" bg-white min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden">
        <Banner 
          variant="home"
          images={bannerImages}
          backgroundImage={hasImages ? currentImage : null}
          currentSlide={currentSlide}
          hasVideo={!!currentVideoId}
          className={`${!hasImages ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800' : ''}`}
        >
        <div className="h-full flex items-end justify-center relative">
            {/* Main Content Container */}
            <div className={`${layoutClasses} relative z-10 ${containerClasses} ${bannerPaddingClasses} banner-content-container`}>
              {/* Text Content - Left Side */}
              <div className="text-left text-white lg:w-1/2 sm:w-1/2 mobile-text-breakout">
              <h1 className="banner-title-custom">
                {currentBanner?.title || homeData?.homeTitle || 'Welcome to Our News'}
              </h1>
              <div className="banner-description-custom w-full lg:max-w-2xl lg:py-4 py-6">
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
               <div className="flex justify-start">
                   <button className="bg-[#E60000] banner-button-custom px-[48px] py-[14px] rounded-full flex items-center gap-2 hover:bg-[#FF3333] transition-all duration-300 group">
                       <span>{homeData?.exploreButton|| 'Explore More'}</span>
                       <ArrowIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
                   </button>
               </div>
            </div>

            {/* Dynamic Thumbnail Layout */}
            {banners.length > 1 && (
              <>
                {/* Mobile Thumbnail Swiper */}
                <div className="mobile-swiper-only thumbnail-container">
                  <Swiper
                    spaceBetween={16}
                    slidesPerView={3}
                    centeredSlides={true}
                    initialSlide={currentSlide}
                    onSlideChange={(swiper) => handleSlideChange(swiper.activeIndex)}
                    className="!w-auto"
                    allowTouchMove={true}
                    touchRatio={0.5}
                    threshold={10}
                    resistance={true}
                    resistanceRatio={0.5}
                  >
                    {banners.map((banner, index) => {
                      const thumbnailUrl = banner?.thumbnail?.url || banner?.image?.formats?.thumbnail?.url;
                      const isActive = index === currentSlide;
                      
                      return (
                        <SwiperSlide key={index} className="!w-[74px]">
                          <button
                            onClick={() => handleSlideChange(index)}
                            className={`relative w-[74px] h-[74px] rounded-lg overflow-hidden transition-all duration-200 ${
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
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>

                {/* Desktop/Tablet Thumbnail Layout */}
                <div className="desktop-thumbnails-only thumbnail-container">
                  {banners.map((banner, index) => {
                    const thumbnailUrl = banner?.thumbnail?.url || banner?.image?.formats?.thumbnail?.url;
                    const isActive = index === currentSlide;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleSlideChange(index)}
                        className={`relative w-[74px] h-[74px] lg:w-[87px] lg:h-[87px] rounded-lg overflow-hidden transition-all duration-200 ${
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

          {/* YouTube Video Overlay - Inside Banner */}
          {currentVideoId && (
            <div className="absolute inset-0 w-full h-full z-0 overflow-visible">
              <iframe
                ref={videoRef}
                className="youtube-video-responsive"
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=1&loop=1&playlist=${currentVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&enablejsapi=1&start=0&end=0`}
                title="Banner Video"
                allow="autoplay; encrypted-media; fullscreen; accelerometer; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
            </div>
          )}
        </div>
      </Banner>
      </div>

      {/* Main Content */}
       <main className={`w-full ${mainPaddingClasses} xl:pt-30 xl:pb-10 py-10 pt-30 relative overflow-x-hidden`}>
         {/* Background AppIcon - Right Side - Absolute & Responsive */}
         <div className="absolute top-[200px] right-[-120px] sm:right-[-150px] md:right-[-180px] lg:right-[-200px] w-60 h-60 sm:w-70 sm:h-70 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] opacity-40 pointer-events-none z-1 overflow-x-hidden">
           <AppIcon className="w-full h-full text-[#E60000]" />
         </div>
         
         {/* Left AppIcon - Absolute & Responsive */}
         <div className="absolute bottom-[100px] left-[-120px] sm:left-[-170px] md:left-[-300px] lg:left-[-380px] w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] opacity-40 pointer-events-none z-1 overflow-x-hidden">
           <AppIcon className="w-full h-full text-[#E60000]" />
         </div>
         <div className="max-w-7xl mx-auto text-left sm:text-center relative z-10">
          <h2 className="text-[28px] md:text-3xl lg:text-[40px] font-[700] mb-6 text-black">
            {homeData?.homeTitle}
          </h2>
          
          {homeData?.homeDesc && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-lg text-[22px] md:text-xl lg:text-[24px] font-[700]">
                {homeData.homeDesc}
              </p>
            </div>
          )}

          {/* Services Section - Flex Layout */}
          {homeDetails.length > 0 && (
            <div className="mt-10">
              <div className=" flex flex-col xl:flex-row items-center gap-8 xl:gap-8 self-stretch">
                {/* Left Column - Home Image */}
                <div className="flex-shrink-0">
                  {homeImg && (
                    <div className="relative aspect-[1/1] w-full sm:w-3/5 md:w-[400px] lg:w-[532px] mx-auto">
                      <img 
                        src={getStrapiMediaURL(homeImg.url)} 
                        alt="Our Services"
                        className="w-full h-full rounded-lg shadow-lg object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Right Column - Services List */}
                <div className="flex-1">
                  {homeDetails.map((service, index) => (
                    <div key={service.id || index} className={`flex flex-col xl:flex-row items-start xl:items-start xl:gap-6 pb-8 ${index === homeDetails.length - 1 ? 'xl:pb-0' : 'xl:pb-14'}`}>
                      {/* Service Icon */}
                      {service.image && (
                        <div className="mb-4 xl:mb-0 xl:flex-shrink-0">
                          <img 
                            src={getStrapiMediaURL(service.image.url)} 
                            alt={service.title || 'Service Icon'}
                            className="w-22 h-22 object-contain"
                          />
                        </div>
                      )}
                      
                      {/* Service Content */}
                      <div className="text-left md:max-w-none sm:max-w-sm xl:flex-1">
                        <h3 className="text-[20px] font-[400] mb-3 text-[#E60000]">
                          {service.title}
                        </h3>
                        {service.description && (
                          <div 
                            className="text-[#17191F] leading-relaxed prose prose-sm max-w-none text-[20px]"
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
        </div>
      </main>

      {/* News Content - Outside Services Container */}
      <section className="w-full px-4 md:px-8 lg:px-16 py-8 mt-8 lg:mt-12">
        <div className="max-w-7xl mx-auto text-left sm:text-center">
          <h2 className="text-[28px] md:text-3xl lg:text-[40px] font-[700] mb-6 text-black">
            {homeData?.homeNewsTitle}
          </h2>
          
          {homeData?.homeNewsDesc && (
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-lg sm:text-xl md:text-xl lg:text-[24px] font-[700]">
                {homeData.homeNewsDesc}
              </p>
            </div>
          )}
        </div>
      </section>

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
            className="bg-[#E60000] text-white font-bold text-[14px] px-9 py-3 rounded-full flex items-center gap-2 hover:bg-[#FF3333] transition-all duration-300 group"
          >
            <span>{t('exploreall')}</span>
            <ArrowIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </section>
      </div>
    </>
  );
}
