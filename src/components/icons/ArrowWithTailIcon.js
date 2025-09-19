/**
 * ArrowWithTailIcon Component
 * 
 * A reusable arrow icon component with a tail (traditional arrow shape).
 * 
 * @param {number} width - Width of the icon (default: 16)
 * @param {number} height - Height of the icon (default: 16)
 * @param {string} className - Additional CSS classes
 * @param {string} color - Color of the arrow (default: currentColor)
 * @param {string} direction - Direction of the arrow: 'left' or 'right' (default: 'right')
 * @param {Object} props - Additional props passed to the SVG element
 */
const ArrowWithTailIcon = ({ 
  width = 16, 
  height = 16, 
  className = "", 
  color = "currentColor",
  borderColor = "none",
  direction = "right",
  ...props 
}) => {
  // Define paths for left and right arrows
  const rightArrowPath = "M2 9.25C1.58579 9.25 1.25 9.58579 1.25 10C1.25 10.4142 1.58579 10.75 2 10.75V10V9.25ZM18.5303 10.5303C18.8232 10.2374 18.8232 9.76256 18.5303 9.46967L13.7574 4.6967C13.4645 4.40381 12.9896 4.40381 12.6967 4.6967C12.4038 4.98959 12.4038 5.46447 12.6967 5.75736L16.9393 10L12.6967 14.2426C12.4038 14.5355 12.4038 15.0104 12.6967 15.3033C12.9896 15.5962 13.4645 15.5962 13.7574 15.3033L18.5303 10.5303ZM2 10V10.75H18V10V9.25H2V10Z";
  
  const leftArrowPath = "M19 9.25C19.4142 9.25 19.75 9.58579 19.75 10C19.75 10.4142 19.4142 10.75 19 10.75V10V9.25ZM2.46967 10.5303C2.17678 10.2374 2.17678 9.76256 2.46967 9.46967L7.24264 4.6967C7.53553 4.40381 8.01041 4.40381 8.3033 4.6967C8.59619 4.98959 8.59619 5.46447 8.3033 5.75736L4.06066 10L8.3033 14.2426C8.59619 14.5355 8.59619 15.0104 8.3033 15.3033C8.01041 15.5962 7.53553 15.5962 7.24264 15.3033L2.46967 10.5303ZM19 10V10.75H3V10V9.25H19V10Z";

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 21 21" 
      fill="none" 
      className={className}
      {...props}
    >
      <path 
        d={direction === "left" ? leftArrowPath : rightArrowPath}
        fill={color}
        stroke={borderColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowWithTailIcon;
