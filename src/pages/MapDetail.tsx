
import { useParams, useNavigate } from "react-router-dom";
import { useStorage } from "../hooks/use-storage";
import { Button } from "../components/ui/button";
import { NavBar } from "../components/NavBar";
import { Zap, Cloud, Bomb, BookOpen, MapPin } from "lucide-react";

export default function MapDetail() {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { state } = useStorage();
  
  const map = state.maps.find((m) => m.id === mapId);
  
  if (!map) {
    return <div>Map non trouvée</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-48 md:h-64">
        <img
          src={map.image}
          alt={map.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <h1 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
          {map.name}
        </h1>
      </div>

      <main className="container px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-2 h-24"
            onClick={() => navigate(`/maps/${mapId}/utilities/flash`)}
          >
            <Zap className="h-8 w-8 text-yellow-400" />
            <span>Flash</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-2 h-24"
            onClick={() => navigate(`/maps/${mapId}/utilities/smoke`)}
          >
            <Cloud className="h-8 w-8 text-gray-400" />
            <span>Smokes</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-2 h-24"
            onClick={() => navigate(`/maps/${mapId}/utilities/grenade`)}
          >
            <Bomb className="h-8 w-8 text-red-400" />
            <span>Frag</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center gap-2 h-24"
            onClick={() => navigate(`/maps/${mapId}/strategies`)}
          >
            <BookOpen className="h-8 w-8 text-accent" />
            <span>Stratégies</span>
          </Button>
        </div>

        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 h-24 w-full"
          onClick={() => navigate(`/maps/${mapId}/positions`)}
        >
          <MapPin className="h-8 w-8 text-green-500" />
          <span>Poses</span>
        </Button>
      </main>

      <NavBar />
    </div>
  );
}
