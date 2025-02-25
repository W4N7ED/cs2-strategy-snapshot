
import { Home, Map, BookOpen, Plus, Keyboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function NavBar() {
  const location = useLocation();
  const path = location.pathname;
  
  const isActive = (route: string) => {
    return path === route || (route !== "/" && path.startsWith(route));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-border flex justify-around items-center p-3 z-50">
      <Link to="/" className={`flex flex-col items-center justify-center text-muted-foreground transition-all hover:text-foreground active:scale-95 ${isActive("/") ? "text-accent" : ""}`}>
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Accueil</span>
      </Link>
      
      <Link to="/maps" className={`flex flex-col items-center justify-center text-muted-foreground transition-all hover:text-foreground active:scale-95 ${isActive("/maps") ? "text-accent" : ""}`}>
        <Map className="h-6 w-6" />
        <span className="text-xs mt-1">Cartes</span>
      </Link>
      
      <Link to="/add" className="flex flex-col items-center">
        <div className="bg-accent rounded-full p-3 -mt-8 shadow-lg">
          <Plus className="h-6 w-6 text-accent-foreground" />
        </div>
        <span className="text-xs mt-1">Ajouter</span>
      </Link>
      
      <Link to="/strategies" className={`flex flex-col items-center justify-center text-muted-foreground transition-all hover:text-foreground active:scale-95 ${isActive("/strategies") ? "text-accent" : ""}`}>
        <BookOpen className="h-6 w-6" />
        <span className="text-xs mt-1">Stratégies</span>
      </Link>
      
      <Link to="/binds" className={`flex flex-col items-center justify-center text-muted-foreground transition-all hover:text-foreground active:scale-95 ${isActive("/binds") ? "text-accent" : ""}`}>
        <Keyboard className="h-6 w-6" />
        <span className="text-xs mt-1">Binds</span>
      </Link>
    </nav>
  );
}
