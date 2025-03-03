// src/utils/navigationService.ts

import { isSafari, isIOS } from "@/utils/browserDetection";

/**
 * Navigation service that provides safe routing across browsers
 * with specific handling for Safari to prevent freezing
 */
export const navigationService = {
  /**
   * Navigates to a path safely, with special handling for Safari
   *
   * @param path The URL path to navigate to
   * @param routerNavigate The navigate function from react-router
   * @param options Additional navigation options
   */
  navigateTo: (
    path: string,
    routerNavigate: (path: string) => void,
    options: {
      forceReload?: boolean;
      delay?: number;
      beforeNavigate?: () => void;
      afterNavigate?: () => void;
    } = {}
  ) => {
    const {
      forceReload = false,
      delay = 50,
      beforeNavigate,
      afterNavigate
    } = options;

    // Call before navigation hook if provided
    if (beforeNavigate) {
      beforeNavigate();
    }

    // Determine if we need special handling
    const isSafariBrowser = isSafari();
    const isIOSDevice = isIOS();
    const needsSpecialHandling = isSafariBrowser || isIOSDevice || forceReload;

    // Perform the navigation
    if (needsSpecialHandling) {
      // For Safari and iOS, use a timeout and window.location for more reliable navigation
      setTimeout(() => {
        // Clear any in-progress animations or processing that could block the main thread
        cancelAnimationFrame(0);

        // Force all pending state updates to complete
        setTimeout(() => {
          // Use window.location.href for a complete page reload
          // This bypasses React Router's state management which can cause freezing in Safari
          window.location.href = path;

          // Call after navigation hook if provided
          if (afterNavigate) {
            afterNavigate();
          }
        }, 0);
      }, delay);
    } else {
      // For other browsers, use normal React Router navigation
      routerNavigate(path);

      // Call after navigation hook if provided
      if (afterNavigate) {
        setTimeout(() => {
          if (afterNavigate) {
            afterNavigate();
          }
        }, delay);
      }
    }
  },

  /**
   * Prepares the application for navigation
   * This can be called before navigation to clean up resources
   */
  prepareForNavigation: () => {
    // Clear any animations that might be in progress
    const highestId = setTimeout(() => {}, 0);
    for (let i = 0; i < 10; i++) {
      cancelAnimationFrame(i);
    }

    // Force a quick browser repaint to clear any visual glitches
    document.body.style.opacity = '0.99';
    document.body.offsetHeight; // Force reflow
    document.body.style.opacity = '1';

    // If we're in Safari, take additional steps to prevent freezing
    if (isSafari()) {
      // Reduce the complexity of the page during transition
      document.documentElement.classList.add('navigating');

      // Reduce backdrop-filter complexity during navigation
      document.querySelectorAll('.backdrop-blur-md, .backdrop-blur-sm').forEach(element => {
        (element as HTMLElement).style.backdropFilter = 'none';
        (element as HTMLElement).style.webkitBackdropFilter = 'none';
      });
    }
  },

  /**
   * Cleans up after navigation
   * This can be called after navigation completes
   */
  cleanupAfterNavigation: () => {
    // Remove the navigating class
    document.documentElement.classList.remove('navigating');

    // Restore backdrop filters
    document.querySelectorAll('.backdrop-blur-md').forEach(element => {
      (element as HTMLElement).style.backdropFilter = 'blur(8px)';
      (element as HTMLElement).style.webkitBackdropFilter = 'blur(8px)';
    });

    document.querySelectorAll('.backdrop-blur-sm').forEach(element => {
      (element as HTMLElement).style.backdropFilter = 'blur(4px)';
      (element as HTMLElement).style.webkitBackdropFilter = 'blur(4px)';
    });
  }
};