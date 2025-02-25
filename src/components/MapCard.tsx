
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

  const fallbackImage = "/placeholder.svg";

  return (
    <Card
      className="bg-secondary rounded-lg p-2 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:translate-y-[-2px] cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-video rounded-md overflow-hidden bg-muted">
        <img
          src={imageError ? fallbackImage : map.image}
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
