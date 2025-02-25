
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Bomb } from "lucide-react";

interface SideSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSide: (side: 'CT' | 'T') => void;
  title: string;
}

export function SideSelector({ isOpen, onClose, onSelectSide, title }: SideSelectorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
            onClick={() => onSelectSide('CT')}
          >
            <Shield className="h-12 w-12 text-blue-500" />
            <span className="font-semibold text-lg">Counter-Terrorists</span>
          </Button>
          
          <Button
            variant="outline" 
            className="h-32 flex flex-col items-center justify-center gap-2 border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={() => onSelectSide('T')}
          >
            <Bomb className="h-12 w-12 text-red-500" />
            <span className="font-semibold text-lg">Terrorists</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
