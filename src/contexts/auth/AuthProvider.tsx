
import React, { useEffect } from "react";
import AuthContext from "./AuthContext";
import { useAuthState } from "./useAuthState";
import { useAuthMethods } from "./useAuthMethods";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUserByAuthId } from "@/services/supabase/usersService";
import { isDemoAccount, createDemoUserProfile } from "./demoUserHandling";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, session, setSession } = useAuthState();
  const { login, logout, hasPermission } = useAuthMethods(user, setUser, setIsAuthenticated, setSession);
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
              if (isDemoAccount(currentSession.user.email)) {
                const newUser = await createDemoUserProfile(
                  currentSession.user.id, 
                  currentSession.user.email || ''
                );
                
                if (newUser) {
                  setUser(newUser);
                  setIsAuthenticated(true);
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
              if (isDemoAccount(currentSession.user.email)) {
                createDemoUserProfile(
                  currentSession.user.id, 
                  currentSession.user.email || ''
                )
                  .then(newUser => {
                    if (newUser) {
                      setUser(newUser);
                      setIsAuthenticated(true);
                    }
                  })
                  .catch(error => {
                    console.error("Erreur lors de la création du profil utilisateur de démo:", error);
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
  }, [setUser, setIsAuthenticated, setSession, toast]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login, 
      logout, 
      isAuthenticated, 
      hasPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
