'use client';

import { getStrapiMediaURL } from '../lib/api';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { formatDate } from '../lib/day';
import { ArrowIcon } from './icons';

/**
 * ArticlesCard Component
 * 
 * A reusable article card component that displays article information
 * with image, title, description, tags, and author.
 * 
 * @param {Object} article - Article data object
 * @param {number} index - Index of the article in the list (for gradient colors)
 * @param {string} className - Additional CSS classes
 * @param {Function} onCategoryClick - Callback function for category/tag clicks
 * @param {string} locale - Current locale for navigation
 * @param {Object} props - Additional props passed to the article element
 */
const ArticlesCard = ({
  article,
  index = 0,
  className = "",
  onCategoryClick,
  locale = 'en',
  disableAnimation = false,
  ...props
}) => {
  const t = useTranslations('HomePage');
  const router = useRouter();
  
  if (!article) return null;

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

  // Get category name (handle both object and string formats)
  const categoryName = typeof article.category === 'object'
    ? article.category?.name
    : article.category;

  const articleImage = article.cover?.url
    ? getStrapiMediaURL(article.cover.url)
    : null;


  const handleClick = () => {
    router.push(`/${locale}/newsdesc/${article.slug}`);
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation(); // Prevent the article click from firing
    if (categoryName && onCategoryClick) {
      // Use the onCategoryClick prop instead of router.push to avoid page scroll
      onCategoryClick(categoryName);
    }
  };

  return (
    <article
      className={`bg-white rounded-t-2xl relative h-full flex flex-col group border-b border-gray-200 mt-5 ${
        disableAnimation 
          ? '' 
          : 'opacity-0 -translate-y-8 animate-[fadeInSlideUp_0.6s_ease-out_forwards]'
      } ${className}`}
      style={disableAnimation ? {} : { animationDelay: `${index * 0.3}s` }}
      onClick={handleClick}
      {...props}
    >
      {/* Category Capsule in top left */}
      {categoryName && (
         <span
              onClick={handleCategoryClick}
              className="
               absolute top-3 left-3 z-10
               inline-flex items-center
               px-6 py-2 rounded-full text-base
               cursor-pointer
         
               /* พื้นหลังโปร่งใส + เบลอ */
               bg-slate-900/30 text-white
               backdrop-blur-md
               hover:bg-[#FCE5E5] hover:text-[#E60000] hover:border-2 hover:border-[#E60000]

               /* font-size */
               text-[15px]
               font-extralight
             ">
              {getTranslatedCategoryName(categoryName)}
            </span>
      )}

      {articleImage ? (
        <div className="relative overflow-hidden aspect-[4/3] w-full rounded-t-2xl">
          <img
            src={articleImage}
            alt={article.title || 'Article image'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-110 cursor-pointer"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      ) : (
        <div className="relative overflow-hidden aspect-[3/4] w-full rounded-t-2xl bg-gradient-to-r from-blue-400 to-purple-600 cursor-pointer">
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      )}

      <div className="p-6 flex flex-col justify-between flex-1">
        {/* Date */}
        <div className="mb-2">
          <span className="text-[#E60000] text-base font-extralight"
          >
            {article.publishedAt
              ? formatDate(article.publishedAt, locale, 'D MMM YYYY')
              : formatDate(new Date(), locale, 'D MMM YYYY')}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-4 transition-colors text-black line-clamp-2 cursor-pointer">
          {article.title}
        </h3>

        <div style={{ height: '2rem' }}></div>
        <button onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
          className="flex items-center space-x-3 group"
        >
          {/* ข้อความ */}
          <span className="text-[#E60000] font-semibold text-lg text-[14px] cursor-pointer">
            {t('readmore')}
          </span>

          {/* Arrow */}
            <ArrowIcon 
              width={16} 
              height={16} 
              className="text-[#E60000] group-hover:rotate-180 transition-transform duration-300"
            />
        </button>
      </div>
    </article>
  );
};

export default ArticlesCard;
