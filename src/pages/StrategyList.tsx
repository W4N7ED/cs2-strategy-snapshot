
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStorage } from "../hooks/use-storage";
import { NavBar } from "../components/NavBar";
import { Button } from "../components/ui/button";
import { StrategyCard } from "../components/StrategyCard";
import { SideSelector } from "../components/SideSelector";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function StrategyList() {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { state } = useStorage();
  const [showSideSelector, setShowSideSelector] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'CT' | 'T' | null>(null);

  const map = state.maps.find((m) => m.id === mapId);
  
  if (!map) {
    return <div>Map non trouvée</div>;
  }

  // Filtrage des stratégies par côté sélectionné
  const filteredStrategies = selectedSide 
    ? map.strategies.filter(strategy => strategy.side === selectedSide)
    : map.strategies;

  const handleSelectSide = (side: 'CT' | 'T') => {
    setSelectedSide(side);
    setShowSideSelector(false);
    toast({
      title: side === 'CT' ? "Défenseurs" : "Attaquants",
      description: `Affichage des stratégies pour les ${side === 'CT' ? 'Counter-Terrorists' : 'Terrorists'}`
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-32 bg-accent/10">
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/maps/${mapId}`)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-center flex-1">
            Stratégies - {map.name}
          </h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowSideSelector(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <main className="container px-4 py-6">
        {selectedSide ? (
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedSide(null)}
              className="mb-4"
            >
              Toutes les stratégies
            </Button>
            <h2 className="text-lg font-semibold mb-2">
              {selectedSide === 'CT' ? 'Counter-Terrorists' : 'Terrorists'}
            </h2>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full mb-4 flex items-center justify-center"
            onClick={() => setShowSideSelector(true)}
          >
            Choisir un côté (CT / T)
          </Button>
        )}

        {filteredStrategies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStrategies.map((strategy) => (
              <StrategyCard 
                key={strategy.id} 
                strategy={strategy} 
                onClick={() => navigate(`/maps/${mapId}/strategies/${strategy.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Aucune stratégie disponible
              {selectedSide ? ` pour les ${selectedSide === 'CT' ? 'Counter-Terrorists' : 'Terrorists'}` : ''}.
            </p>
          </div>
        )}
      </main>

      <SideSelector
        isOpen={showSideSelector}
        onClose={() => setShowSideSelector(false)}
        onSelectSide={handleSelectSide}
        title="Sélectionner un côté pour les stratégies"
      />

      <NavBar />
    </div>
  );
}
