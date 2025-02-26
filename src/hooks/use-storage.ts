
import { useState, useEffect } from 'react';
import { toast } from './use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppState, CSMap, MapCategory, MediaItem, Strategy, Utility } from '../types';

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
          const parsedData = JSON.parse(data);
          
          // Si les cartes n'ont pas de catégorie, on les ajoute
          if (parsedData.maps && parsedData.maps.length > 0 && !parsedData.maps[0].category) {
            // Répartition des cartes par catégorie
            const updatedMaps = parsedData.maps.map((map: CSMap, index: number) => {
              let category: MapCategory;
              
              if (index < 3) {
                category = 'premiere';
              } else if (index < 6) {
                category = 'competitive';
              } else {
                category = 'wingman';
              }
              
              return {
                ...map,
                category
              };
            });
            
            const updatedData = {
              ...parsedData,
              maps: updatedMaps
            };
            
            setState(updatedData);
            saveToLocalStorage(updatedData);
          } else {
            // Vérifier si on doit ajouter de nouvelles cartes
            const existingMapNames = parsedData.maps.map((map: CSMap) => map.name);
            const requiredPremiereMaps = ['Dust 2', 'Inferno', 'Mirage', 'Nuke', 'Vertigo', 'Ancient', 'Anubis', 'Train'];
            const missingMaps = requiredPremiereMaps.filter(mapName => !existingMapNames.includes(mapName));
            
            if (missingMaps.length > 0) {
              const newMaps = missingMaps.map(mapName => ({
                id: uuidv4(),
                name: mapName,
                image: `/maps/${mapName.toLowerCase().replace(/ /g, '')}.jpg`,
                category: 'premiere' as MapCategory,
                strategies: [],
                utilities: []
              }));
              
              // Mettre toutes les cartes requises en catégorie "Première"
              const updatedMaps = parsedData.maps.map((map: CSMap) => {
                if (requiredPremiereMaps.includes(map.name)) {
                  return {
                    ...map,
                    category: 'premiere' as MapCategory
                  };
                }
                return map;
              });
              
              const updatedData = {
                ...parsedData,
                maps: [...updatedMaps, ...newMaps]
              };
              
              setState(updatedData);
              saveToLocalStorage(updatedData);
            } else {
              // Vérifier si nous devons mettre à jour les catégories des cartes existantes
              let needsUpdate = false;
              const updatedMaps = parsedData.maps.map((map: CSMap) => {
                if (requiredPremiereMaps.includes(map.name) && map.category !== 'premiere') {
                  needsUpdate = true;
                  return {
                    ...map,
                    category: 'premiere' as MapCategory
                  };
                }
                return map;
              });
              
              if (needsUpdate) {
                const updatedData = {
                  ...parsedData,
                  maps: updatedMaps
                };
                
                setState(updatedData);
                saveToLocalStorage(updatedData);
              } else {
                setState(parsedData);
              }
            }
          }
        } else {
          // Initialize with default maps
          const defaultMaps: CSMap[] = [
            {
              id: uuidv4(),
              name: 'Dust 2',
              image: '/maps/dust2.jpg',
              category: 'premiere',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Inferno',
              image: '/maps/inferno.jpg',
              category: 'premiere',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Mirage',
              image: '/maps/mirage.jpg',
              category: 'premiere',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Nuke',
              image: '/maps/nuke.jpg',
              category: 'premiere',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Vertigo',
              image: '/maps/vertigo.jpg',
              category: 'premiere',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Ancient',
              image: '/maps/ancient.jpg',
              category: 'premiere',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Anubis',
              image: '/maps/anubis.jpg',
              category: 'premiere',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Train',
              image: '/maps/train.jpg',
              category: 'premiere',
              strategies: [],
              utilities: []
            },
            {
              id: uuidv4(),
              name: 'Overpass',
              image: '/maps/overpass.jpg',
              category: 'competitive',
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
      category: map.category,
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
  
  const updateMapImage = (mapId: string, imageUrl: string) => {
    const newState = {
      ...state,
      maps: state.maps.map(map => {
        if (map.id === mapId) {
          return {
            ...map,
            image: imageUrl
          };
        }
        return map;
      })
    };
    
    setState(newState);
    saveToLocalStorage(newState);
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
    deleteUtility,
    updateMapImage
  };
}
