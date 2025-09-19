/**
 * ArrowIcon Component
 * 
 * A reusable arrow icon component that can be customized with different sizes and colors.
 * 
 * @param {number} width - Width of the icon (default: 16)
 * @param {number} height - Height of the icon (default: 16)
 * @param {string} className - Additional CSS classes
 * @param {string} color - Color of the arrow (default: currentColor)
 * @param {Object} props - Additional props passed to the SVG element
 */
const ArrowIcon = ({ 
  width = 16, 
  height = 16, 
  className = "", 
  color = "currentColor",
  ...props 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      {...props}
    >
      <path 
        d="M8.75 19.25L16.25 11.75L8.75 4.25" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowIcon;
