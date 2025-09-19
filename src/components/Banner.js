'use client';

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
  ...rest
}) => {
  // Determine which image to display
  const displayImage = images.length > 0 
    ? images[currentSlide] 
    : backgroundImage;

  const backgroundStyle = displayImage
    ? {
        backgroundImage: `url(${displayImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <div
      className={`flex w-full h-[950px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[720px] justify-center items-center flex-shrink-0 relative ${className}`}
      style={backgroundStyle}
      {...rest}
    >
      {displayImage && <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/70 to-[#20394C]/0" />}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default Banner;

