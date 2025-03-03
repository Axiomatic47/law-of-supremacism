// src/utils/browserDetection.ts

/**
 * Utility functions for browser detection and performance optimization
 */

/**
 * Detects if the current browser is Safari
 * @returns boolean
 */
export const isSafari = (): boolean => {
  // More sophisticated Safari detection including iOS Safari
  const ua = navigator.userAgent.toLowerCase();
  return (
    (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) ||
    // iOS detection
    (/iphone|ipad|ipod/.test(ua) && !window.MSStream)
  );
};

/**
 * Detects if running on iOS device
 * @returns boolean
 */
export const isIOS = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) && !window.MSStream;
};

/**
 * Detects if browser is Firefox
 * @returns boolean
 */
export const isFirefox = (): boolean => {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
};

/**
 * Detects if the device has limited memory (mobile devices)
 * @returns boolean
 */
export const isLowMemoryDevice = (): boolean => {
  // Check if device memory API is available
  if ('deviceMemory' in navigator) {
    // @ts-ignore - deviceMemory not in standard navigator type
    return navigator.deviceMemory < 4; // Less than 4GB is considered low memory
  }

  // Fallback to user agent detection for mobile devices
  const ua = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
};

/**
 * Creates optimized settings based on the current browser and device
 * @returns Object with optimized settings
 */
export const getOptimizedSettings = () => {
  const safari = isSafari();
  const ios = isIOS();
  const firefox = isFirefox();
  const lowMemory = isLowMemoryDevice();

  return {
    // Reduce pull distance for lower-memory devices or Safari
    maxPullDistance: (safari || lowMemory) ? 200 : 800,

    // Adjust animation smoothness
    animationDamping: safari ? 0.85 : 0.92,

    // Reduce blur intensity for Safari and low memory devices
    blurIntensity: (safari || lowMemory) ? 6 : 12,

    // Disable some effects entirely on low memory devices
    useAdvancedEffects: !lowMemory,

    // Firefox-specific tweaks
    useFixedPositioning: !firefox, // Firefox handles fixed positioning better than transforms

    // iOS Safari specific
    useSmoothScrolling: !ios, // iOS has its own smooth scrolling

    // Debug info
    browserInfo: {
      safari,
      ios,
      firefox,
      lowMemory,
      userAgent: navigator.userAgent
    }
  };
};

/**
 * Memory management utilities for preventing Safari memory leaks
 */
export const memoryOptimizations = {
  /**
   * Cleans up unused memory in Safari when page is hidden
   * Call this in visibilitychange event listener
   */
  cleanupOnHidden: () => {
    if (document.visibilityState === 'hidden' && isSafari()) {
      // Clear any image object URLs that might be in memory
      const images = document.querySelectorAll('img[src^="blob:"]');
      images.forEach(img => {
        if (img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }
      });

      // Force Safari to release some memory
      if (typeof window.gc === 'function') {
        // @ts-ignore - gc not in standard window type
        window.gc();
      }
    }
  },

  /**
   * Cleans up memory-intensive elements
   * Call this when removing elements with heavy animations/effects
   */
  releaseElementResources: (element: HTMLElement) => {
    // Remove event listeners
    const clone = element.cloneNode(false);
    if (element.parentNode) {
      element.parentNode.replaceChild(clone, element);
    }

    // Force a small garbage collection pause in Safari
    setTimeout(() => {
      if (typeof window.gc === 'function' && isSafari()) {
        // @ts-ignore
        window.gc();
      }
    }, 100);
  }
};

// Apply these optimizations when the document is loaded
export const applyBrowserOptimizations = () => {
  const optimizedSettings = getOptimizedSettings();

  // Add browser detection classes to document
  document.documentElement.classList.toggle('safari', optimizedSettings.browserInfo.safari);
  document.documentElement.classList.toggle('ios', optimizedSettings.browserInfo.ios);
  document.documentElement.classList.toggle('firefox', optimizedSettings.browserInfo.firefox);
  document.documentElement.classList.toggle('low-memory', optimizedSettings.browserInfo.lowMemory);

  // Set up visibility change handler for memory cleanup
  document.addEventListener('visibilitychange', memoryOptimizations.cleanupOnHidden);

  // Return settings for use in components
  return optimizedSettings;
};