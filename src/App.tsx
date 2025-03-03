// src/App.tsx - With Safari optimizations
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import Index from "./pages/Index";
import CompositionsPage from "./pages/CompositionsPage";
import SectionPage from "./pages/SectionPage";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import Donate from "./pages/Donate";
import WorldMap from "./pages/WorldMap";
import DebugPage from "./pages/Debug";
import AdminLink from "./components/AdminLink";
import { applyBrowserOptimizations } from "./utils/browserDetection";

// Configure with reduced defaults for React Query to help Safari
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Reduce unnecessary fetches in Safari
      staleTime: 1000 * 60 * 5, // 5 minutes - longer stale time for Safari
      cacheTime: 1000 * 60 * 30, // 30 minutes - helps Safari memory management
      retry: 1, // Fewer retries to reduce network load
    },
  },
});

const AdminPage = () => {
  useEffect(() => {
    window.location.href = '/admin/index.html';
  }, []);

  return null;
};

// Browser optimization component
const BrowserOptimizer = ({ children }: { children: React.ReactNode }) => {
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Apply optimizations on mount
    applyBrowserOptimizations();
    setIsOptimized(true);

    // Cleanup on page unload - helps prevent Safari memory leaks
    const beforeUnloadHandler = () => {
      // Clear any timeouts, intervals, or animation frames
      const highestTimeoutId = setTimeout(() => {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
      }

      // Force cleanup any large objects in memory
      // @ts-ignore - clear global references that might be keeping memory allocated
      window.__REACT_QUERY_PROVIDER__ = null;
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  if (!isOptimized) {
    // Return a simpler loading state to avoid rendering complexity during optimization
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => (
  <BrowserOptimizer>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Index />} />

            {/* Collection listing pages */}
            <Route path="/composition/:compositionId" element={<CompositionsPage />} />

            {/* Section page with proper route parameters */}
            <Route
              path="/composition/:compositionId/composition/:compositionIndex/section/:sectionId"
              element={<SectionPage />}
            />

            {/* Additional pages */}
            <Route path="/worldmap" element={<WorldMap />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/admin/*" element={<AdminPage />} />

            {/* Debug route */}
            <Route path="/debug" element={<DebugPage />} />
          </Routes>

          {/* Admin Link for development */}
          <AdminLink />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserOptimizer>
);

export default App;