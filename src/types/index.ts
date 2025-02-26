
export type MediaType = 'image' | 'gif' | 'video' | 'youtube';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  title: string;
  description: string;
  timestamp: number;
  youtubeId?: string;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  side: 'T' | 'CT';
  media: MediaItem[];
  timestamp: number;
}

export interface Utility {
  id: string;
  type: 'smoke' | 'flash' | 'grenade' | 'molotov';
  title: string;
  description: string;
  side: 'T' | 'CT';
  media: MediaItem[];
  timestamp: number;
}

export interface Bind {
  id: string;
  key: string;
  command: string;
  description: string;
  category: 'communication' | 'movement' | 'combat' | 'utility' | 'other';
}

export type MapCategory = 'premiere' | 'competitive' | 'wingman';

export interface CSMap {
  id: string;
  name: string;
  image: string;
  category: MapCategory;
  strategies: Strategy[];
  utilities: Utility[];
}

export interface AppState {
  maps: CSMap[];
  currentMap: string | null;
  binds: Bind[];
}
