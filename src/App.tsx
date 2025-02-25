
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MapDetail from "./pages/MapDetail";
import UtilityList from "./pages/UtilityList";
import StrategyList from "./pages/StrategyList";
import MapPositions from "./pages/MapPositions";
import Binds from "./pages/Binds";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminProfile from "./pages/AdminProfile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/auth-context";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { App as CapApp } from '@capacitor/app';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Gestion des événements Capacitor (pour Android)
    const setupCapacitorListeners = async () => {
      // Vérifier si nous sommes dans un environnement Capacitor
      if ((window as any).Capacitor) {
        CapApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapApp.exitApp();
          } else {
            window.history.back();
          }
        });
      }
    };

    setupCapacitorListeners();

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

    return () => {
      // Nettoyage des écouteurs Capacitor
      if ((window as any).Capacitor) {
        CapApp.removeAllListeners();
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/maps/:mapId" element={<MapDetail />} />
              <Route path="/maps/:mapId/utilities/:utilityType" element={<UtilityList />} />
              <Route path="/maps/:mapId/strategies" element={<StrategyList />} />
              <Route path="/maps/:mapId/positions" element={<MapPositions />} />
              <Route path="/binds" element={<Binds />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/profile" 
                element={
                  <ProtectedRoute>
                    <AdminProfile />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
