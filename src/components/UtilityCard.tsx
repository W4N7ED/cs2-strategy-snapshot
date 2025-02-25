
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utility } from "@/types";
import { Cloud, Zap, Bomb, Flame } from "lucide-react";

interface UtilityCardProps {
  utility: Utility;
  onClick: () => void;
}

export function UtilityCard({ utility, onClick }: UtilityCardProps) {
  const getIcon = () => {
    switch (utility.type) {
      case "smoke":
        return <Cloud className="h-5 w-5" />;
      case "flash":
        return <Zap className="h-5 w-5" />;
      case "grenade":
        return <Bomb className="h-5 w-5" />;
      case "molotov":
        return <Flame className="h-5 w-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (utility.type) {
      case "smoke":
        return "Smoke";
      case "flash":
        return "Flashbang";
      case "grenade":
        return "Grenade";
      case "molotov":
        return "Molotov";
    }
  };

  const getTypeColor = () => {
    switch (utility.type) {
      case "smoke":
        return "bg-gray-400";
      case "flash":
        return "bg-yellow-400";
      case "grenade":
        return "bg-red-400";
      case "molotov":
        return "bg-orange-400";
    }
  };

  const mediaCount = utility.media.length;

  return (
    <Card
      className="cs-card cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-2 ${getTypeColor()}`}>
              {getIcon()}
            </div>
            <h3 className="text-lg font-semibold">{utility.title}</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {utility.description}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <Badge variant="outline">{getTypeLabel()}</Badge>
        <Badge variant="secondary">{mediaCount} média{mediaCount > 1 ? 's' : ''}</Badge>
      </div>
    </Card>
  );
}
