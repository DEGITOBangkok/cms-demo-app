'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive container logic
 * Returns container classes based on screen width ranges
 */
export const useResponsiveContainer = () => {
  const [containerClasses, setContainerClasses] = useState('');

  useEffect(() => {
    const updateContainerClasses = () => {
      const width = window.innerWidth;
      
      if (width > 663 && width < 1024) {
        // Tablet range: custom container logic
        setContainerClasses('mx-auto w-full px-6 lg:px-16 lg:ml-8');
      } else if (width >= 1024) {
        // Desktop
        setContainerClasses('mx-auto w-full px-4 md:px-8 lg:px-16');
      } else {
        // Mobile (≤ 663px)
        setContainerClasses('mx-auto w-full px-4 md:px-8 lg:px-16');
      }
    };

    // Set initial classes
    updateContainerClasses();

    // Add event listener for window resize
    window.addEventListener('resize', updateContainerClasses);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateContainerClasses);
    };
  }, []);

  return containerClasses;
};

/**
 * Custom hook specifically for banner content positioning
 * Returns positioning classes based on screen width ranges
 */
export const useBannerContentPosition = () => {
  const [positionClasses, setPositionClasses] = useState('');

  useEffect(() => {
    const updatePositionClasses = () => {
      const width = window.innerWidth;
      
      if (width > 663 && width < 1024) {
        // Tablet range: custom positioning
        setPositionClasses('absolute inset-x-0 bottom-20 md:bottom-24 lg:bottom-26');
      } else if (width >= 1024) {
        // Desktop
        setPositionClasses('absolute inset-x-0 bottom-16 md:bottom-24 lg:bottom-26');
      } else {
        // Mobile (≤ 663px)
        setPositionClasses('absolute inset-x-0 bottom-16 md:bottom-24 lg:bottom-26');
      }
    };

    // Set initial classes
    updatePositionClasses();

    // Add event listener for window resize
    window.addEventListener('resize', updatePositionClasses);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updatePositionClasses);
    };
  }, []);

  return positionClasses;
};

/**
 * Custom hook for banner aspect ratio based on screen width
 * Returns aspect ratio classes for specific screen ranges
 */
export const useBannerAspectRatio = () => {
  const [aspectClasses, setAspectClasses] = useState('');

  useEffect(() => {
    const updateAspectClasses = () => {
      const width = window.innerWidth;
      
      if (width >= 650 && width <= 798) {
        // 650-798px: Keep 1:1 aspect ratio (square)
        setAspectClasses('aspect-[1/1]');
      } else if (width >= 820 && width <= 1024) {
        // 820-1024px: iPad Air - 1:1 aspect ratio (square)
        setAspectClasses('aspect-[1.4/1]');
      } else if (width < 650) {
        // < 650px: Portrait aspect ratio
        setAspectClasses('aspect-[1/2]');
      } else {
        // > 1024px: Desktop aspect ratio
        setAspectClasses('aspect-[2/1] lg:aspect-[2/1]');
      }
    };

    // Set initial classes
    updateAspectClasses();

    // Add event listener for window resize
    window.addEventListener('resize', updateAspectClasses);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateAspectClasses);
    };
  }, []);

  return aspectClasses;
};

/**
 * Custom hook for mobile column layout (text, button, thumbnail in vertical column)
 * Returns layout classes based on screen width
 */
export const useMobileColumnLayout = () => {
  const [layoutClasses, setLayoutClasses] = useState('');

  useEffect(() => {
    const updateLayoutClasses = () => {
      const width = window.innerWidth;
      
      if (width <= 600) {
        // Small mobile: Minimal spacing to reduce bottom space
        setLayoutClasses('flex flex-col items-center space-y-4');
      } else if (width < 769) {
        // Mobile column layout: text, button vertically aligned (thumbnails positioned separately)
        setLayoutClasses('flex flex-col items-center space-y-12');
      } else {
        // Desktop layout: horizontal with text on left, thumbnails on right
        setLayoutClasses('flex w-full justify-between items-end');
      }
    };

    // Set initial classes
    updateLayoutClasses();

    // Add event listener for window resize
    window.addEventListener('resize', updateLayoutClasses);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateLayoutClasses);
    };
  }, []);

  return layoutClasses;
};

