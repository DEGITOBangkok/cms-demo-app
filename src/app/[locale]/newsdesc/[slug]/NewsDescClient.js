'use client';

import { LocaleSwitcher } from '@/components';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { getStrapiMediaURL } from '@/lib/api';
import { formatDate } from '@/lib/day';
import ShareBar from '@/components/ShareBar';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useArticles } from '@/hooks/useArticles';
import ArticlesCard from '@/components/ArticlesCard';
import ScrollShareBar from '@/components/ScrollShareBar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export default function NewsDescClient({ article }) {
  // Locale management
  const locale = useLocale();
  const t = useTranslations('HomePage');
  const router = useRouter();

  // Gallery popup state
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mobile gallery navigation state
  const [currentMobileImageIndex, setCurrentMobileImageIndex] = useState(0);
  
  // Mobile related articles navigation state
  const [currentRelatedArticleIndex, setCurrentRelatedArticleIndex] = useState(0);
  
  // Scroll share bar visibility state
  const [showScrollShareBar, setShowScrollShareBar] = useState(false);
  
  // Fetch all articles for the related articles section
  const { articles: allArticles, loading: articlesLoading, error: articlesError } = useArticles({
    pagination: { page: 1, pageSize: 4 },
    locale: locale
  });

  // Scroll detection for showing/hiding scroll share bar
  useEffect(() => {
    const handleScroll = () => {
      // Find the main article title (not the one in scroll share bar)
      const mainTitleElement = document.querySelector('main h1');
      const shareBarElement = document.querySelector('.share-bar');
      
      if (mainTitleElement && shareBarElement) {
        const titleRect = mainTitleElement.getBoundingClientRect();
        const shareBarRect = shareBarElement.getBoundingClientRect();
        
        // Show scroll share bar when both title and share bar are out of view
        const isTitleOutOfView = titleRect.bottom < 0;
        const isShareBarOutOfView = shareBarRect.bottom < 0;
        
        setShowScrollShareBar(isTitleOutOfView && isShareBarOutOfView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to check if content is HTML
  const isHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s);

  // Function to get translated category name
  const getTranslatedCategoryName = (categoryName) => {
    const categoryMap = {
      'Health': t('healthbt'),
      'Geography': t('geographybt'),
      'Events & Updates': t('eventbt'),
      'Innovation': locale === 'th' ? 'นวัตกรรม' : 'Innovation',
      // Add more category mappings as needed
    };
    return categoryMap[categoryName] || categoryName;
  };

  // Get category name (handle both object and string formats)
  const categoryName = typeof article.category === 'object' 
    ? article.category?.name 
    : article.category;

  const articleImage = article.cover?.url ? getStrapiMediaURL(article.cover.url) : null;

  // Handle back button with locale-aware navigation
  const handleBackClick = () => {
    router.push(`/${locale}/newslist`);
  };

  const handleCategoryClick = (categoryName) => {
    const translatedCategoryName = getTranslatedCategoryName(categoryName);
    router.push(`/${locale}/newslist?category=${encodeURIComponent(translatedCategoryName)}`);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <style jsx global>{`
        .related-articles-swiper {
          height: auto !important;
        }
        .related-articles-swiper .swiper-wrapper {
          align-items: stretch !important;
          height: auto !important;
        }
        .related-articles-swiper .swiper-slide {
          height: auto !important;
          display: flex !important;
        }
        .related-articles-swiper .swiper-slide > * {
          width: 100%;
          flex: 1;
        }
      `}</style>

        {/* Main Article Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Article Header Section */}
          <div className="mb-8">
            {/* Category Tag */}
            <div className="mb-4">
              <span 
              onClick={() => handleCategoryClick(typeof article.category === 'object' ? article.category.name : article.category || 'Innovation')}
              className="inline-block bg-white border border-gray-200 text-[#E60000] px-4 py-2 rounded-full text-[16px] font-normal cursor-pointer hover:bg-[#E60000] hover:text-white hover:border-[#E60000] transition-all duration-200">
                {getTranslatedCategoryName(typeof article.category === 'object' ? article.category.name : article.category || 'Innovation')}
              </span>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Separator Line */}
            <div className="w-full h-px bg-gray-200 mb-6"></div>

            {/* Date and Share Section */}
            <div className="flex justify-between items-center">
              {/* Date */}
              <div className="text-[#E60000] text-lg font-normal">
                {article.publishedAt 
                  ? formatDate(article.publishedAt, locale, 'D MMM YYYY')
                  : formatDate(new Date(), locale, 'D MMM YYYY')
                }
              </div>

              {/* Share Section */}
              <ShareBar 
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={article?.title}
                className="share-bar"
              />
            </div>
          </div>

          {/* Hero Image */}
          <div className="mb-8">
            {articleImage ? (
              <div className="relative w-full aspect-[3/2] overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={articleImage}
                  alt={article.title || (locale === 'th' ? 'รูปภาพบทความ' : 'Article image')}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/2] brounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {locale === 'th' ? 'ไม่มีรูปภาพ' : 'No Image Available'}
                </span>
              </div>
            )}
          </div>

        {/* Article Content */}
        {article.content && (
          <section className="mt-12">
            <div className="text-gray-900 font-fciconic"
            >
              {isHtml(article.content) ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-2" {...props} />
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
                      )}
                    </div>
          </section>
        )}


         {/* Article Gallery */}
         {article.gallery && article.gallery.length > 0 && (
           <section className="mt-12">
             {/* Mobile: Show current image */}
             <div className="block sm:hidden">
               {article.gallery.length > 0 && (() => {
                 const currentFile = article.gallery[currentMobileImageIndex];
                 const fileUrl = currentFile?.url || currentFile?.attributes?.url;
                 const fileName = currentFile?.name || currentFile?.attributes?.name || `Gallery image ${currentMobileImageIndex + 1}`;
                 const altText = currentFile?.alternativeText || currentFile?.attributes?.alternativeText || fileName;

                 if (!fileUrl) return null;

                 return (
                   <div className="relative">
                     <div
                       className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                       onClick={() => {
                         setSelectedImage({
                           url: getStrapiMediaURL(fileUrl),
                           alt: altText,
                           name: fileName
                         });
                         setCurrentImageIndex(currentMobileImageIndex);
                       }}
                     >
                       <img
                         src={getStrapiMediaURL(fileUrl)}
                         alt={altText}
                         className="block w-full aspect-[4/3] object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-110"
                         onError={(e) => {
                           console.error('Gallery image failed to load:', fileUrl);
                           e.target.style.display = 'none';
                         }}
                       />
                       {/* Hover overlay */}
                       <div 
                         className="absolute inset-0 transition-all duration-300 flex items-center justify-center"
                         style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                         onMouseEnter={(e) => {
                           e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                         }}
                         onMouseLeave={(e) => {
                           e.target.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                         }}
                       >
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                           </svg>
                         </div>
                       </div>
                     </div>

                        </div>
                      );
               })()}
             </div>

             {/* Desktop: Show grid */}
             <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-8">
              {article.gallery.map((file, index) => {
                            // Handle different file structure possibilities
                            const fileUrl = file?.url || file?.attributes?.url;
                const fileName = file?.name || file?.attributes?.name || `Gallery image ${index + 1}`;
                            const altText = file?.alternativeText || file?.attributes?.alternativeText || fileName;
                            
                            if (!fileUrl) {
                  console.warn('No URL found for gallery file:', file);
                              return null;
                            }
                            
                            return (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
                     onClick={() => {
                       setSelectedImage({
                         url: getStrapiMediaURL(fileUrl),
                         alt: altText,
                         name: fileName
                       });
                       setCurrentImageIndex(index);
                     }}
                  >
                    <div className="relative">
                                <img 
                                  src={getStrapiMediaURL(fileUrl)}
                                  alt={altText}
                      className="block w-full aspect-[4/3] object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-110"
                                  onError={(e) => {
                    console.error('Gallery image failed to load:', fileUrl);
                                    e.target.style.display = 'none';
                                  }}
                                />
                  {/* Hover overlay */}
                  <div 
                    className="absolute inset-0 transition-all duration-300 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    }}
                  >
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                  </div>
                                </div>
                                </div>
                              </div>
                            );
                          }).filter(Boolean)}
                        </div>

             {/* Navigation arrows below gallery - Desktop only */}
             {article.gallery.length > 1 && (
               <div className="flex justify-end items-center gap-4 mt-6 hidden sm:flex">
                 {/* Left arrow */}
                 <button
                   className="w-14 h-14 bg-transparent border-2 border-gray-400 rounded-full flex items-center justify-center text-gray-400 opacity-30 cursor-not-allowed"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="w-6 h-6">
                     <path d="M19 9.25C19.4142 9.25 19.75 9.58579 19.75 10C19.75 10.4142 19.4142 10.75 19 10.75V10V9.25ZM2.46967 10.5303C2.17678 10.2374 2.17678 9.76256 2.46967 9.46967L7.24264 4.6967C7.53553 4.40381 8.01041 4.40381 8.3033 4.6967C8.59619 4.98959 8.59619 5.46447 8.3033 5.75736L4.06066 10L8.3033 14.2426C8.59619 14.5355 8.59619 15.0104 8.3033 15.3033C8.01041 15.5962 7.53553 15.5962 7.24264 15.3033L2.46967 10.5303ZM19 10V10.75H3V10V9.25H19V10Z" fill="currentColor"/>
                   </svg>
                 </button>

                 {/* Right arrow */}
                 <button
                   className="w-14 h-14 bg-transparent border-2 border-gray-400 rounded-full flex items-center justify-center text-gray-400 opacity-30 cursor-not-allowed"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="w-6 h-6">
                     <path d="M2 9.25C1.58579 9.25 1.25 9.58579 1.25 10C1.25 10.4142 1.58579 10.75 2 10.75V10V9.25ZM18.5303 10.5303C18.8232 10.2374 18.8232 9.76256 18.5303 9.46967L13.7574 4.6967C13.4645 4.40381 12.9896 4.40381 12.6967 4.6967C12.4038 4.98959 12.4038 5.46447 12.6967 5.75736L16.9393 10L12.6967 14.2426C12.4038 14.5355 12.4038 15.0104 12.6967 15.3033C12.9896 15.5962 13.4645 15.5962 13.7574 15.3033L18.5303 10.5303ZM2 10V10.75H18V10V9.25H2V10Z" fill="currentColor"/>
                   </svg>
                 </button>
                      </div>
             )}

             {/* Navigation arrows below gallery - Mobile only */}
             {article.gallery.length > 1 && (
               <div className="flex items-center gap-4 mt-6 sm:hidden">
                 {/* Progress bar */}
                 <div className="flex-1 bg-gray-200 rounded-full h-2">
                   <div 
                     className="bg-[#E60000] h-2 rounded-full transition-all duration-300" 
                     style={{ width: `${((currentMobileImageIndex + 1) / article.gallery.length) * 100}%` }}
                   ></div>
                </div>

                 {/* Left arrow */}
                 <button
                   onClick={() => {
                     if (currentMobileImageIndex > 0) {
                       setCurrentMobileImageIndex(currentMobileImageIndex - 1);
                     }
                   }}
                   className={`w-14 h-14 bg-transparent border-2 rounded-full flex items-center justify-center text-gray-400 transition-all ${
                     currentMobileImageIndex > 0 
                       ? 'border-[#E60000] hover:bg-[#E60000] cursor-pointer' 
                       : 'border-gray-400 opacity-30 cursor-not-allowed'
                   }`}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="w-6 h-6">
                     <path d="M19 9.25C19.4142 9.25 19.75 9.58579 19.75 10C19.75 10.4142 19.4142 10.75 19 10.75V10V9.25ZM2.46967 10.5303C2.17678 10.2374 2.17678 9.76256 2.46967 9.46967L7.24264 4.6967C7.53553 4.40381 8.01041 4.40381 8.3033 4.6967C8.59619 4.98959 8.59619 5.46447 8.3033 5.75736L4.06066 10L8.3033 14.2426C8.59619 14.5355 8.59619 15.0104 8.3033 15.3033C8.01041 15.5962 7.53553 15.5962 7.24264 15.3033L2.46967 10.5303ZM19 10V10.75H3V10V9.25H19V10Z" fill="currentColor"/>
                   </svg>
                 </button>

                 {/* Right arrow */}
                 <button
                   onClick={() => {
                     if (currentMobileImageIndex < article.gallery.length - 1) {
                       setCurrentMobileImageIndex(currentMobileImageIndex + 1);
                     }
                   }}
                   className={`w-14 h-14 bg-transparent border-2 rounded-full flex items-center justify-center text-gray-400 transition-all ${
                     currentMobileImageIndex < article.gallery.length - 1 
                       ? 'border-[#E60000] hover:bg-[#E60000] cursor-pointer' 
                       : 'border-gray-400 opacity-30 cursor-not-allowed'
                   }`}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="w-6 h-6">
                     <path d="M2 9.25C1.58579 9.25 1.25 9.58579 1.25 10C1.25 10.4142 1.58579 10.75 2 10.75V10V9.25ZM18.5303 10.5303C18.8232 10.2374 18.8232 9.76256 18.5303 9.46967L13.7574 4.6967C13.4645 4.40381 12.9896 4.40381 12.6967 4.6967C12.4038 4.98959 12.4038 5.46447 12.6967 5.75736L16.9393 10L12.6967 14.2426C12.4038 14.5355 12.4038 15.0104 12.6967 15.3033C12.9896 15.5962 13.4645 15.5962 13.7574 15.3033L18.5303 10.5303ZM2 10V10.75H18V10V9.25H2V10Z" fill="currentColor"/>
                   </svg>
                 </button>
            </div>
          )}

             {/* Back to news list link */}
             <div className="pt-14 mt-8 flex items-center gap-2">
               <a
                 href={`/${locale}/newslist`}
                 className="inline-flex items-center text-[#E60000] underline underline-offset-3"
               >
                 <span className="text-[16px] font-[600]">
                   {t('newslist')}
                 </span>
               </a>
               <span className="text-[#f3e2c6] text-sm">•</span>
               <p className="text-[16px] text-gray-600">
               {article.title.length > 35 ? (
                 <>
                   <span className="block sm:hidden">{article.title.substring(0, 35) + '...'}</span>
                   <span className="hidden sm:block">{article.title}</span>
                 </>
               ) : article.title}
               </p>
             </div>
           </section>
         )}

      </main>

      {/* Related Articles Section - Separate Container */}
      <section className="py-16 pt-20">
        <div className="w-full px-4 sm:px-4 md:px-8 lg:px-18">
            <h2 className="font-semibold text-gray-900 mb-8 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              {locale === 'th' ? 'บทความที่เกี่ยวข้อง' : 'Our News & Articles'}
            </h2>
            
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : articlesError ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error loading articles: {articlesError}</p>
              </div>
            ) : allArticles?.length > 0 ? (
              <>
                {/* Mobile: Show articles with Swiper */}
                <div className="block md:hidden">
                  {(() => {
                    const filteredArticles = allArticles
                      .filter(relatedArticle => relatedArticle.id !== article.id)
                      .slice(0, 3);
                    
                    if (filteredArticles.length === 0) return null;
                    
                    return (
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
                        className="related-articles-swiper !h-auto"
                      >
                        {filteredArticles.map((relatedArticle, index) => (
                          <SwiperSlide key={relatedArticle.id} className="h-full">
                            <ArticlesCard
                              article={relatedArticle}
                              index={index}
                              locale={locale}
                              disableAnimation={true}
                              onCategoryClick={handleCategoryClick}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    );
                  })()}
                </div>

                {/* Tablet: Show articles with Swiper */}
                <div className="hidden md:block xl:hidden">
                  {(() => {
                    const filteredArticles = allArticles
                      .filter(relatedArticle => relatedArticle.id !== article.id)
                      .slice(0, 3);
                    
                    if (filteredArticles.length === 0) return null;
                    
                    return (
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
                        className="related-articles-swiper !h-auto"
                      >
                        {filteredArticles.map((relatedArticle, index) => (
                          <SwiperSlide key={relatedArticle.id} className="h-full">
                            <ArticlesCard
                              article={relatedArticle}
                              index={index}
                              locale={locale}
                              disableAnimation={true}
                              onCategoryClick={handleCategoryClick}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    );
                  })()}
                </div>

                {/* Desktop: Show grid */}
                <div className="hidden xl:grid grid-cols-1 xl:grid-cols-3 gap-10">
                  {allArticles
                    .filter(relatedArticle => relatedArticle.id !== article.id) // Exclude current article
                    .slice(0, 3) // Show max 3 articles
                    .map((relatedArticle, index) => (
                      <ArticlesCard
                        key={relatedArticle.id}
                        article={relatedArticle}
                        index={index}
                        locale={locale}
                        disableAnimation={true}
                        onCategoryClick={handleCategoryClick}
                      />
              ))}
            </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {locale === 'th' ? 'ไม่พบบทความที่เกี่ยวข้อง' : 'No related articles found'}
                </p>
              </div>
            )}
        </div>
      </section>

       {/* Image Popup Modal */}
       {selectedImage && (
         <div
           className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
           onClick={() => setSelectedImage(null)}
         >
           <div className="relative w-full h-full flex items-center justify-center">
             {/* Close button */}
             <button
               onClick={() => setSelectedImage(null)}
               className="absolute top-4 right-4 z-10 w-10 h-10 bg-transparent rounded-lg flex items-center justify-center text-white hover:bg-white hover:border-white hover:text-[#E60000] transition-all"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>

             {/* Left arrow - Desktop only */}
             {article.gallery && article.gallery.length > 1 && (
               <button
                 onClick={(e) => {
                   if (currentImageIndex > 0) {
                     e.stopPropagation();
                     const prevIndex = currentImageIndex - 1;
                     const prevFile = article.gallery[prevIndex];
                     const prevFileUrl = prevFile?.url || prevFile?.attributes?.url;
                     const prevFileName = prevFile?.name || prevFile?.attributes?.name || `Gallery image ${prevIndex + 1}`;
                     const prevAltText = prevFile?.alternativeText || prevFile?.attributes?.alternativeText || prevFileName;
                     
                     setSelectedImage({
                       url: getStrapiMediaURL(prevFileUrl),
                       alt: prevAltText,
                       name: prevFileName
                     });
                     setCurrentImageIndex(prevIndex);
                   }
                 }}
                 className={`absolute left-4 z-10 w-14 h-14 bg-transparent border-2 border-white rounded-full flex items-center justify-center text-white transition-all group hidden sm:flex image-popup-arrow ${
                   currentImageIndex > 0 
                     ? 'hover:bg-[#E60000] hover:border-white hover:w-15 hover:h-15 cursor-pointer' 
                     : 'opacity-30 cursor-not-allowed'
                 } sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto md:top-auto md:bottom-8 lg:top-auto lg:bottom-8 xl:top-1/2 xl:-translate-y-1/2`}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="w-6 h-6 group-hover:w-7 group-hover:h-7 transition-all">
                   <path d="M19 9.25C19.4142 9.25 19.75 9.58579 19.75 10C19.75 10.4142 19.4142 10.75 19 10.75V10V9.25ZM2.46967 10.5303C2.17678 10.2374 2.17678 9.76256 2.46967 9.46967L7.24264 4.6967C7.53553 4.40381 8.01041 4.40381 8.3033 4.6967C8.59619 4.98959 8.59619 5.46447 8.3033 5.75736L4.06066 10L8.3033 14.2426C8.59619 14.5355 8.59619 15.0104 8.3033 15.3033C8.01041 15.5962 7.53553 15.5962 7.24264 15.3033L2.46967 10.5303ZM19 10V10.75H3V10V9.25H19V10Z" fill="currentColor"/>
                 </svg>
               </button>
             )}

             {/* Right arrow - Desktop only */}
             {article.gallery && article.gallery.length > 1 && (
               <button
                 onClick={(e) => {
                   if (currentImageIndex < article.gallery.length - 1) {
                     e.stopPropagation();
                     const nextIndex = currentImageIndex + 1;
                     const nextFile = article.gallery[nextIndex];
                     const nextFileUrl = nextFile?.url || nextFile?.attributes?.url;
                     const nextFileName = nextFile?.name || nextFile?.attributes?.name || `Gallery image ${nextIndex + 1}`;
                     const nextAltText = nextFile?.alternativeText || nextFile?.attributes?.alternativeText || nextFileName;
                     
                     setSelectedImage({
                       url: getStrapiMediaURL(nextFileUrl),
                       alt: nextAltText,
                       name: nextFileName
                     });
                     setCurrentImageIndex(nextIndex);
                   }
                 }}
                 className={`absolute right-4 z-10 w-14 h-14 bg-transparent border-2 border-white rounded-full flex items-center justify-center text-white transition-all group hidden sm:flex image-popup-arrow ${
                   currentImageIndex < article.gallery.length - 1 
                     ? 'hover:bg-[#E60000] hover:border-white hover:w-15 hover:h-15 cursor-pointer' 
                     : 'opacity-30 cursor-not-allowed'
                 } sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto md:top-auto md:bottom-8 lg:top-auto lg:bottom-8 xl:top-1/2 xl:-translate-y-1/2`}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="w-6 h-6 group-hover:w-7 group-hover:h-7 transition-all">
                   <path d="M2 9.25C1.58579 9.25 1.25 9.58579 1.25 10C1.25 10.4142 1.58579 10.75 2 10.75V10V9.25ZM18.5303 10.5303C18.8232 10.2374 18.8232 9.76256 18.5303 9.46967L13.7574 4.6967C13.4645 4.40381 12.9896 4.40381 12.6967 4.6967C12.4038 4.98959 12.4038 5.46447 12.6967 5.75736L16.9393 10L12.6967 14.2426C12.4038 14.5355 12.4038 15.0104 12.6967 15.3033C12.9896 15.5962 13.4645 15.5962 13.7574 15.3033L18.5303 10.5303ZM2 10V10.75H18V10V9.25H2V10Z" fill="currentColor"/>
                 </svg>
               </button>
             )}

             {/* Image */}
             <div className="w-full max-w-2xl aspect-[3/2] bg-gray-800 rounded-lg overflow-hidden mx-16">
               <img
                 src={selectedImage.url}
                 alt={selectedImage.alt}
                 className="w-full h-full object-cover"
                 onClick={(e) => e.stopPropagation()}
               />
                      </div>

             {/* Image indicator */}
             {article.gallery && article.gallery.length > 1 && (
               <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full px-6 py-3" style={{ background: 'rgba(32, 57, 76, .8)' }}>
                 <p className="text-white text-base font-medium">
                   {currentImageIndex + 1}/{article.gallery.length}
                 </p>
                    </div>
             )}

             {/* Mobile navigation arrows - below pagination */}
             {article.gallery && article.gallery.length > 1 && (
               <div className="absolute bottom-22 left-4 right-4 flex items-center justify-between sm:hidden">
                 {/* Left arrow */}
                 <button
                   onClick={(e) => {
                     if (currentImageIndex > 0) {
                       e.stopPropagation();
                       const prevIndex = currentImageIndex - 1;
                       const prevFile = article.gallery[prevIndex];
                       const prevFileUrl = prevFile?.url || prevFile?.attributes?.url;
                       const prevFileName = prevFile?.name || prevFile?.attributes?.name || `Gallery image ${prevIndex + 1}`;
                       const prevAltText = prevFile?.alternativeText || prevFile?.attributes?.alternativeText || prevFileName;
                       
                       setSelectedImage({
                         url: getStrapiMediaURL(prevFileUrl),
                         alt: prevAltText,
                         name: prevFileName
                       });
                       setCurrentImageIndex(prevIndex);
                     }
                   }}
                   className={`w-12 h-12 bg-transparent border-2 border-white rounded-full flex items-center justify-center text-white transition-all ${
                     currentImageIndex > 0 
                       ? 'cursor-pointer' 
                       : 'opacity-30 cursor-not-allowed'
                   }`}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="w-5 h-5">
                     <path d="M19 9.25C19.4142 9.25 19.75 9.58579 19.75 10C19.75 10.4142 19.4142 10.75 19 10.75V10V9.25ZM2.46967 10.5303C2.17678 10.2374 2.17678 9.76256 2.46967 9.46967L7.24264 4.6967C7.53553 4.40381 8.01041 4.40381 8.3033 4.6967C8.59619 4.98959 8.59619 5.46447 8.3033 5.75736L4.06066 10L8.3033 14.2426C8.59619 14.5355 8.59619 15.0104 8.3033 15.3033C8.01041 15.5962 7.53553 15.5962 7.24264 15.3033L2.46967 10.5303ZM19 10V10.75H3V10V9.25H19V10Z" fill="currentColor"/>
                   </svg>
                 </button>

                 {/* Right arrow */}
                 <button
                   onClick={(e) => {
                     if (currentImageIndex < article.gallery.length - 1) {
                       e.stopPropagation();
                       const nextIndex = currentImageIndex + 1;
                       const nextFile = article.gallery[nextIndex];
                       const nextFileUrl = nextFile?.url || nextFile?.attributes?.url;
                       const nextFileName = nextFile?.name || nextFile?.attributes?.name || `Gallery image ${nextIndex + 1}`;
                       const nextAltText = nextFile?.alternativeText || nextFile?.attributes?.alternativeText || nextFileName;
                       
                       setSelectedImage({
                         url: getStrapiMediaURL(nextFileUrl),
                         alt: nextAltText,
                         name: nextFileName
                       });
                       setCurrentImageIndex(nextIndex);
                     }
                   }}
                   className={`w-12 h-12 bg-transparent border-2 border-white rounded-full flex items-center justify-center text-white transition-all ${
                     currentImageIndex < article.gallery.length - 1 
                       ? 'cursor-pointer' 
                       : 'opacity-30 cursor-not-allowed'
                   }`}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="w-5 h-5">
                     <path d="M2 9.25C1.58579 9.25 1.25 9.58579 1.25 10C1.25 10.4142 1.58579 10.75 2 10.75V10V9.25ZM18.5303 10.5303C18.8232 10.2374 18.8232 9.76256 18.5303 9.46967L13.7574 4.6967C13.4645 4.40381 12.9896 4.40381 12.6967 4.6967C12.4038 4.98959 12.4038 5.46447 12.6967 5.75736L16.9393 10L12.6967 14.2426C12.4038 14.5355 12.4038 15.0104 12.6967 15.3033C12.9896 15.5962 13.4645 15.5962 13.7574 15.3033L18.5303 10.5303ZM2 10V10.75H18V10V9.25H2V10Z" fill="currentColor"/>
                   </svg>
                 </button>
                  </div>
             )}
              </div>
            </div>
          )}

        {/* Scroll Share Bar */}
        {showScrollShareBar && (
          <ScrollShareBar
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={article?.title}
          />
        )}
      </div>
  );
}

