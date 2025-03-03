// src/components/PageLayout.tsx - Optimized for Safari

import React, { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxPullDistance?: number;
}

export const PageLayout = ({
  children,
  className = '',
  maxPullDistance = 300 // Reduced from 800 for better performance
}: PageLayoutProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const lastScrollY = useRef(0);
  const isScrolling = useRef(false);
  const animationFrame = useRef<number>();
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Throttle state to reduce Safari re-renders
  const [throttledPullDistance, setThrottledPullDistance] = useState(0);
  const throttleTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Use throttled pull distance for rendering
  useEffect(() => {
    if (throttleTimeout.current) {
      clearTimeout(throttleTimeout.current);
    }

    throttleTimeout.current = setTimeout(() => {
      setThrottledPullDistance(pullDistance);
    }, 16); // ~60fps

    return () => {
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [pullDistance]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      const element = contentRef.current;
      const isAtTop = window.scrollY === 0;
      const isAtBottom = element &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
        isScrolling.current = true;

        // Smoother pull calculation for Safari
        setPullDistance(prev => {
          const newPull = Math.min(Math.max(prev - e.deltaY, -maxPullDistance), maxPullDistance);
          // Reduce sensitivity for small movements
          return Math.abs(newPull) < 5 ? 0 : newPull;
        });

        scrollTimeout.current = setTimeout(() => {
          isScrolling.current = false;
          startReturnAnimation();
        }, 120);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Cancel any ongoing animation first
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }

      lastScrollY.current = e.touches[0].clientY;
      isScrolling.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Safari-specific optimization - only process every other touch move event
      if (e.timeStamp % 2 !== 0) return;

      const element = contentRef.current;
      const isAtTop = window.scrollY === 0;
      const isAtBottom = element &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

      if (isAtTop || isAtBottom) {
        const deltaY = e.touches[0].clientY - lastScrollY.current;
        const direction = isAtTop ? 1 : -1;

        if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
          e.preventDefault();

          // Apply damping factor to make movement smoother
          const dampingFactor = 1.2;
          setPullDistance(prev => {
            const newPull = Math.min(
              Math.max(prev + (deltaY * direction) / dampingFactor, -maxPullDistance),
              maxPullDistance
            );
            // Threshold to prevent jittery small movements
            return Math.abs(newPull) < 5 ? 0 : newPull;
          });
        }
        lastScrollY.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      isScrolling.current = false;
      startReturnAnimation();
    };

    const startReturnAnimation = () => {
      if (!isScrolling.current) {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }

        // More efficient animation for Safari
        const animate = () => {
          if (isScrolling.current) {
            cancelAnimationFrame(animationFrame.current!);
            return;
          }

          setPullDistance(prev => {
            if (Math.abs(prev) < 2) return 0;
            // Use a faster decay for Safari - 0.85 instead of 0.92
            const newDistance = prev * 0.85;
            animationFrame.current = requestAnimationFrame(animate);
            return newDistance;
          });
        };

        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    // Add passive: false only where needed to improve Safari scroll performance
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [maxPullDistance]);

  // Cache the style objects to prevent unnecessary recalculations in Safari
  const contentStyle = {
    transform: `translateY(${throttledPullDistance}px)`,
    transition: pullDistance === 0 && !isScrolling.current
      ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' // Shorter transition for Safari
      : 'none',
  };

  const overlayStyle = {
    opacity: Math.max(0.3, 0.85 - (Math.abs(throttledPullDistance) / maxPullDistance)),
    zIndex: -1,
  };

  return (
    <>
      {/* Fixed background - use will-change sparingly for Safari */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/balance-scales.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -2,
          willChange: 'transform', // Help with Safari rendering
        }}
      />

      {/* Fixed overlay with optimized style */}
      <div
        className="fixed inset-0 w-full h-full bg-black/75 transition-opacity duration-300"
        style={overlayStyle}
      />

      {/* Fixed header with pull distance prop */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header pullDistance={throttledPullDistance} maxPullDistance={maxPullDistance} />
      </div>

      {/* Elastic content with optimized transform */}
      <div
        ref={contentRef}
        className="min-h-screen flex flex-col pt-16 pb-16"
        style={contentStyle}
      >
        <main className={`${className} flex-grow relative z-10 pt-8`}>
          {children}
        </main>
      </div>

      {/* Fixed footer with pull distance prop */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer pullDistance={throttledPullDistance} maxPullDistance={maxPullDistance} />
      </div>
    </>
  );
};

export default PageLayout;