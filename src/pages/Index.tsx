
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { MapCard } from "../components/MapCard";
import { useStorage } from "../hooks/use-storage";
import { toast } from "../hooks/use-toast";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Map, Bomb, BookOpen, Search, ShieldAlert, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { ThemeToggle } from "../components/ThemeToggle";
import { useState } from "react";
import { MapCategory } from "../types";

const Index = () => {
  const navigate = useNavigate();
  const { state, isLoading, setCurrentMap } = useStorage();
  const { maps } = state;
  const { isAuthenticated } = useAuth();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MapCategory>("premiere");

  const handleMapClick = (mapId: string) => {
    setCurrentMap(mapId);
    navigate(`/maps/${mapId}`);
  };

  const totalStrategies = maps.reduce((total, map) => total + map.strategies.length, 0);
  const totalUtilities = maps.reduce((total, map) => total + map.utilities.length, 0);

  const toggleShowAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const getCategoryMaps = (category: MapCategory) => {
    return maps.filter(map => map.category === category);
  };

  const getCategoryLabel = (category: MapCategory) => {
    switch (category) {
      case "premiere":
        return "Première";
      case "competitive":
        return "Compétitive";
      case "wingman":
        return "Wingman";
      default:
        return category;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background p-4 sticky top-0 z-10 shadow-sm header-container">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-center flex-1">CS2 Strategy Snapshot</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(isAuthenticated ? '/admin/profile' : '/admin/login')}
            >
              <ShieldAlert className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Vue d'ensemble</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex h-20 flex-col items-center justify-center gap-2"
              onClick={() => navigate("/strategies")}
            >
              <div className="flex items-center gap-1">
                <BookOpen className="h-5 w-5 text-accent" />
                <span className="font-bold">{totalStrategies}</span>
              </div>
              <span className="text-sm">Stratégies</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex h-20 flex-col items-center justify-center gap-2"
              onClick={() => navigate("/utilities")}
            >
              <div className="flex items-center gap-1">
                <Bomb className="h-5 w-5 text-accent" />
                <span className="font-bold">{totalUtilities}</span>
              </div>
              <span className="text-sm">Utilitaires</span>
            </Button>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Cartes</h2>
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 cursor-pointer"
              onClick={toggleShowAllCategories}
            >
              <Map className="h-3 w-3" />
              {showAllCategories ? "Réduire" : "Voir tout"}
              {showAllCategories ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Badge>
          </div>
          
          {/* Sélecteur de catégorie */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 hide-scrollbar">
            {(["premiere", "competitive", "wingman"] as MapCategory[]).map((category) => (
              <Badge 
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveCategory(category)}
              >
                {getCategoryLabel(category)}
              </Badge>
            ))}
          </div>
          
          {/* Si on affiche une seule catégorie */}
          {!showAllCategories && (
            <div className="grid grid-cols-2 gap-3">
              {getCategoryMaps(activeCategory).map((map) => (
                <MapCard
                  key={map.id}
                  map={map}
                  onClick={() => handleMapClick(map.id)}
                />
              ))}
            </div>
          )}
          
          {/* Si on affiche toutes les catégories */}
          {showAllCategories && (
            <div className="space-y-6">
              {(["premiere", "competitive", "wingman"] as MapCategory[]).map((category) => (
                <div key={category}>
                  <h3 className="text-lg font-medium mb-3">{getCategoryLabel(category)}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {getCategoryMaps(category).map((map) => (
                      <MapCard
                        key={map.id}
                        map={map}
                        onClick={() => handleMapClick(map.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Commencer</h2>
          <div className="space-y-4">
            <Button 
              className="w-full justify-start gap-2"
              onClick={() => navigate('/add')}
            >
              <Map className="h-5 w-5" />
              Ajouter une stratégie
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => {
                toast({
                  title: "Astuce",
                  description: "Utilisez la barre de navigation pour accéder rapidement aux différentes sections."
                });
              }}
            >
              <BookOpen className="h-5 w-5" />
              Conseils d'utilisation
            </Button>
          </div>
        </section>
      </main>

      {/* Bouton de recherche en bas à gauche */}
      <div className="fixed bottom-20 left-4 z-40">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg bg-accent hover:bg-accent/90"
          onClick={() => {
            toast({
              title: "Recherche",
              description: "Fonctionnalité de recherche en cours de développement"
            });
          }}
        >
          <Search className="h-6 w-6 text-accent-foreground" />
        </Button>
      </div>

      <NavBar />
    </div>
  );
}

export default Index;
