
import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Keyboard } from "lucide-react";

const CATEGORIES = [
  { id: 'all', label: 'Tous les binds' },
  { id: 'communication', label: 'Communication' },
  { id: 'movement', label: 'Mouvement' },
  { id: 'combat', label: 'Combat' },
  { id: 'utility', label: 'Utilitaires' },
  { id: 'other', label: 'Autres' }
];

const DEFAULT_BINDS = [
  { id: '1', key: 'W', command: '+forward', description: 'Avancer', category: 'movement' },
  { id: '2', key: 'S', command: '+back', description: 'Reculer', category: 'movement' },
  { id: '3', key: 'A', command: '+moveleft', description: 'Gauche', category: 'movement' },
  { id: '4', key: 'D', command: '+moveright', description: 'Droite', category: 'movement' },
  { id: '5', key: 'SPACE', command: '+jump', description: 'Sauter', category: 'movement' },
  { id: '6', key: 'CTRL', command: '+duck', description: 'S\'accroupir', category: 'movement' },
  { id: '7', key: 'SHIFT', command: '+speed', description: 'Marcher', category: 'movement' },
  { id: '8', key: 'Mouse1', command: '+attack', description: 'Tirer', category: 'combat' },
  { id: '9', key: 'Mouse2', command: '+attack2', description: 'Viser/Utiliser', category: 'combat' },
  { id: '10', key: 'R', command: '+reload', description: 'Recharger', category: 'combat' },
  { id: '11', key: 'G', command: 'drop', description: 'Lâcher l\'arme', category: 'combat' },
  { id: '12', key: '1-0', command: 'slot1-10', description: 'Sélection d\'arme', category: 'combat' },
  { id: '13', key: 'Q', command: 'lastinv', description: 'Dernière arme', category: 'combat' },
  { id: '14', key: 'E', command: '+use', description: 'Utiliser', category: 'utility' },
  { id: '15', key: 'F', command: '+lookatweapon', description: 'Inspecter l\'arme', category: 'other' },
  { id: '16', key: 'T', command: '+spray_menu', description: 'Menu des tags', category: 'communication' },
  { id: '17', key: 'U', command: 'messagemode2', description: 'Chat équipe', category: 'communication' },
  { id: '18', key: 'Y', command: 'messagemode', description: 'Chat global', category: 'communication' },
  { id: '19', key: 'V', command: '+voicerecord', description: 'Micro', category: 'communication' },
  { id: '20', key: 'TAB', command: '+showscores', description: 'Tableau des scores', category: 'other' },
];

export default function Binds() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBinds = DEFAULT_BINDS.filter(bind => {
    const categoryMatch = selectedCategory === 'all' || bind.category === selectedCategory;
    const searchMatch = !searchQuery || 
      bind.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bind.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-32 bg-accent/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Keyboard className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Binds CS2</h1>
          </div>
        </div>
      </div>

      <main className="container px-4 py-6">
        <div className="flex gap-4 mb-6">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredBinds.map(bind => (
            <Card key={bind.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">{bind.key}</CardTitle>
                  <Button variant="ghost" className="text-sm">
                    Copier
                  </Button>
                </div>
                <CardDescription>{bind.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="bg-muted p-2 rounded block text-sm">
                  bind {bind.key.toLowerCase()} "{bind.command}"
                </code>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <NavBar />
    </div>
  );
}
