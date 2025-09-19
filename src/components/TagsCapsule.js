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
 * @param {Array} tags - Array of tag options with {value, label} structure
 * @param {string} selectedTag - Currently selected tag value
 * @param {function} onTagChange - Callback function when tag selection changes
 * @param {Array} articles - Array of articles for counting (optional)
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const TagsCapsule = ({ 
  tags = [],
  selectedTag = '',
  onTagChange,
  articles = [],
  className = "",
  ...props 
}) => {
  const handleTagClick = (tagValue) => {
    if (onTagChange) {
      onTagChange(tagValue);
    }
  };

  // Helper function to count articles for a specific tag
  const getTagCount = (tagValue) => {
    if (!tagValue || !articles.length) return 0;
    
    return articles.filter(article => {
      const articleTags = article.tags?.toLowerCase() || '';
      const tagLower = tagValue.toLowerCase();
      
      // First try exact match
      if (articleTags === tagLower) return true;
      
      // Then try splitting by commas and check for exact matches
      const tagArray = articleTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tagArray.some(tag => tag === tagLower)) return true;
      
      // Finally try partial matching for compound tags like "Events & Updates"
      return tagArray.some(tag => tag.includes(tagLower));
    }).length;
  };

  return (
    <div 
      className={`flex flex-wrap items-center gap-3 sm:gap-4 self-stretch animate-[fadeInSlideLeft_0.6s_ease-out_forwards] ${className}`}
      {...props}
    >
      {tags.map((tag) => (
        <button
          key={tag.value}
          onClick={() => handleTagClick(tag.value)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 border flex-shrink-0`}
          style={{
            backgroundColor: selectedTag === tag.value ? '#FCE5E5' : '#FFFFFF', // เทาอ่อน
            borderColor: selectedTag === tag.value ? '#E60000' : '#D1D5DB',
            color: selectedTag === tag.value ? '#E60000' : 'black', // border color: highlight or gray-300
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
};

export default TagsCapsule;
