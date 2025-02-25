
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Strategy } from "@/types";
import { Shield, Swords } from "lucide-react";

interface StrategyCardProps {
  strategy: Strategy;
  onClick: () => void;
}

export function StrategyCard({ strategy, onClick }: StrategyCardProps) {
  const mediaCount = strategy.media.length;

  return (
    <Card
      className="cs-card cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-2 ${strategy.side === 'T' ? 'bg-accent' : 'bg-blue-500'}`}>
              {strategy.side === 'T' ? <Swords className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
            </div>
            <h3 className="text-lg font-semibold">{strategy.title}</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {strategy.description}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <Badge variant="outline">{strategy.side === 'T' ? 'Attaque' : 'Défense'}</Badge>
        <Badge variant="secondary">{mediaCount} média{mediaCount > 1 ? 's' : ''}</Badge>
      </div>
    </Card>
  );
}
