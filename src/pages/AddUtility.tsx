
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStorage } from "../hooks/use-storage";
import { NavBar } from "../components/NavBar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "../hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { SideSelector } from "../components/SideSelector";

export default function AddUtility() {
  const { mapId, utilityType } = useParams();
  const navigate = useNavigate();
  const { addUtility } = useStorage();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showSideSelector, setShowSideSelector] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'CT' | 'T' | null>(null);
  
  // Validation
  const isFormValid = title.trim() !== "" && description.trim() !== "" && selectedSide !== null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mapId || !utilityType || !selectedSide) return;
    
    // Vérifier que le type d'utilitaire est valide
    if (!['flash', 'smoke', 'grenade', 'molotov'].includes(utilityType)) {
      toast({
        title: "Erreur",
        description: "Type d'utilitaire non valide",
        variant: "destructive"
      });
      return;
    }
    
    // Créer le nouvel utilitaire
    const newUtility = {
      type: utilityType as 'smoke' | 'flash' | 'grenade' | 'molotov',
      title,
      description,
      side: selectedSide,
      media: []
    };
    
    addUtility(mapId, newUtility);
    
    toast({
      title: "Succès",
      description: "Utilitaire ajouté avec succès"
    });
    
    // Rediriger vers la liste des utilitaires
    navigate(`/maps/${mapId}/utilities/${utilityType}`);
  };
  
  const getTypeLabel = () => {
    switch(utilityType) {
      case 'flash': return 'Flash';
      case 'smoke': return 'Smoke';
      case 'grenade': return 'Grenade';
      case 'molotov': return 'Molotov';
      default: return 'Utilitaire';
    }
  };
  
  const handleSelectSide = (side: 'CT' | 'T') => {
    setSelectedSide(side);
    setShowSideSelector(false);
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-16 bg-accent/10 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/maps/${mapId}/utilities/${utilityType}`)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold ml-4">
          Ajouter un {getTypeLabel()}
        </h1>
      </div>
      
      <main className="container px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Flash mid depuis T spawn"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez comment exécuter cet utilitaire..."
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Côté</Label>
            <Button
              type="button"
              variant={selectedSide ? "outline" : "default"}
              className="w-full justify-start"
              onClick={() => setShowSideSelector(true)}
            >
              {selectedSide ? (selectedSide === 'CT' ? 'Counter-Terrorist (CT)' : 'Terrorist (T)') : 'Sélectionner un côté'}
            </Button>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid}
          >
            Ajouter
          </Button>
        </form>
      </main>
      
      <SideSelector
        isOpen={showSideSelector}
        onClose={() => setShowSideSelector(false)}
        onSelectSide={handleSelectSide}
        title={`Sélectionner un côté pour ${getTypeLabel()}`}
      />
      
      <NavBar />
    </div>
  );
}
