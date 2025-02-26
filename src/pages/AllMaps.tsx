
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { MapCard } from "../components/MapCard";
import { useStorage } from "../hooks/use-storage";
import { Badge } from "../components/ui/badge";
import { MapCategory } from "../types";
import { ArrowLeft, ChevronDown, ChevronUp, Map } from "lucide-react";
import { Button } from "../components/ui/button";

export default function AllMaps() {
  const navigate = useNavigate();
  const { state, setCurrentMap } = useStorage();
  const { maps } = state;
  const [showAllCategories, setShowAllCategories] = useState(true);
  const [activeCategory, setActiveCategory] = useState<MapCategory>("premiere");

  const handleMapClick = (mapId: string) => {
    setCurrentMap(mapId);
    navigate(`/maps/${mapId}`);
  };

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

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-16 bg-accent/10 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold ml-4">
          Toutes les cartes
        </h1>
      </div>

      <main className="container px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Cartes</h2>
          <Badge 
            variant="outline" 
            className="flex items-center gap-1 cursor-pointer"
            onClick={toggleShowAllCategories}
          >
            <Map className="h-3 w-3" />
            {showAllCategories ? "Par catégorie" : "Toutes les cartes"}
            {showAllCategories ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
          </Badge>
        </div>
        
        {/* Si on veut filtrer par catégorie */}
        {!showAllCategories && (
          <>
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
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {getCategoryMaps(activeCategory).map((map) => (
                <MapCard
                  key={map.id}
                  map={map}
                  onClick={() => handleMapClick(map.id)}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Si on affiche toutes les cartes par catégorie */}
        {showAllCategories && (
          <div className="space-y-6">
            {(["premiere", "competitive", "wingman"] as MapCategory[]).map((category) => (
              <div key={category}>
                <h3 className="text-lg font-medium mb-3">{getCategoryLabel(category)}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
      </main>

      <NavBar />
    </div>
  );
}
