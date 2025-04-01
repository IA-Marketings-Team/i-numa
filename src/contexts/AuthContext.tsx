
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUserByAuthId } from "@/services/supabase/usersService";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Configurer le listener pour les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        // Si l'utilisateur est connecté, récupérer ses informations complètes
        if (currentSession?.user) {
          setTimeout(async () => {
            try {
              // Utilisons auth_id pour chercher l'utilisateur
              const userData = await getUserByAuthId(currentSession.user.id);
              if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
              } else {
                console.error("Utilisateur authentifié mais non trouvé dans la table users");
                // Gérer le cas où l'authentification est réussie mais l'utilisateur n'existe pas dans la table users
                toast({
                  title: "Erreur",
                  description: "Votre profil utilisateur est incomplet. Contactez l'administrateur.",
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Vérifier la session existante au chargement
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession?.user) {
        setSession(currentSession);
        
        // Récupérer les informations complètes de l'utilisateur
        getUserByAuthId(currentSession.user.id)
          .then(userData => {
            if (userData) {
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              console.error("Session trouvée mais utilisateur non trouvé dans la table users");
            }
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des données utilisateur:", error);
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erreur de connexion:", error.message);
        toast({
          title: "Échec de connexion",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        // La mise à jour de l'utilisateur se fait via onAuthStateChange
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erreur inattendue lors de la connexion:", error);
      toast({
        title: "Échec de connexion",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Erreur lors de la déconnexion:", error.message);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion: " + error.message,
        variant: "destructive",
      });
      return;
    }
    
    setUser(null);
    setIsAuthenticated(false);
    setSession(null);
    
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    
    // Le responsable a accès à tout
    if (user.role === 'responsable') return true;
    
    // Vérifier si le rôle de l'utilisateur est dans la liste des rôles requis
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasPermission }}>
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
