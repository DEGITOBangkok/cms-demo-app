'use client';

import React, { useMemo } from 'react';

/**
 * Banner Component
 * 
 * A banner component built with Tailwind CSS that matches the specified design:
 * - display: flex
 * - width: 1440px
 * - height: 720px
 * - justify-content: center
 * - align-items: center
 * - flex-shrink: 0
 * 
 * @param {React.ReactNode} children - Content to display inside the banner
 * @param {Array} images - Array of image URLs for slider
 * @param {number} currentSlide - Current slide index for image slider
 * @param {string} backgroundImage - URL for single background image (fallback)
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const Banner = ({
  children,
  images = [],
  currentSlide = 0,
  backgroundImage,
  className = '',
  variant = 'home', // 'home' or 'newslist'
  hasVideo = false, // New prop to detect if video is present
  ...rest
}) => {
  // Determine which image to display
  const displayImage = useMemo(() => {
    return images.length > 0 
      ? images[currentSlide] 
      : backgroundImage;
  }, [images, currentSlide, backgroundImage]);

  // No longer using backgroundStyle since we'll use img element

  // Different styles for different banner variants
  const baseClasses = useMemo(() => {
    if (variant === 'newslist') {
      return "flex w-full h-[1200px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] justify-start sm:justify-center items-center flex-shrink-0 relative z-10";
    } else {
      // Default 'home' variant with current styling
      return "flex w-full pb-16 lg:pb-2 md:pb-3 h-[1200px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] justify-start sm:justify-center items-center flex-shrink-0 relative z-20";
    }
  }, [variant]);

  const combinedClassName = useMemo(() => {
    return className ? `${baseClasses} ${className}` : baseClasses;
  }, [baseClasses, className]);

  return (
    <div
      className={combinedClassName}
      {...rest}
    >
      {displayImage && !hasVideo && (
        <img 
          src={displayImage} 
          alt="Banner background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {displayImage && <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/70 to-[#20394C]/0" />}
      <div className="relative z-10 w-full h-full overflow-visible">{children}</div>
    </div>
  );
};

export default Banner;