
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Configurer l'écoute des changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change:", event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Si nous avons un utilisateur, récupérer son profil
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession);
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations du profil.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email,
          telephone: data.telephone || '',
          role: data.role as UserRole,
          dateCreation: new Date(data.date_creation || Date.now()),
          adresse: data.adresse,
          ville: data.ville,
          codePostal: data.code_postal,
          iban: data.iban,
          bic: data.bic,
          nomBanque: data.nom_banque
        };

        setUser(userProfile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Échec de connexion",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Erreur inattendue",
        description: "Une erreur est survenue lors de la connexion.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom: userData.nom,
            prenom: userData.prenom,
            role: userData.role || 'client'
          }
        }
      });

      if (error) {
        console.error("Register error:", error);
        toast({
          title: "Échec d'inscription",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Unexpected register error:", error);
      toast({
        title: "Erreur inattendue",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    
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
    <AuthContext.Provider value={{ 
      user, 
      session, 
      login, 
      register, 
      logout, 
      isAuthenticated, 
      hasPermission 
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
