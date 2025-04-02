
import React, { createContext, useContext } from "react";
import { User, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { loginWithEmail, registerWithEmail, signOut, hasPermission } from "@/utils/authUtils";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isAuthenticated, setUser, setSession, setIsAuthenticated } = useAuthState();
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    const { success, error } = await loginWithEmail(email, password);
    
    if (success) {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
      return true;
    } else {
      toast({
        title: "Échec de connexion",
        description: error?.message || "Une erreur est survenue lors de la connexion.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    const { success, error } = await registerWithEmail(email, password, userData);
    
    if (success) {
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
      return true;
    } else {
      toast({
        title: "Échec d'inscription",
        description: error?.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    const { success, error } = await signOut();
    
    if (success) {
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      });
    } else {
      toast({
        title: "Erreur de déconnexion",
        description: error?.message || "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  const checkPermission = (requiredRoles: UserRole[]): boolean => {
    return hasPermission(user, requiredRoles);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      login, 
      register, 
      logout, 
      isAuthenticated, 
      hasPermission: checkPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
