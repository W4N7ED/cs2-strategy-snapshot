
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useStorage } from "../hooks/use-storage";
import { NavBar } from "../components/NavBar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../hooks/use-toast";
import { ArrowLeft, Image, Film, FileType, Trash2, Youtube } from "lucide-react";
import { SideSelector } from "../components/SideSelector";
import { MediaItem, MediaType } from "../types";
import { v4 as uuidv4 } from "uuid";

export default function AddUtility() {
  const { mapId, utilityType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addUtility } = useStorage();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showSideSelector, setShowSideSelector] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'CT' | 'T' | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaDesc, setMediaDesc] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [showMediaForm, setShowMediaForm] = useState(false);
  
  // Vérifier que les paramètres nécessaires sont présents
  useEffect(() => {
    if (!mapId || !utilityType) {
      console.error("Paramètres d'URL manquants:", { mapId, utilityType, path: location.pathname });
      toast({
        title: "Erreur",
        description: "Paramètres manquants. Redirection vers la page d'accueil.",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [mapId, utilityType, navigate, location]);
  
  // Validation
  const isFormValid = title.trim() !== "" && description.trim() !== "" && selectedSide !== null;
  const isMediaFormValid = mediaTitle.trim() !== "" && mediaUrl.trim() !== "";
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mapId || !utilityType || !selectedSide) {
      toast({
        title: "Erreur",
        description: "Informations incomplètes",
        variant: "destructive"
      });
      return;
    }
    
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
      media: mediaItems
    };
    
    try {
      addUtility(mapId, newUtility);
      
      toast({
        title: "Succès",
        description: "Utilitaire ajouté avec succès"
      });
      
      // Rediriger vers la liste des utilitaires
      navigate(`/maps/${mapId}/utilities/${utilityType}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'utilitaire",
        variant: "destructive"
      });
    }
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
  
  const goBack = () => {
    if (mapId && utilityType) {
      navigate(`/maps/${mapId}/utilities/${utilityType}`);
    } else {
      navigate("/");
    }
  };

  // Fonction pour extraire l'ID d'une vidéo YouTube à partir de son URL
  const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Fonction pour vérifier si une URL est une URL YouTube
  const isYoutubeUrl = (url: string): boolean => {
    const videoId = getYoutubeVideoId(url);
    return videoId !== null;
  };

  // Fonction pour obtenir l'URL de la miniature d'une vidéo YouTube
  const getYoutubeThumbnailUrl = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // Fonction pour convertir l'URL YouTube en URL d'intégration
  const getYoutubeEmbedUrl = (videoId: string): string => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const addMediaItem = () => {
    if (!isMediaFormValid) return;

    let finalMediaType = mediaType;
    let finalMediaUrl = mediaUrl;

    // Vérifier si c'est une URL YouTube
    if (mediaType === 'video' && isYoutubeUrl(mediaUrl)) {
      const videoId = getYoutubeVideoId(mediaUrl);
      if (videoId) {
        finalMediaType = 'youtube';
        finalMediaUrl = getYoutubeEmbedUrl(videoId);
      }
    }

    const newMediaItem: MediaItem = {
      id: uuidv4(),
      type: finalMediaType as MediaType,
      url: finalMediaUrl,
      title: mediaTitle,
      description: mediaDesc,
      timestamp: Date.now(),
      youtubeId: finalMediaType === 'youtube' ? getYoutubeVideoId(mediaUrl) : undefined
    };

    setMediaItems([...mediaItems, newMediaItem]);
    
    // Reset form
    setMediaTitle("");
    setMediaDesc("");
    setMediaUrl("");
    setShowMediaForm(false);

    toast({
      title: "Média ajouté",
      description: `${getMediaTypeLabel(finalMediaType as MediaType)} ajouté à l'utilitaire`
    });
  };

  const removeMediaItem = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
    toast({
      title: "Média supprimé"
    });
  };

  const getMediaTypeLabel = (type: MediaType) => {
    switch(type) {
      case 'image': return 'Image';
      case 'video': return 'Vidéo';
      case 'youtube': return 'YouTube';
      case 'gif': return 'GIF';
      default: return 'Média';
    }
  };

  const renderMediaPreview = (item: MediaItem) => {
    switch(item.type) {
      case 'image':
        return (
          <div className="relative">
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-32 object-cover rounded-md" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        );
      case 'youtube':
        return (
          <div className="relative">
            <img 
              src={item.youtubeId ? getYoutubeThumbnailUrl(item.youtubeId) : "/placeholder.svg"} 
              alt={item.title} 
              className="w-full h-32 object-cover rounded-md" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">
              <Youtube className="w-3 h-3 mr-1" />
              YouTube
            </span>
          </div>
        );
      case 'gif':
        return (
          <div className="relative">
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-32 object-cover rounded-md" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              GIF
            </span>
          </div>
        );
      case 'video':
        return (
          <div className="relative">
            <div className="w-full h-32 bg-gray-800 rounded-md flex items-center justify-center">
              <Film className="w-8 h-8 text-gray-400" />
            </div>
            <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              Vidéo
            </span>
          </div>
        );
      default:
        return <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
          <FileType className="w-8 h-8 text-gray-400" />
        </div>;
    }
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-16 bg-accent/10 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
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

          {/* Section des médias */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Médias</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowMediaForm(!showMediaForm)}
              >
                {showMediaForm ? "Annuler" : "Ajouter un média"}
              </Button>
            </div>

            {/* Formulaire d'ajout de média */}
            {showMediaForm && (
              <div className="p-4 border rounded-md space-y-3 bg-muted/20">
                <div>
                  <Label htmlFor="media-type">Type de média</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={mediaType === 'image' ? 'default' : 'outline'}
                      onClick={() => setMediaType('image')}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      Image
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={mediaType === 'video' ? 'default' : 'outline'}
                      onClick={() => setMediaType('video')}
                    >
                      <Film className="mr-2 h-4 w-4" />
                      Vidéo/YouTube
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={mediaType === 'gif' ? 'default' : 'outline'}
                      onClick={() => setMediaType('gif')}
                    >
                      <FileType className="mr-2 h-4 w-4" />
                      GIF
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="media-title">Titre du média</Label>
                  <Input
                    id="media-title"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder="Ex: Position de départ"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="media-url">URL du média</Label>
                  <Input
                    id="media-url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder={mediaType === 'video' ? "https://youtube.com/watch?v=XXXX ou autre URL vidéo" : "https://exemple.com/image.jpg"}
                    className="mt-1"
                  />
                  {mediaType === 'video' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Pour YouTube, copiez l'URL de la vidéo (ex: https://www.youtube.com/watch?v=XXXX)
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="media-desc">Description (optionnelle)</Label>
                  <Textarea
                    id="media-desc"
                    value={mediaDesc}
                    onChange={(e) => setMediaDesc(e.target.value)}
                    placeholder="Description du média..."
                    className="mt-1"
                  />
                </div>

                <Button
                  type="button"
                  onClick={addMediaItem}
                  disabled={!isMediaFormValid}
                  className="w-full"
                >
                  Ajouter ce média
                </Button>
              </div>
            )}

            {/* Liste des médias */}
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {mediaItems.map(item => (
                  <div key={item.id} className="border rounded-md overflow-hidden">
                    {renderMediaPreview(item)}
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMediaItem(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md text-muted-foreground">
                Aucun média ajouté
              </div>
            )}
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
