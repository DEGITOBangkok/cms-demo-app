'use client';

/**
 * TagsCapsule Component
 * 
 * A tags filter component built with Tailwind CSS that matches the specified design:
 * - display: flex
 * - padding: 0 64px
 * - align-items: center
 * - gap: 8px
 * - align-self: stretch
 * 
 * @param {Array} categories - Array of Strapi category objects
 * @param {string} selectedCategory - Currently selected category slug or id
 * @param {function} onCategoryChange - Callback function when category selection changes
 * @param {Array} articles - Array of articles for counting (optional)
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const TagsCapsule = ({ 
  categories = [],
  selectedCategory = '',
  onCategoryChange,
  articles = [],
  className = "",
  ...props 
}) => {
  const handleCategoryClick = (categorySlug) => {
    if (onCategoryChange) {
      onCategoryChange(categorySlug);
    }
  };

  // Helper function to count articles for a specific category
  const getCategoryCount = (categorySlug) => {
    if (!categorySlug || !articles.length) return 0;
    
    return articles.filter(article => {
      const articleCategory = article.category;
      
      // Handle category relation object
      if (typeof articleCategory === 'object') {
        return articleCategory.slug === categorySlug ||
               articleCategory.id === categorySlug ||
               articleCategory.name === categorySlug;
      }
      
      // Handle string category format (fallback)
      return articleCategory === categorySlug;
    }).length;
  };

  return (
    <div 
      className={`flex flex-wrap items-center gap-3 sm:gap-4 self-stretch animate-[fadeInSlideLeft_0.6s_ease-out_forwards] ${className}`}
      {...props}
    >
      {categories.map((category, index) => {
        // Handle both Strapi v4 and v5 data structures
        const categoryData = category.attributes || category;
        // For "All" option, keep empty string, don't fallback to category-${index}
        const categorySlug = categoryData.slug !== undefined ? categoryData.slug : 
                           (categoryData.id !== undefined ? categoryData.id : 
                           (index === 0 ? '' : `category-${index}`));
        const categoryName = categoryData.name || categoryData.title || `Category ${categoryData.id}`;
        
        return (
          <button
            key={categorySlug !== '' ? categorySlug : `all-${index}`}
            onClick={() => handleCategoryClick(categorySlug)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 border flex-shrink-0`}
            style={{
              backgroundColor: selectedCategory === categorySlug ? '#FCE5E5' : '#FFFFFF', // เทาอ่อน
              borderColor: selectedCategory === categorySlug ? '#E60000' : '#D1D5DB',
              color: selectedCategory === categorySlug ? '#E60000' : 'black', // border color: highlight or gray-300
              borderWidth: '2px',
              borderStyle: 'solid'
            }}
          >
            {categoryName}
          </button>
        );
      })}
    </div>
  );
};

export default TagsCapsule;
