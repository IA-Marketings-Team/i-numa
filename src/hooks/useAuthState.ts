
import { useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { fetchUserProfile } from "@/utils/authUtils";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Configurer l'écoute des changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Changement d'état d'authentification:", event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Si nous avons un utilisateur, récupérer son profil
          setTimeout(() => {
            updateUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      }
    );

    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Vérification initiale de la session:", currentSession);
      setSession(currentSession);
      
      if (currentSession?.user) {
        updateUserProfile(currentSession.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateUserProfile = async (userId: string) => {
    const { user: userProfile, error } = await fetchUserProfile(userId);
    
    if (userProfile) {
      setUser(userProfile);
      setIsAuthenticated(true);
    } else {
      console.error("Échec de la récupération du profil utilisateur:", error);
      setUser(null);
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    setUser,
    setSession,
    setIsAuthenticated
  };
};
