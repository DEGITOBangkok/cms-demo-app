'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchInput, Banner, SearchAndSort, TagsCapsule, ArticlesCard, LocaleSwitcher, ArrowIcon, ArrowWithTailIcon, IconCircle } from '@/components';
import { useArticles, useSearch, useArticlesWithSort, useCategories } from '@/hooks/useArticles';
import { useLocale } from 'next-intl';
import { getStrapiMediaURL } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/day';
import { useResponsiveContainer, useBannerContentPosition } from '@/hooks/useResponsiveContainer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function NewsListClient() {
  const [sortValue, setSortValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('HomePage');
  
  // Custom responsive container hooks
  const containerClasses = useResponsiveContainer();
  const bannerPositionClasses = useBannerContentPosition();

  // Locale management
  const locale = useLocale();

  // Function to get translated category name (reverse mapping)
  const getOriginalCategoryName = (translatedName) => {
    const categoryMap = {
      [t('healthbt')]: 'Health',
      [t('geographybt')]: 'Geography',
      [t('eventbt')]: 'Events & Updates',
      'นวัตกรรม': 'Innovation',
      'Innovation': 'Innovation',
      // Add more mappings as needed
    };
    return categoryMap[translatedName] || translatedName;
  };

  // Fetch articles with sorting functionality
  const { articles, loading: articlesLoading, error: articlesError } = useArticlesWithSort(sortValue, searchQuery, locale);

  // Fetch categories
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(locale);

  // Search functionality
  const { articles: searchResults, loading: searchLoading } = useSearch(searchQuery, locale);

  // Handle URL query parameters on component mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const sortParam = searchParams.get('sort');

    if (categoryParam) {
      // Convert translated category name back to original name for filtering
      const originalCategoryName = getOriginalCategoryName(categoryParam);
      setSelectedTag(originalCategoryName);
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }

    if (sortParam) {
      setSortValue(sortParam);
    }
  }, [searchParams, t]);

  // Helper function to update URL parameters
  const updateURLParams = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const newURL = `${window.location.pathname}?${params.toString()}`;
    router.replace(newURL, { scroll: false });
  };

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
    updateURLParams({ search: searchTerm });
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    updateURLParams({ sort: value });
  };

  const handleTagChange = (tagValue) => {
    setSelectedTag(tagValue);
    // Convert to translated name for URL
    const translatedTag = tagValue ? getTranslatedCategoryName(tagValue) : '';
    updateURLParams({ category: translatedTag });
  };

  const sortOptions = [
    { value: '', label: t('sort1') },
    { value: 'newest', label: t('sort2') },
    { value: 'oldest', label: t('sort3') },
    { value: 'title-asc', label: t('sort4') },
    { value: 'title-desc', label: t('sort5') },
    { value: 'popular', label: t('mostpop') }
  ];

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

  // Create tag options from categories, with "All" as the first option
  const tagOptions = [
    { value: '', label: t('allbt') },
    ...categories.map(category => ({
      value: category.name || category.title || category.id,
      label: getTranslatedCategoryName(category.name || category.title) || `Category ${category.id}`
    }))
  ];

  // Filter articles based on selected category
  const filterArticlesByTag = (articlesList) => {
    if (!selectedTag) return articlesList; // Show all articles if no tag selected

    return articlesList?.filter(article => {
      // Check if article category matches the selected category
      const articleCategory = article.category;
      const selectedCategory = selectedTag;

      // Check if article has a category and if it matches the selected category
      if (articleCategory) {
        // Handle category relation object
        if (typeof articleCategory === 'object') {
          // Check if the category name, title, or id matches the selected category
          return articleCategory.name === selectedCategory ||
            articleCategory.title === selectedCategory ||
            articleCategory.id === selectedCategory;
        }
        // Handle string category format (fallback)
        return articleCategory === selectedCategory;
      }

      return false;
    }) || [];
  };

  // Get articles with images for slider
  const articlesWithImages = articles?.filter(article => {
    return article.cover && article.cover.url;
  }) || [];

  // Auto-advance is now handled by Swiper's autoplay feature

  const currentArticle = articlesWithImages[currentSlide] || articles?.[0];
  const bannerImages = articlesWithImages.map(article =>
    article.cover?.url ? getStrapiMediaURL(article.cover.url) : null
  ).filter(Boolean);

  // Use search results if searching, otherwise use sorted articles, then apply tag filter
  const baseArticles = searchQuery ? searchResults : articles;
  const displayArticles = filterArticlesByTag(baseArticles);
  const isLoading = searchQuery ? searchLoading : articlesLoading;

  // Handle banner explore more click
  const handleBannerExploreClick = () => {
    if (currentArticle?.slug) {
      // Use locale-aware navigation
      router.push(`/${locale}/newsdesc/${currentArticle.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner with Swiper */}
      <div className="relative animate-in slide-in-from-top-4 duration-700 ease-out">
        {bannerImages.length > 0 ? (
          <div className="relative" style={{ background: '#20394C' }}>
            <Swiper
              ref={swiperRef}
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={false}
              navigation={false}
              className="banner-swiper"
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            >
              {bannerImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <Banner
                    images={[image]}
                    currentSlide={0}
                    className={`text-white relative cursor-pointer ${index === 0 ? 'opacity-0 animate-[fadeInSlide_1s_ease-out_forwards]' : ''
                      }`}
                    onClick={handleBannerExploreClick}
                  >
                    {/* Content positioned in lower left - responsive */}
                    <div className={bannerPositionClasses}>
                      {/* container กลาง + ระยะซ้ายขวาแบบเดียวกับ main */}
                      <div className={containerClasses}>
                        {/* (ถ้าต้องการจำกัดความกว้างข้อความ) */}
                        <div className="max-w-8xl lg:px-10">
                          {/* Category tag */}
                          <div className="mb-2 sm:mb-2">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                const categoryName = currentArticle?.category?.name || 'Sustainability';
                                const translatedCategoryName = getTranslatedCategoryName(categoryName);
                                router.push(`/${locale}/newslist?category=${encodeURIComponent(translatedCategoryName)}`);
                              }}
                              className="inline-block text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-normal tracking-wide bg-slate-900/30 backdrop-blur-md hover:bg-[#FCE5E5] hover:text-[#E60000] hover:border-2 hover:border-[#E60000] cursor-pointer transition-all duration-200">
                              {getTranslatedCategoryName(currentArticle?.category?.name || 'Sustainability')}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="mb-2 sm:mb-2">
                            <span className="text-white text-[16px] font-[400] sm:text-lg">
                              {currentArticle?.publishedAt
                                ? formatDate(currentArticle.publishedAt, locale, 'D MMM YYYY')
                                : formatDate(new Date(), locale, 'D MMM YYYY')}
                            </span>
                          </div>

                          {/* Title */}
                          <h1
                            onClick={handleBannerExploreClick}
                            className="text-[24px] sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 leading-tight text-white hover:text-[#E60000] transition-all duration-300 cursor-pointer pt-1 pb-1"
                          >
                            {currentArticle?.title || 'Pioneering Sustainability Lubricants'}
                          </h1>

                          {/* CTA */}
                          <button
                            onClick={handleBannerExploreClick}
                            className="inline-flex items-center gap-1 sm:gap-2 whitespace-nowrap cursor-pointer group pb-8 sm:pb-0"
                          >
                            <span className="text-[#E60000] font-semibold text-[14px] sm:text-xs md:text-sm">{t('readmore')}</span>
                            <ArrowIcon
                              width={16}
                              height={16}
                              className="text-[#E60000] transition-transform duration-300"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Banner>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <Banner
            variant="newslist"
            className="text-white relative cursor-pointer"
            style={{
              background: ' #17191F'
            }}
            onClick={handleBannerExploreClick}
          >
            {/* Content positioned in lower left - responsive */}
            <div className={bannerPositionClasses}>
              {/* container กลาง + ระยะซ้ายขวาแบบเดียวกับ main */}
              <div className={containerClasses}>
                {/* (ถ้าต้องการจำกัดความกว้างข้อความ) */}
                <div className="max-w-4xl">
                  {/* Category - Only show when there are images */}
                  {bannerImages.length > 0 && (
                    <div className="mb-2 sm:mb-3">
                      <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-light">
                        {currentArticle?.category?.name || ''}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h1
                    onClick={handleBannerExploreClick}
                    className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 leading-tight text-white hover:text-[#D7A048] transition-all duration-300 cursor-pointer"
                  >
                    {currentArticle?.title || ' '}
                  </h1>

                  {/* CTA - Only show when there are images */}
                  {bannerImages.length > 0 && (
                    <button
                      onClick={handleBannerExploreClick}
                      className="inline-flex items-center gap-1 sm:gap-2 whitespace-nowrap cursor-pointer group"
                    >
                      <ArrowIcon
                        width={14}
                        height={14}
                        className="text-[#E60000] transition-transform duration-300"
                      />
                      <span className="text-[#E60000] font-semibold text-xs sm:text-xs md:text-sm">{t('readmore')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Banner>
        )}

        {/* Slider Controls - Keep for manual navigation if needed */}
        {articlesWithImages.length > 1 && (
          <>
            {/* Previous/Next Buttons - responsive */}
            <button
              onClick={() => {
                if (swiperRef.current) {
                  swiperRef.current.slidePrev();
                }
              }}
              className={`absolute left-2 md:left-4 bottom-1 lg:bottom-1/6 transform -translate-y-1/2 bg-[#E60000] text-white p-2 md:p-3 rounded-full transition-all z-10 ${currentSlide === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-opacity-50 hover:bg-opacity-70 hover:scale-110 cursor-pointer'
                }`}
            >
              <ArrowWithTailIcon
                width={21}
                height={21}
                direction="left"
                className="w-6 h-6 md:w-6 md:h-6"
              />
            </button>

            <button
              onClick={() => {
                if (swiperRef.current) {
                  swiperRef.current.slideNext();
                }
              }}
              className={`absolute right-2 md:right-4 bottom-1 lg:bottom-1/6 transform -translate-y-1/2 bg-[#E60000] text-white p-2 md:p-3 rounded-full transition-all z-10 ${currentSlide === articlesWithImages.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-opacity-50 hover:bg-opacity-70 hover:scale-110 cursor-pointer'
                }`}
            >
              <ArrowWithTailIcon
                width={21}
                height={21}
                direction="right"
                className="w-6 h-6 md:w-6 md:h-6"
              />
            </button>

            {/* Slider Indicators - circular pagination */}
            <div className="absolute bottom-2 md:bottom-3 lg:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {articlesWithImages.map((_, index) => {
                const isActive = index === currentSlide;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (swiperRef.current) {
                        swiperRef.current.slideTo(index);
                      }
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                    className="p-1 transition-transform duration-200 hover:scale-110"
                  >
                    <IconCircle
                      width={12}
                      height={12}
                      variant={isActive ? 'active' : 'hollow'}
                      className="transition-all duration-200"
                    />
                  </button>
                );
              })}
            </div>

          </>
        )}
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-4 md:px-8 lg:px-18 py-12">
        <div className="grid grid-cols-12 gap-y-8">
          {/* Search + Sort + Locale */}
          <div className="col-span-12">
            <SearchAndSort
              sortOptions={sortOptions}
              sortValue={sortValue}
              onSortChange={handleSortChange}
              onSearch={handleSearch}

            />
          </div>

          {/* Tags */}
          <div className="col-span-12">
            <TagsCapsule
              tags={tagOptions}
              selectedTag={selectedTag}
              onTagChange={handleTagChange}
              articles={articles}
            />
          </div>

          {/* Featured header + meta */}
          <div className="col-span-12">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {sortValue && !searchQuery && (
                  <span>Sorted by: {sortOptions.find(opt => opt.value === sortValue)?.label}</span>
                )}
                {selectedTag && !searchQuery && (
                  <span className="ml-2">
                    {displayArticles.length === 0
                      ? t('noarticlesfound')
                      : `${displayArticles.length} ${displayArticles.length === 1 ? t('articlefound') : t('articlesfound')}`
                    }
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Grid บทความ */}
          <div className="col-span-12">
            {articlesError ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading articles: {articlesError}</p>
                <p className="text-gray-500">Make sure Strapi is running</p>
              </div>
            ) : displayArticles?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                {displayArticles.map((article, index) => (
                  <ArticlesCard
                    key={`${article.id}-${searchQuery}-${sortValue}-${selectedTag}`}
                    article={article}
                    index={index}
                    onCategoryClick={handleTagChange}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {selectedTag
                    ? `${t('noarticleswithtag')} "${getTranslatedCategoryName(selectedTag)}"`
                    : searchQuery
                      ? `${t('noarticlesforsearch')} "${searchQuery}".`
                      : t('noarticlesfound')
                  }
                </p>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag('')}
                    className="mt-4 text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear tag filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {displayArticles?.length > 0 && (
          <div className="col-span-12 mt-12 font-fciconic">
            <div className="flex justify-between sm:justify-center items-center gap-6">
              {/* Previous Button */}
              <button
                className="text-gray-400 text-lg font-medium cursor-not-allowed px-4 py-2 font-fciconic"
                disabled
              >
                {t('previous')}
              </button>

              {/* Current Page */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-gray-900 text-lg font-regular font-fciconic">1</span>
                </div>
                <span className="text-gray-900 text-lg font-medium font-fciconic">{t('of')} 1</span>
              </div>

              {/* Next Button */}
              <button
                className="text-gray-400 text-lg font-medium cursor-not-allowed px-4 py-2 font-fciconic"
                disabled
              >
                {t('next')}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

