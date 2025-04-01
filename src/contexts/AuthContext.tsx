
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUserByAuthId, createUser } from "@/services/supabase/usersService";
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
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        // Si l'utilisateur est connecté, récupérer ses informations complètes
        if (currentSession?.user) {
          try {
            // Utilisons auth_id pour chercher l'utilisateur
            const userData = await getUserByAuthId(currentSession.user.id);
            
            if (userData) {
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              console.log("Utilisateur authentifié mais non trouvé dans la table users - Cas comptes de démo");
              
              // Pour les comptes de démonstration, créer un profil si nécessaire
              if (['jean.dupont@example.com', 'thomas.leroy@example.com', 'claire.moreau@example.com', 
                  'ahmed.tayin@example.com', 'marie.andy@example.com'].includes(currentSession.user.email || '')) {
                
                // Déterminer le rôle en fonction de l'email
                let role: UserRole = 'client';
                if (currentSession.user.email === 'thomas.leroy@example.com') role = 'agent_phoner';
                if (currentSession.user.email === 'claire.moreau@example.com') role = 'agent_visio';
                if (currentSession.user.email === 'ahmed.tayin@example.com') role = 'superviseur';
                if (currentSession.user.email === 'marie.andy@example.com') role = 'responsable';
                
                // Créer un profil utilisateur pour le compte de démo
                const names = currentSession.user.email?.split('@')[0].split('.') || [];
                const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
                const lastName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';
                
                try {
                  const newUser = await createUser({
                    nom: lastName,
                    prenom: firstName,
                    email: currentSession.user.email || '',
                    telephone: "0123456789", // Valeur par défaut pour les démos
                    role,
                    auth_id: currentSession.user.id
                  });
                  
                  if (newUser) {
                    setUser(newUser);
                    setIsAuthenticated(true);
                    console.log("Profil utilisateur de démo créé avec succès");
                  }
                } catch (profileError) {
                  console.error("Erreur lors de la création du profil utilisateur de démo:", profileError);
                }
              } else {
                console.error("Utilisateur authentifié mais non trouvé dans la table users");
                toast({
                  title: "Erreur",
                  description: "Votre profil utilisateur est incomplet. Contactez l'administrateur.",
                  variant: "destructive",
                });
              }
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateur:", error);
          }
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
              console.log("Session trouvée mais utilisateur non trouvé dans la table users - tentative de création pour démo");
              
              // Pour les comptes de démonstration, créer un profil si nécessaire
              if (['jean.dupont@example.com', 'thomas.leroy@example.com', 'claire.moreau@example.com', 
                  'ahmed.tayin@example.com', 'marie.andy@example.com'].includes(currentSession.user.email || '')) {
                
                // Déterminer le rôle en fonction de l'email
                let role: UserRole = 'client';
                if (currentSession.user.email === 'thomas.leroy@example.com') role = 'agent_phoner';
                if (currentSession.user.email === 'claire.moreau@example.com') role = 'agent_visio';
                if (currentSession.user.email === 'ahmed.tayin@example.com') role = 'superviseur';
                if (currentSession.user.email === 'marie.andy@example.com') role = 'responsable';
                
                // Créer un profil utilisateur pour le compte de démo
                const names = currentSession.user.email?.split('@')[0].split('.') || [];
                const firstName = names[0] ? names[0].charAt(0).toUpperCase() + names[0].slice(1) : '';
                const lastName = names[1] ? names[1].charAt(0).toUpperCase() + names[1].slice(1) : '';
                
                createUser({
                  nom: lastName,
                  prenom: firstName,
                  email: currentSession.user.email || '',
                  telephone: "0123456789", // Valeur par défaut pour les démos
                  role,
                  auth_id: currentSession.user.id
                })
                  .then(newUser => {
                    if (newUser) {
                      setUser(newUser);
                      setIsAuthenticated(true);
                      console.log("Profil utilisateur de démo créé avec succès");
                    }
                  })
                  .catch(profileError => {
                    console.error("Erreur lors de la création du profil utilisateur de démo:", profileError);
                  });
              } else {
                console.error("Session trouvée mais utilisateur non trouvé dans la table users");
              }
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
