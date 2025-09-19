/**
 * IconCircle Component
 * 
 * A reusable circular pagination indicator component with different states.
 * 
 * @param {number} width - Width of the icon (default: 12)
 * @param {number} height - Height of the icon (default: 12)
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Circle variant: 'active', 'inactive', 'hollow' (default: 'inactive')
 * @param {string} color - Color of the circle (default: auto-based on variant)
 * @param {Object} props - Additional props passed to the SVG element
 */
const IconCircle = ({ 
  width = 12, 
  height = 12, 
  className = "", 
  variant = "inactive",
  color = null,
  ...props 
}) => {
  // Define colors for different variants
  const getColor = () => {
    if (color) return color;
    
    switch (variant) {
      case 'active':
        return '#E60000'; // Red for active state
      case 'inactive':
        return '#9CA3AF'; // Gray for inactive state
      case 'hollow':
        return '#9CA3AF'; // Gray for hollow state
      default:
        return '#9CA3AF';
    }
  };

  // Define the SVG path based on variant
  const getPath = () => {
    const circleColor = getColor();
    
    switch (variant) {
      case 'active':
        // Circle inside circle - outer ring with inner solid circle
        return (
          <>
            <circle cx="6" cy="6" r="5" fill="none" stroke={circleColor} strokeWidth="1.5" />
            <circle cx="6" cy="6" r="2.5" fill={circleColor} />
          </>
        );
      case 'hollow':
        // Hollow gray circle (ring shape)
        return (
          <circle 
            cx="6" 
            cy="6" 
            r="5" 
            fill="none" 
            stroke={circleColor} 
            strokeWidth="1.5"
          />
        );
      case 'inactive':
      default:
        // Solid gray circle
        return (
          <circle cx="6" cy="6" r="5" fill={circleColor} />
        );
    }
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 12 12" 
      fill="none" 
      className={className}
      {...props}
    >
      {getPath()}
    </svg>
  );
};

export default IconCircle;
