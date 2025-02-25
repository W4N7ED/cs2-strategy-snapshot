
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MapDetail from "./pages/MapDetail";
import UtilityList from "./pages/UtilityList";
import StrategyList from "./pages/StrategyList";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Vérifier si le message a déjà été affiché
    const hasShownWarning = localStorage.getItem("hasShownMobileWarning");
    
    // Si le message n'a pas été affiché et que l'appareil n'est pas mobile
    if (!hasShownWarning) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) {
        toast({
          title: "Application CS2 Strategy Snapshot",
          description: "Cette application est optimisée pour mobile. Certaines fonctionnalités comme l'accès à la caméra peuvent ne pas être disponibles sur le web."
        });
      }
      
      // Marquer que le message a été affiché
      localStorage.setItem("hasShownMobileWarning", "true");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/maps/:mapId" element={<MapDetail />} />
            <Route path="/maps/:mapId/utilities/:utilityType" element={<UtilityList />} />
            <Route path="/maps/:mapId/strategies" element={<StrategyList />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
