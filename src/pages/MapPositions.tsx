
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStorage } from "../hooks/use-storage";
import { Button } from "../components/ui/button";
import { NavBar } from "../components/NavBar";
import { ArrowLeft } from "lucide-react";

// Types pour les positions sur la carte
interface Position {
  id: string;
  name: string;
  x: number;
  y: number;
}

// Base de données des positions par carte
const MAP_POSITIONS: Record<string, Position[]> = {
  // Mirage
  "mirage": [
    { id: "1", name: "T Spawn", x: 25, y: 75 },
    { id: "2", name: "Tetris", x: 60, y: 65 },
    { id: "3", name: "Palace", x: 70, y: 50 },
    { id: "4", name: "A Site", x: 60, y: 40 },
    { id: "5", name: "Jungle", x: 45, y: 40 },
    { id: "6", name: "Connector", x: 50, y: 45 },
    { id: "7", name: "Middle", x: 40, y: 55 },
    { id: "8", name: "B Apts", x: 30, y: 35 },
    { id: "9", name: "B Site", x: 25, y: 25 },
    { id: "10", name: "Market", x: 35, y: 25 },
    { id: "11", name: "CT Spawn", x: 50, y: 15 },
  ],
  // Dust 2
  "dust2": [
    { id: "1", name: "T Spawn", x: 15, y: 80 },
    { id: "2", name: "Long Doors", x: 35, y: 65 },
    { id: "3", name: "Long A", x: 50, y: 45 },
    { id: "4", name: "A Site", x: 65, y: 30 },
    { id: "5", name: "CT Mid", x: 55, y: 25 },
    { id: "6", name: "Mid", x: 35, y: 45 },
    { id: "7", name: "Lower Tunnel", x: 25, y: 55 },
    { id: "8", name: "Upper Tunnel", x: 15, y: 35 },
    { id: "9", name: "B Site", x: 30, y: 20 },
    { id: "10", name: "CT Spawn", x: 75, y: 15 },
  ],
  // Inferno
  "inferno": [
    { id: "1", name: "T Spawn", x: 75, y: 85 },
    { id: "2", name: "Banana", x: 40, y: 60 },
    { id: "3", name: "B Site", x: 35, y: 35 },
    { id: "4", name: "Middle", x: 60, y: 55 },
    { id: "5", name: "A Apps", x: 80, y: 50 },
    { id: "6", name: "A Site", x: 75, y: 35 },
    { id: "7", name: "Library", x: 65, y: 30 },
    { id: "8", name: "Pit", x: 85, y: 25 },
    { id: "9", name: "Arch", x: 55, y: 40 },
    { id: "10", name: "CT Spawn", x: 45, y: 15 },
  ],
  // Autres cartes (ajouter selon besoin)
  "nuke": [
    { id: "1", name: "T Spawn", x: 50, y: 85 },
    { id: "2", name: "Outside", x: 70, y: 60 },
    { id: "3", name: "Lobby", x: 45, y: 65 },
    { id: "4", name: "Ramp", x: 30, y: 55 },
    { id: "5", name: "A Site", x: 50, y: 45 },
    { id: "6", name: "Hut", x: 55, y: 55 },
    { id: "7", name: "B Upper", x: 45, y: 45 },
    { id: "8", name: "B Lower", x: 45, y: 30 },
    { id: "9", name: "Secret", x: 65, y: 40 },
    { id: "10", name: "CT Spawn", x: 50, y: 15 },
  ],
  "overpass": [
    { id: "1", name: "T Spawn", x: 25, y: 85 },
    { id: "2", name: "Toilets", x: 70, y: 65 },
    { id: "3", name: "A Long", x: 75, y: 45 },
    { id: "4", name: "A Site", x: 60, y: 35 },
    { id: "5", name: "Connector", x: 50, y: 50 },
    { id: "6", name: "B Short", x: 40, y: 45 },
    { id: "7", name: "Monster", x: 25, y: 35 },
    { id: "8", name: "B Site", x: 35, y: 30 },
    { id: "9", name: "Heaven", x: 45, y: 25 },
    { id: "10", name: "CT Spawn", x: 55, y: 15 },
  ],
  "ancient": [
    { id: "1", name: "T Spawn", x: 30, y: 85 },
    { id: "2", name: "Middle", x: 45, y: 60 },
    { id: "3", name: "Donut", x: 65, y: 55 },
    { id: "4", name: "A Site", x: 70, y: 35 },
    { id: "5", name: "Temple", x: 55, y: 45 },
    { id: "6", name: "Cave", x: 40, y: 35 },
    { id: "7", name: "B Site", x: 30, y: 30 },
    { id: "8", name: "CT Spawn", x: 50, y: 15 },
  ],
  "vertigo": [
    { id: "1", name: "T Spawn", x: 25, y: 85 },
    { id: "2", name: "T Ramp", x: 35, y: 70 },
    { id: "3", name: "Middle", x: 50, y: 55 },
    { id: "4", name: "A Ramp", x: 70, y: 60 },
    { id: "5", name: "A Site", x: 75, y: 40 },
    { id: "6", name: "B Site", x: 25, y: 35 },
    { id: "7", name: "CT Spawn", x: 50, y: 15 },
  ],
  "anubis": [
    { id: "1", name: "T Spawn", x: 75, y: 85 },
    { id: "2", name: "Palace", x: 65, y: 70 },
    { id: "3", name: "Middle", x: 50, y: 55 },
    { id: "4", name: "Connector", x: 45, y: 45 },
    { id: "5", name: "A Site", x: 70, y: 35 },
    { id: "6", name: "Canals", x: 30, y: 60 },
    { id: "7", name: "B Site", x: 25, y: 30 },
    { id: "8", name: "CT Spawn", x: 45, y: 15 },
  ],
};

