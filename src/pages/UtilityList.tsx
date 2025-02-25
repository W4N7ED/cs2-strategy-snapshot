
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStorage } from "../hooks/use-storage";
import { NavBar } from "../components/NavBar";
import { Button } from "../components/ui/button";
import { UtilityCard } from "../components/UtilityCard";
import { SideSelector } from "../components/SideSelector";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function UtilityList() {
  const { mapId, utilityType } = useParams();
  const navigate = useNavigate();
  const { state } = useStorage();
  const [showSideSelector, setShowSideSelector] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'CT' | 'T' | null>(null);

  const map = state.maps.find((m) => m.id === mapId);
  
  if (!map) {
    return <div>Map non trouvée</div>;
  }

  // Conversion du type d'utilitaire à partir de l'URL
  const getUtilityTypeLabel = (type: string | undefined) => {
    switch(type) {
      case 'flash': return 'Flash';
      case 'smoke': return 'Smokes';
      case 'grenade': return 'Frag';
      default: return 'Utilitaires';
    }
  };
  
  // Filtrage des utilitaires par type et côté sélectionné
  const filteredUtilities = map.utilities.filter(utility => {
    // Filtre par type
    const typeMatch = utility.type === utilityType;
    
    // Si on n'a pas encore sélectionné un côté, on montre tous les utilitaires du type
    if (!selectedSide) return typeMatch;
    
    // Sinon, on filtre par côté en plus du type
    // Note: Nous devons ajouter une propriété 'side' dans l'interface Utility
    return typeMatch && (utility as any).side === selectedSide;
  });

  const handleSelectSide = (side: 'CT' | 'T') => {
    setSelectedSide(side);
    setShowSideSelector(false);
    toast({
      title: side === 'CT' ? "Défenseurs" : "Attaquants",
      description: `Affichage des ${getUtilityTypeLabel(utilityType)} pour les ${side === 'CT' ? 'Counter-Terrorists' : 'Terrorists'}`
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
            {getUtilityTypeLabel(utilityType)} - {map.name}
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
              Tous les {getUtilityTypeLabel(utilityType)}
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

        {filteredUtilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUtilities.map((utility) => (
              <UtilityCard 
                key={utility.id} 
                utility={utility} 
                onClick={() => navigate(`/maps/${mapId}/utilities/${utilityType}/${utility.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Aucun {getUtilityTypeLabel(utilityType)} disponible 
              {selectedSide ? ` pour les ${selectedSide === 'CT' ? 'Counter-Terrorists' : 'Terrorists'}` : ''}.
            </p>
          </div>
        )}
      </main>

      <SideSelector
        isOpen={showSideSelector}
        onClose={() => setShowSideSelector(false)}
        onSelectSide={handleSelectSide}
        title={`Sélectionner un côté pour ${getUtilityTypeLabel(utilityType)}`}
      />

      <NavBar />
    </div>
  );
}
