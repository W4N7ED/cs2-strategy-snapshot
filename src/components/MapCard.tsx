
import { CSMap } from "../types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface MapCardProps {
  map: CSMap;
  onClick: () => void;
}

export function MapCard({ map, onClick }: MapCardProps) {
  const strategyCount = map.strategies.length;
  const utilityCount = map.utilities.length;

  return (
    <Card
      className="bg-secondary rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:translate-y-[-2px] cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden rounded-md">
        <img
          src={map.image}
          alt={map.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-xl font-semibold text-foreground">{map.name}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent"></span>
            {strategyCount} stratégies
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            {utilityCount} utilitaires
          </Badge>
        </div>
      </div>
    </Card>
  );
}
