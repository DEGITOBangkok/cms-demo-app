'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

/**
 * SortBox Component
 * 
 * A sort selection component built with Tailwind CSS that matches the specified design:
 * - display: flex
 * - padding: 8px 16px
 * - align-items: center
 * - gap: 4px
 * 
 * @param {Array} options - Array of sort options with {value, label} structure
 * @param {string} value - Currently selected value
 * @param {function} onChange - Callback function when selection changes
 * @param {string} placeholder - Placeholder text for the select
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const SortBox = ({ 
  options = [],
  value = "",
  onChange,
  placeholder,
  className = "",
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const t = useTranslations('HomePage');

  // Prevent body scroll when modal is open on mobile only
  useEffect(() => {
    // Only prevent scrolling on mobile (below sm breakpoint)
    const isMobile = window.innerWidth < 640; // sm breakpoint is 640px
    
    if (isOpen && isMobile) {
      // Store current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else if (!isOpen && isMobile) {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);
  const handleOptionClick = (optionValue) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    if (onChange) {
      onChange(optionValue);
    }
  };

  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <div 
      className={`flex items-center gap-1 w-full sm:w-auto ${className}`}
      {...props}
    >
      
      {/* Custom Dropdown */}
      <div className="relative w-full sm:w-auto cursor-pointer">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full sm:w-[120px] h-[40px] px-4 py-2 text-sm bg-white border border-[#000000] rounded-md shadow-sm hover:border-[#E60000] focus:border-[#E60000] transition-colors cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="text-left text-gray-900 text-[16px] flex-1 min-w-0">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Desktop Dropdown Options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg hidden sm:block overflow-hidden">
            <ul className="text-sm text-gray-900" role="listbox">
              {options.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`px-3 py-2 cursor-pointer transition-colors duration-200 ${
                    selectedValue === option.value 
                      ? 'bg-[#E60000] text-white hover:bg-[#E60000]' 
                      : 'hover:bg-gray-100'
                  } ${
                    index === 0 ? 'rounded-t-md' : ''
                  } ${
                    index === options.length - 1 ? 'rounded-b-md' : ''
                  }`}
                  role="option"
                  aria-selected={selectedValue === option.value}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Modal */}
      {isOpen && (
        <>
          {/* Backdrop Overlay - แยกออกมาเป็น element ต่างหาก */}
          <div 
            className="fixed inset-0 z-40 sm:hidden" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg sm:hidden transform transition-transform duration-400 ease-out animate-[slideUp_0.3s_ease-out_forwards]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Sort</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <ul className="space-y-2">
                {options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      selectedValue === option.value 
                        ? 'bg-[#E60000] text-white hover:bg-[#E60000]' 
                        : 'hover:bg-gray-100 text-gray-900'
                    }`}
                    role="option"
                    aria-selected={selectedValue === option.value}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Desktop Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 hidden sm:block" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SortBox;
