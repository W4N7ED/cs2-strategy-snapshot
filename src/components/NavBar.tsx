
import { Home, Map, BookOpen, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function NavBar() {
  const location = useLocation();
  const path = location.pathname;
  
  const isActive = (route: string) => {
    return path === route || (route !== "/" && path.startsWith(route));
  };

  return (
    <nav className="cs-navbar">
      <Link to="/" className={`cs-navbar-icon ${isActive("/") ? "cs-navbar-icon-active" : ""}`}>
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Accueil</span>
      </Link>
      
      <Link to="/maps" className={`cs-navbar-icon ${isActive("/maps") ? "cs-navbar-icon-active" : ""}`}>
        <Map className="h-6 w-6" />
        <span className="text-xs mt-1">Cartes</span>
      </Link>
      
      <Link to="/add" className="flex flex-col items-center">
        <div className="bg-accent rounded-full p-3 -mt-8 shadow-lg">
          <Plus className="h-6 w-6 text-accent-foreground" />
        </div>
        <span className="text-xs mt-1">Ajouter</span>
      </Link>
      
      <Link to="/strategies" className={`cs-navbar-icon ${isActive("/strategies") ? "cs-navbar-icon-active" : ""}`}>
        <BookOpen className="h-6 w-6" />
        <span className="text-xs mt-1">Stratégies</span>
      </Link>
      
      <Link to="/profile" className={`cs-navbar-icon ${isActive("/profile") ? "cs-navbar-icon-active" : ""}`}>
        <div className="h-6 w-6 rounded-full bg-muted overflow-hidden flex items-center justify-center">
          <span className="text-xs font-medium">CS</span>
        </div>
        <span className="text-xs mt-1">Profil</span>
      </Link>
    </nav>
  );
}
