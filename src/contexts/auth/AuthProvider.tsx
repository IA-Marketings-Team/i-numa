
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
    console.log("Initialisation du provider d'authentification");
    
    // Configurer le listener pour les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        // Mettre à jour l'état de la session immédiatement
        setSession(currentSession);
        
        // Si l'utilisateur est connecté, récupérer ses informations complètes
        if (currentSession?.user) {
          try {
            console.log("Session trouvée, récupération du profil utilisateur");
            // Utilisons auth_id pour chercher l'utilisateur
            const userData = await getUserByAuthId(currentSession.user.id);
            
            if (userData) {
              console.log("Profil utilisateur trouvé dans la base de données");
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              console.log("Utilisateur authentifié mais non trouvé dans la table users - Cas comptes de démo");
              
              // Pour les comptes de démonstration, créer un profil si nécessaire
              if (isDemoAccount(currentSession.user.email)) {
                console.log("Compte de démonstration détecté, création du profil...");
                const newUser = await createDemoUserProfile(
                  currentSession.user.id, 
                  currentSession.user.email || ''
                );
                
                if (newUser) {
                  console.log("Profil de démonstration créé avec succès");
                  setUser(newUser);
                  setIsAuthenticated(true);
                } else {
                  console.error("Échec de création du profil de démonstration");
                  toast({
                    title: "Erreur",
                    description: "Impossible de créer votre profil utilisateur.",
                    variant: "destructive",
                  });
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
            toast({
              title: "Erreur",
              description: "Erreur lors de la récupération de votre profil.",
              variant: "destructive",
            });
          }
        } else {
          // Réinitialiser l'état si l'utilisateur est déconnecté
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Vérifier la session existante au chargement
    const checkExistingSession = async () => {
      console.log("Vérification de session existante");
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        console.log("Session existante trouvée");
        setSession(currentSession);
        
        try {
          // Récupérer les informations complètes de l'utilisateur
          const userData = await getUserByAuthId(currentSession.user.id);
          
          if (userData) {
            console.log("Profil utilisateur trouvé pour la session existante");
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            console.log("Session trouvée mais utilisateur non trouvé dans la table users - tentative de création pour démo");
            
            // Pour les comptes de démonstration, créer un profil si nécessaire
            if (isDemoAccount(currentSession.user.email)) {
              console.log("Compte de démo détecté, création du profil...");
              const newUser = await createDemoUserProfile(
                currentSession.user.id, 
                currentSession.user.email || ''
              );
              
              if (newUser) {
                console.log("Profil de démonstration créé avec succès pour session existante");
                setUser(newUser);
                setIsAuthenticated(true);
              } else {
                console.error("Échec de création du profil de démonstration pour session existante");
              }
            } else {
              console.error("Session trouvée mais utilisateur non trouvé dans la table users");
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
        }
      } else {
        console.log("Aucune session existante trouvée");
      }
    };
    
    checkExistingSession();

    return () => {
      console.log("Nettoyage du provider d'authentification");
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
