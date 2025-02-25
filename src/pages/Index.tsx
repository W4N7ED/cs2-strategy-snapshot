
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { MapCard } from "../components/MapCard";
import { useStorage } from "../hooks/use-storage";
import { toast } from "../hooks/use-toast";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Map, Bomb, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { state, isLoading, setCurrentMap } = useStorage();
  const { maps } = state;

  const handleMapClick = (mapId: string) => {
    setCurrentMap(mapId);
    navigate(`/maps/${mapId}`);
  };

  const totalStrategies = maps.reduce((total, map) => total + map.strategies.length, 0);
  const totalUtilities = maps.reduce((total, map) => total + map.utilities.length, 0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-center">CS2 Strategy Snapshot</h1>
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
              onClick={() => navigate('/maps')}
            >
              <Map className="h-3 w-3" />
              Voir tout
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {maps.slice(0, 4).map((map) => (
              <MapCard
                key={map.id}
                map={map}
                onClick={() => handleMapClick(map.id)}
              />
            ))}
          </div>
          
          {maps.length > 4 && (
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate('/maps')}
            >
              Voir toutes les cartes
            </Button>
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

      <NavBar />
    </div>
  );
};

export default Index;
