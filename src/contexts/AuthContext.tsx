
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { login as loginService, loginAsGuest, logoutUser, getUserProfile } from "@/services/authService";
import { getCurrentUser } from "@/lib/realm";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (roles: UserRole[]) => boolean;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Vérification de l'état d'authentification au chargement
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const realmUser = getCurrentUser();
        if (realmUser) {
          const userProfile = await getUserProfile(realmUser.id);
          if (userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const loggedInUser = await loginService(email, password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${loggedInUser.prenom} ${loggedInUser.nom}!`,
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Échec de la connexion",
          description: "Email ou mot de passe incorrect.",
        });
        return false;
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la déconnexion.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role as UserRole);
  };

  // Nouvelle méthode pour obtenir le token d'authentification
  const getToken = async (): Promise<string | null> => {
    try {
      const realmUser = getCurrentUser();
      if (realmUser) {
        // Récupérer le token d'accès depuis Realm
        return await realmUser.accessToken;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération du token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      hasPermission,
      getToken,
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
