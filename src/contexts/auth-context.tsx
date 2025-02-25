
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Admin {
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

const STORAGE_KEY = 'cs2-admin-credentials';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier s'il existe des informations d'administrateur stockées
    const storedAdmin = localStorage.getItem(STORAGE_KEY);
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      // Initialiser avec les valeurs par défaut
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN));
      setAdmin(DEFAULT_ADMIN);
    }

    // Vérifier si l'utilisateur est déjà connecté
    const isLoggedIn = localStorage.getItem('cs2-admin-logged-in') === 'true';
    setIsAuthenticated(isLoggedIn);
  }, []);

  const login = (username: string, password: string) => {
    if (admin && username === admin.username && password === admin.password) {
      setIsAuthenticated(true);
      localStorage.setItem('cs2-admin-logged-in', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cs2-admin-logged-in');
  };

  const updatePassword = (newPassword: string) => {
    if (admin) {
      const updatedAdmin = { ...admin, password: newPassword };
      setAdmin(updatedAdmin);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAdmin));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
