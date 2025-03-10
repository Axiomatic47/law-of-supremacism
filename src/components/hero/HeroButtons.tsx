// src/components/hero/HeroButtons.tsx

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-6 flex-wrap">
      <Button
        variant="outline"
        className="group relative w-[300px] bg-black/50 backdrop-blur-md border-2 border-white/20 text-white
                 hover:bg-black/60 hover:border-white/30 transition-all duration-300 py-7 text-lg font-medium
                 rounded-lg overflow-hidden"
        onClick={() => navigate("/composition/manuscript")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform
                      group-hover:scale-105 transition-transform duration-500"/>
        <span className="relative">Manuscript & White Papers</span>
      </Button>

      <Button
        variant="outline"
        className="group relative w-[300px] bg-black/50 backdrop-blur-md border-2 border-white/20 text-white
                 hover:bg-black/60 hover:border-white/30 transition-all duration-300 py-7 text-lg font-medium
                 rounded-lg overflow-hidden"
        onClick={() => navigate("/worldmap")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform
                      group-hover:scale-105 transition-transform duration-500"/>
        <span className="relative">Supremacist World Map</span>
      </Button>

      <Button
        variant="outline"
        className="group relative w-[300px] bg-black/50 backdrop-blur-md border-2 border-white/20 text-white
                 hover:bg-black/60 hover:border-white/30 transition-all duration-300 py-7 text-lg font-medium
                 rounded-lg overflow-hidden"
        onClick={() => navigate("/composition/data")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform
                      group-hover:scale-105 transition-transform duration-500"/>
        <span className="relative">Data & Evidence</span>
      </Button>

      <Button
        variant="outline"
        className="group relative w-[300px] bg-black/50 backdrop-blur-md border-2 border-white/20 text-white
                 hover:bg-black/60 hover:border-white/30 transition-all duration-300 py-7 text-lg font-medium
                 rounded-lg overflow-hidden"
        onClick={() => navigate("/individuals-metrics")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform
                      group-hover:scale-105 transition-transform duration-500"/>
        <span className="relative">Individual Supremacism Metrics</span>
      </Button>
    </div>
  );
};