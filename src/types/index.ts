
export type MediaType = 'image' | 'gif' | 'video';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  title: string;
  description: string;
  timestamp: number;
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
  media: MediaItem[];
  timestamp: number;
}

export interface CSMap {
  id: string;
  name: string;
  image: string;
  strategies: Strategy[];
  utilities: Utility[];
}

export interface AppState {
  maps: CSMap[];
  currentMap: string | null;
}
