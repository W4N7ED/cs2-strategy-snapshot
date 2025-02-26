
import { Home, Map, BookOpen, Plus, Keyboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStorage } from "@/hooks/use-storage";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { addMap, state } = useStorage();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMapName, setNewMapName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"premiere" | "competitive" | "wingman">("premiere");
  
  const isActive = (route: string) => {
    return path === route || (route !== "/" && path.startsWith(route));
  };

  const handleAddMap = () => {
    if (newMapName.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le nom de la carte ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    try {
      const newMap = addMap({
        name: newMapName,
        image: "/placeholder.svg",
        category: selectedCategory
      });
      
      setShowAddDialog(false);
      setNewMapName("");
      toast({
        title: "Succès",
        description: `La carte ${newMapName} a été ajoutée`
      });
      
      // Rediriger vers la nouvelle carte
      navigate(`/maps/${newMap.id}`);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la carte",
        variant: "destructive"
      });
    }
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
  };

  // Si l'utilisateur est sur une page de carte spécifique, on prépare un lien vers les stratégies de cette carte
  const currentMapId = location.pathname.match(/\/maps\/([^\/]+)/)?.[1];
  
  // Déterminer si l'utilisateur est sur la page d'accueil
  const isHomePage = path === "/" || path === "/index";
  
  // Gestionnaire pour le clic sur le bouton Cartes
  const handleMapsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };
  
  // Gestionnaire pour le clic sur le bouton Stratégies
  const handleStrategiesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentMapId) {
      navigate(`/maps/${currentMapId}/strategies`);
    } else {
      // Si l'utilisateur n'est pas sur une page de carte spécifique, rediriger vers la page d'accueil
      navigate("/");
      toast({
        description: "Veuillez d'abord sélectionner une carte",
      });
    }
  };
  
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-border flex justify-around items-center p-3 z-50">
        <Link to="/" className={`flex flex-col items-center justify-center text-muted-foreground transition-all hover:text-foreground active:scale-95 ${isActive("/") ? "text-accent" : ""}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        
        <button
          onClick={handleMapsClick}
          className={`flex flex-col items-center justify-center text-muted-foreground transition-all hover:text-foreground active:scale-95 ${isActive("/maps") ? "text-accent" : ""}`}
        >
          <Map className="h-6 w-6" />
          <span className="text-xs mt-1">Cartes</span>
        </button>
        
        <button 
          onClick={handleAddClick}
          className="flex flex-col items-center"
        >
          <div className="bg-accent rounded-full p-3 -mt-8 shadow-lg">
            <Plus className="h-6 w-6 text-accent-foreground" />
          </div>
          <span className="text-xs mt-1">Ajouter</span>
        </button>
        
        {/* Afficher le bouton Stratégies uniquement lorsque l'utilisateur n'est pas sur la page d'accueil */}
        {!isHomePage && (
          <button
            onClick={handleStrategiesClick}
            className={`flex flex-col items-center justify-center text-muted-foreground transition-all hover:text-foreground active:scale-95 ${isActive("/strategies") ? "text-accent" : ""}`}
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-xs mt-1">Stratégies</span>
          </button>
        )}
        
        <Link to="/binds" className={`flex flex-col items-center justify-center text-muted-foreground transition-all hover:text-foreground active:scale-95 ${isActive("/binds") ? "text-accent" : ""}`}>
          <Keyboard className="h-6 w-6" />
          <span className="text-xs mt-1">Binds</span>
        </Link>
      </nav>
      
      {/* Dialog pour ajouter une nouvelle carte */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle carte</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la carte</Label>
              <Input
                id="name"
                value={newMapName}
                onChange={(e) => setNewMapName(e.target.value)}
                placeholder="Ex: Dust 2, Inferno, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedCategory === "premiere" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory("premiere")}
                >
                  Première
                </Badge>
                <Badge 
                  variant={selectedCategory === "competitive" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory("competitive")}
                >
                  Compétitive
                </Badge>
                <Badge 
                  variant={selectedCategory === "wingman" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory("wingman")}
                >
                  Wingman
                </Badge>
              </div>
            </div>
            
            <Button onClick={handleAddMap} className="w-full mt-4">
              Ajouter la carte
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
