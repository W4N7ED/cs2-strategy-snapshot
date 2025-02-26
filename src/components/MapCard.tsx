
import { useState } from "react";
import { CSMap } from "../types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface MapCardProps {
  map: CSMap;
  onClick: () => void;
}

export function MapCard({ map, onClick }: MapCardProps) {
  const [imageError, setImageError] = useState(false);
  const strategyCount = map.strategies.length;
  const utilityCount = map.utilities.length;

  // Image de secours si l'image principale ne charge pas
  const fallbackImage = "/placeholder.svg";
  
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

  return (
    <Card
      className="bg-secondary rounded-lg p-2 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:translate-y-[-2px] cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-video rounded-md overflow-hidden bg-muted">
        <img
          src={imageError ? fallbackImage : getImagePath(map.image)}
          alt={map.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-foreground truncate">{map.name}</h3>
        <div className="mt-1 flex flex-wrap gap-1">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
            {strategyCount} stratégies
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
            {utilityCount} utilitaires
          </Badge>
        </div>
      </div>
    </Card>
  );
}
