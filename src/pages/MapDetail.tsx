
import { useParams, useNavigate } from "react-router-dom";
import { useStorage } from "../hooks/use-storage";
import { Button } from "../components/ui/button";
import { NavBar } from "../components/NavBar";
import { Zap, Cloud, Bomb, BookOpen, MapPin, Upload } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { useState, useRef } from "react";
import { toast } from "../hooks/use-toast";

export default function MapDetail() {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { state, updateMapImage } = useStorage();
  const { isAuthenticated } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const map = state.maps.find((m) => m.id === mapId);
  
  if (!map) {
    return <div>Map non trouvée</div>;
  }

  // Fonction pour formater correctement le chemin de l'image
  const getImagePath = (path: string) => {
    // Si le chemin commence par http ou https, c'est une URL externe
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Si c'est une URL d'image téléchargée via Lovable
    if (path.includes('lovable-uploads')) {
      return path;
    }
    // Sinon, c'est un chemin relatif à la racine du projet
    return path.startsWith('/') ? path : `/${path}`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Vérifier le type et la taille du fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image",
        variant: "destructive"
      });
      setUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limite
      toast({
        title: "Erreur",
        description: "L'image est trop volumineuse (max 5MB)",
        variant: "destructive"
      });
      setUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      
      if (mapId) {
        updateMapImage(mapId, imageDataUrl);
        toast({
          title: "Succès",
          description: "Image de carte mise à jour avec succès"
        });
      }
      
      setUploading(false);
    };
    
    reader.onerror = () => {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement de l'image",
        variant: "destructive"
      });
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-48 md:h-64">
        <img
          src={getImagePath(map.image)}
          alt={map.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <h1 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
          {map.name}
        </h1>
        
        {isAuthenticated && (
          <div className="absolute bottom-4 right-4">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-secondary/80 hover:bg-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Chargement..." : "Changer l'image"}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}
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