/**
 * Custom hook for banner bottom padding based on screen width
 * Returns padding classes for specific screen ranges
 */
export const useBannerBottomPadding = () => {
  const [paddingClasses, setPaddingClasses] = useState('');

  useEffect(() => {
    const updatePaddingClasses = () => {
      const width = window.innerWidth;
      
      if (width <= 600) {
        // Screen size 600px and below: No bottom padding
        setPaddingClasses('');
      } else if (width <= 648) {
        // Screen size 601px - 648px: Small bottom padding
        setPaddingClasses('pb-1');
      } else if (width > 648 && width < 1024) {
        // 649px - 1023px: Medium bottom padding
        setPaddingClasses('pb-1');
      } else {
        // 1024px and above: Desktop padding
        setPaddingClasses('lg:pb-8');
      }
    };

    // Set initial classes
    updatePaddingClasses();

    // Add event listener for window resize
    window.addEventListener('resize', updatePaddingClasses);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updatePaddingClasses);
    };
  }, []);

  return paddingClasses;
};

/**
 * Custom hook for thumbnail top margin based on screen width
 * Returns margin classes for specific screen ranges
 */
export const useThumbnailTopMargin = () => {
  const [marginClasses, setMarginClasses] = useState('');

  useEffect(() => {
    const updateMarginClasses = () => {
      const width = window.innerWidth;
      
      if (width <= 648) {
        // Screen size 648px and below: Small top margin
        setMarginClasses('mt-4');
      } else if (width > 648 && width < 1024) {
        // 649px - 1023px: Large top margin to push thumbnails down
        setMarginClasses('mt-[120px]');
      } else {
        // 1024px and above: No top margin (desktop layout)
        setMarginClasses('');
      }
    };

    // Set initial classes
    updateMarginClasses();

    // Add event listener for window resize
    window.addEventListener('resize', updateMarginClasses);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateMarginClasses);
    };
  }, []);

  return marginClasses;
};

/**
 * Custom hook for thumbnail positioning based on screen width ranges
 * Returns positioning classes for specific screen ranges
 */
export const useThumbnailPositioning = () => {
  const [positionClasses, setPositionClasses] = useState('');

  useEffect(() => {
    const updatePositionClasses = () => {
      const width = window.innerWidth;
      
      if (width >= 650 && width <= 798) {
        // 650-798px: Move thumbnails below explore button
        setPositionClasses('lg:hidden flex justify-center space-x-4 mt-12');
      } else if (width < 650) {
        // < 650px: Use CSS positioning
        setPositionClasses('lg:hidden flex justify-center space-x-4 mobile-thumbnails');
      } else {
        // > 798px: Desktop layout
        setPositionClasses('hidden lg:block flex space-x-6');
      }
    };

    // Set initial classes
    updatePositionClasses();

    // Add event listener for window resize
    window.addEventListener('resize', updatePositionClasses);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updatePositionClasses);
    };
  }, []);

  return positionClasses;
};

/**
 * Custom hook for main content padding based on screen width
 * Returns padding classes for specific screen ranges
 */
export const useMainContentPadding = () => {
  const [paddingClasses, setPaddingClasses] = useState('');

  useEffect(() => {
    const updatePaddingClasses = () => {
      const width = window.innerWidth;
      
      if (width < 1330) {
        // Below 1320px: Reduced padding
        setPaddingClasses('px-4 md:px-14 xl:px-16');
      } else {
        // 1320px and above: Full padding
        setPaddingClasses('px-4 md:px-8 xl:px-44');
      }
    };

    // Set initial classes
    updatePaddingClasses();

    // Add event listener for window resize
    window.addEventListener('resize', updatePaddingClasses);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updatePaddingClasses);
    };
  }, []);

  return paddingClasses;
};
