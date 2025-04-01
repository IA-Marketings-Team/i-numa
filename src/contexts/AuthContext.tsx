import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          try {
            // Get user data from the users table
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();

            if (userData) {
              // Map database fields to User type
              const mappedUser: User = {
                id: userData.id,
                email: userData.email,
                nom: userData.nom,
                prenom: userData.prenom,
                telephone: userData.telephone,
                role: userData.role,
                dateCreation: userData.date_creation ? new Date(userData.date_creation) : new Date(),
                adresse: userData.adresse || "",
                ville: userData.ville || "",
                codePostal: userData.code_postal || "",
                iban: userData.iban || "",
                bic: userData.bic || "",
                nomBanque: userData.nom_banque || "",
                authId: userData.auth_id,
              };
              setUser(mappedUser);
              setIsAuthenticated(true);
            } else {
              console.error("User not found in users table:", error);
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        // Get user data for existing session
        setTimeout(async () => {
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();

            if (userData) {
              // Map database fields to User type
              const mappedUser: User = {
                id: userData.id,
                email: userData.email,
                nom: userData.nom,
                prenom: userData.prenom,
                telephone: userData.telephone,
                role: userData.role,
                dateCreation: userData.date_creation ? new Date(userData.date_creation) : new Date(),
                adresse: userData.adresse || "",
                ville: userData.ville || "",
                codePostal: userData.code_postal || "",
                iban: userData.iban || "",
                bic: userData.bic || "",
                nomBanque: userData.nom_banque || "",
                authId: userData.auth_id,
              };
              setUser(mappedUser);
              setIsAuthenticated(true);
            } else {
              console.error("User not found in users table:", error);
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setIsAuthenticated(false);
          }
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Échec de connexion",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // User data will be fetched by the auth state change listener
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Échec de connexion",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    try {
      // Step 1: Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email!,
        password: password,
        options: {
          data: {
            nom: userData.nom,
            prenom: userData.prenom,
          }
        }
      });

      if (authError) {
        toast({
          title: "Échec d'inscription",
          description: authError.message,
          variant: "destructive",
        });
        return false;
      }

      // Step 2: Create user record in users table
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            email: userData.email,
            nom: userData.nom,
            prenom: userData.prenom,
            telephone: userData.telephone || "",
            role: userData.role || "client",
            auth_id: authData.user?.id,
          }
        ]);

      if (userError) {
        toast({
          title: "Échec de création du profil",
          description: userError.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Échec d'inscription",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion",
        variant: "destructive",
      });
    }
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
      login, 
      logout, 
      isAuthenticated, 
      hasPermission, 
      register,
      session 
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