// Images des mini-cartes
const MAP_IMAGES: Record<string, string> = {
  "mirage": "/maps/mirage.jpg",
  "dust2": "/maps/dust2.jpg",
  "inferno": "/maps/inferno.jpg",
  "nuke": "/maps/nuke.jpg",
  "overpass": "/maps/overpass.jpg",
  "ancient": "/maps/ancient.jpg",
  "vertigo": "/maps/vertigo.jpg",
  "anubis": "/maps/anubis.jpg",
};

export default function MapPositions() {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { state } = useStorage();
  const [positions, setPositions] = useState<Position[]>([]);
  
  const map = state.maps.find((m) => m.id === mapId);
  
  if (!map) {
    return <div>Map non trouvée</div>;
  }

  // Déterminer quel jeu de positions utiliser en fonction du nom de la carte
  useEffect(() => {
    if (map) {
      // Normalisation du nom pour correspondre aux clés dans MAP_POSITIONS
      const normalizedName = map.name.toLowerCase().replace(/\s+/g, '');
      
      // Trouver la clé la plus proche dans MAP_POSITIONS
      const closestMatch = Object.keys(MAP_POSITIONS).find(key => 
        normalizedName.includes(key) || key.includes(normalizedName)
      );
      
      if (closestMatch) {
        setPositions(MAP_POSITIONS[closestMatch]);
      } else {
        // Utiliser Mirage comme défaut si pas de correspondance
        setPositions(MAP_POSITIONS["mirage"]);
      }
    }
  }, [map]);

  // Obtenir l'image de la carte
  const getMapImage = () => {
    if (!map) return "";
    
    const normalizedName = map.name.toLowerCase().replace(/\s+/g, '');
    const closestMatch = Object.keys(MAP_IMAGES).find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );
    
    return closestMatch ? MAP_IMAGES[closestMatch] : "/maps/mirage.jpg";
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
            Positions - {map.name}
          </h1>
          <div className="w-10"></div> {/* Spacer pour centrer le titre */}
        </div>
      </div>

      <main className="container px-4 py-6">
        <div className="relative mb-6 border-2 border-accent rounded-lg overflow-hidden">
          <img 
            src={getMapImage()} 
            alt={`Mini-map de ${map.name}`} 
            className="w-full h-auto"
          />
          
          {/* Marqueurs de position */}
          {positions.map((pos) => (
            <div 
              key={pos.id}
              className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`,
                zIndex: 10
              }}
            >
              <div className="absolute top-5 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {pos.name}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {positions.map((pos) => (
            <Button 
              key={pos.id}
              variant="outline"
              className="justify-start"
              onClick={() => {
                // Faire défiler jusqu'à la position sur la carte
                const elements = document.querySelectorAll(`.position-${pos.id}`);
                if (elements.length > 0) {
                  elements[0].scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {pos.name}
            </Button>
          ))}
        </div>
      </main>

      <NavBar />
    </div>
  );
}
