// src/components/hero/HeroButtons.tsx

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HeroButtons = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Simple Safari detection
    const ua = navigator.userAgent.toLowerCase();
    setIsSafari(
      ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1
    );
  }, []);

  const handleManuscriptClick = (e) => {
    if (isNavigating) return;

    // Mark as navigating to prevent multiple clicks
    setIsNavigating(true);

    // Add navigating class to document
    document.documentElement.classList.add('navigating');

    // For Safari: use direct location change instead of React Router
    if (isSafari) {
      // Use setTimeout to delay navigation, which helps Safari complete rendering
      setTimeout(() => {
        window.location.href = '/composition/manuscript';
      }, 50);
    } else {
      // For other browsers, use React Router
      navigate('/composition/manuscript');

      // Reset navigating state after a delay
      setTimeout(() => {
        setIsNavigating(false);
        document.documentElement.classList.remove('navigating');
      }, 300);
    }
  };

  const handleWorldMapClick = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    document.documentElement.classList.add('navigating');

    if (isSafari) {
      setTimeout(() => {
        window.location.href = '/worldmap';
      }, 50);
    } else {
      navigate('/worldmap');
      setTimeout(() => {
        setIsNavigating(false);
        document.documentElement.classList.remove('navigating');
      }, 300);
    }
  };

  const handleDataClick = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    document.documentElement.classList.add('navigating');

    if (isSafari) {
      setTimeout(() => {
        window.location.href = '/composition/data';
      }, 50);
    } else {
      navigate('/composition/data');
      setTimeout(() => {
        setIsNavigating(false);
        document.documentElement.classList.remove('navigating');
      }, 300);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-6">
      <Button
        variant="outline"
        className={`group relative w-[300px] bg-black/50 backdrop-blur-md border-2 border-white/20 text-white
                 hover:bg-black/60 hover:border-white/30 transition-all duration-300 py-7 text-lg font-medium
                 rounded-lg overflow-hidden ${isNavigating ? 'opacity-70 pointer-events-none' : ''}`}
        onClick={handleManuscriptClick}
        disabled={isNavigating}
        data-manuscript-button="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform
                      group-hover:scale-105 transition-transform duration-500"/>
        <span className="relative">
          {isNavigating ? 'Loading...' : 'Manuscript & White Papers'}
        </span>
      </Button>

      <Button
        variant="outline"
        className={`group relative w-[300px] bg-black/50 backdrop-blur-md border-2 border-white/20 text-white
                 hover:bg-black/60 hover:border-white/30 transition-all duration-300 py-7 text-lg font-medium
                 rounded-lg overflow-hidden ${isNavigating ? 'opacity-70 pointer-events-none' : ''}`}
        onClick={handleWorldMapClick}
        disabled={isNavigating}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform
                      group-hover:scale-105 transition-transform duration-500"/>
        <span className="relative">
          {isNavigating ? 'Loading...' : 'Supremacist World Map'}
        </span>
      </Button>

      <Button
        variant="outline"
        className={`group relative w-[300px] bg-black/50 backdrop-blur-md border-2 border-white/20 text-white
                 hover:bg-black/60 hover:border-white/30 transition-all duration-300 py-7 text-lg font-medium
                 rounded-lg overflow-hidden ${isNavigating ? 'opacity-70 pointer-events-none' : ''}`}
        onClick={handleDataClick}
        disabled={isNavigating}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform
                      group-hover:scale-105 transition-transform duration-500"/>
        <span className="relative">
          {isNavigating ? 'Loading...' : 'Data & Evidence'}
        </span>
      </Button>
    </div>
  );
};