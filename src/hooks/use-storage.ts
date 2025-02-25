
import { useState, useEffect } from 'react';
import { toast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppState, CSMap, MediaItem, Strategy, Utility } from '../types';

const STORAGE_KEY = 'cs2-strategy-app-data';

export function useStorage() {
  const [state, setState] = useState<AppState>({ maps: [], currentMap: null, binds: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with some default maps
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        setIsLoading(true);
        
        // Check if data exists in localStorage
        const data = localStorage.getItem(STORAGE_KEY);
        
        if (data) {
          setState(JSON.parse(data));
        } else {
          // Initialize with default maps
          const defaultMaps: CSMap[] = [
            {
              id: uuidv4(),
              name: 'Mirage',
              image: 'https://static.wikia.nocookie.net/cswikia/images/4/4c/Csgo_mirage.jpg',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Dust 2',
              image: 'https://static.wikia.nocookie.net/cswikia/images/1/1e/Csgo_dust2.jpg',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Inferno',
              image: 'https://static.wikia.nocookie.net/cswikia/images/5/5d/Csgo_inferno.jpg',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Nuke',
              image: 'https://static.wikia.nocookie.net/cswikia/images/f/f2/Csgo_nuke.jpg',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Overpass',
              image: 'https://static.wikia.nocookie.net/cswikia/images/f/f4/Csgo_overpass.jpg',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Ancient',
              image: 'https://static.wikia.nocookie.net/cswikia/images/3/35/Csgo_ancient.jpg',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Vertigo',
              image: 'https://static.wikia.nocookie.net/cswikia/images/8/89/Csgo_vertigo.jpg',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Anubis',
              image: 'https://static.wikia.nocookie.net/cswikia/images/e/e5/Anubis_cs2.jpg',
              strategies: [],
              utilities: []
            }
          ];
          
          setState({ maps: defaultMaps, currentMap: null, binds: [] });
          saveToLocalStorage({ maps: defaultMaps, currentMap: null, binds: [] });
        }
      } catch (error) {
        console.error('Error initializing storage:', error);
        toast({
          title: "Erreur",
          description: "Problème lors de l'initialisation des données",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeStorage();
  }, []);
  
  const saveToLocalStorage = (data: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };
  
  const addMap = (map: Omit<CSMap, 'id' | 'strategies' | 'utilities'>) => {
    const newMap: CSMap = {
      id: uuidv4(),
      name: map.name,
      image: map.image,
      strategies: [],
      utilities: []
    };
    
    const newState = {
      ...state,
      maps: [...state.maps, newMap]
    };
    
    setState(newState);
    saveToLocalStorage(newState);
    return newMap;
  };
  
  const addStrategy = (mapId: string, strategy: Omit<Strategy, 'id' | 'timestamp'>) => {
    const newStrategy: Strategy = {
      id: uuidv4(),
      ...strategy,
      timestamp: Date.now()
    };
    
    const newState = {
      ...state,
      maps: state.maps.map(map => {
        if (map.id === mapId) {
          return {
            ...map,
            strategies: [...map.strategies, newStrategy]
          };
        }
        return map;
      })
    };
    
    setState(newState);
    saveToLocalStorage(newState);
    return newStrategy;
  };
  
  const addUtility = (mapId: string, utility: Omit<Utility, 'id' | 'timestamp'>) => {
    const newUtility: Utility = {
      id: uuidv4(),
      ...utility,
      timestamp: Date.now()
    };
    
    const newState = {
      ...state,
      maps: state.maps.map(map => {
        if (map.id === mapId) {
          return {
            ...map,
            utilities: [...map.utilities, newUtility]
          };
        }
        return map;
      })
    };
    
    setState(newState);
    saveToLocalStorage(newState);
    return newUtility;
  };
  
  const setCurrentMap = (mapId: string | null) => {
    const newState = {
      ...state,
      currentMap: mapId
    };
    
    setState(newState);
    saveToLocalStorage(newState);
  };
  
  const deleteStrategy = (mapId: string, strategyId: string) => {
    const newState = {
      ...state,
      maps: state.maps.map(map => {
        if (map.id === mapId) {
          return {
            ...map,
            strategies: map.strategies.filter(strategy => strategy.id !== strategyId)
          };
        }
        return map;
      })
    };
    
    setState(newState);
    saveToLocalStorage(newState);
  };
  
  const deleteUtility = (mapId: string, utilityId: string) => {
    const newState = {
      ...state,
      maps: state.maps.map(map => {
        if (map.id === mapId) {
          return {
            ...map,
            utilities: map.utilities.filter(utility => utility.id !== utilityId)
          };
        }
        return map;
      })
    };
    
    setState(newState);
    saveToLocalStorage(newState);
  };
  
  return {
    state,
    isLoading,
    addMap,
    addStrategy,
    addUtility,
    setCurrentMap,
    deleteStrategy,
    deleteUtility
  };
}
