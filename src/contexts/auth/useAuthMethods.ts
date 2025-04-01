import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getUserByAuthId, createUser } from "@/services/supabase/usersService";
import { isDemoAccount, getDemoUserRole } from "./demoUserHandling";

export const useAuthMethods = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setSession: (session: any) => void
) => {
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Tentative de connexion pour:", email);
      
      // Nettoyer l'email (enlever les espaces et convertir en minuscules)
      const cleanedEmail = email.trim().toLowerCase();
      
      // Si c'est un compte de démo, on utilise une logique spéciale
      if (isDemoAccount(cleanedEmail)) {
        console.log("Compte de démonstration détecté, authentification en cours");
        
        try {
          // Récupérer l'utilisateur depuis la base de données
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', cleanedEmail)
            .single();

          if (userError || !userData) {
            console.error("Utilisateur de démo non trouvé:", userError);
            toast({
              title: "Échec de connexion",
              description: "Compte de démonstration introuvable. Veuillez contacter le support.",
              variant: "destructive",
            });
            return false;
          }

          // Authentification avec Supabase Auth
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanedEmail,
            password: "demo12345"
          });

          if (error) {
            console.error("Erreur d'authentification pour le compte de démo:", error.message);
            toast({
              title: "Échec de connexion",
              description: "Problème technique avec le compte de démonstration. Veuillez réessayer.",
              variant: "destructive",
            });
            return false;
          }

          if (data.user) {
            console.log("Authentification réussie pour le compte de démo:", cleanedEmail);
            
            // Convertir les données utilisateur en objet User
            const user: User = {
              id: userData.id,
              nom: userData.nom,
              prenom: userData.prenom,
              email: userData.email,
              telephone: userData.telephone,
              role: userData.role as UserRole,
              dateCreation: new Date(userData.date_creation),
              adresse: userData.adresse || undefined,
              ville: userData.ville || undefined,
              codePostal: userData.code_postal || undefined,
            };

            // Mettre à jour l'état de l'utilisateur
            setUser(user);
            setIsAuthenticated(true);
            setSession(data.session);

            toast({
              title: "Connexion réussie",
              description: `Bienvenue, ${user.prenom} ${user.nom} (${user.role})`,
            });

            return true;
          }
          
          return false;
        } catch (demoError) {
          console.error("Erreur inattendue avec le compte de démo:", demoError);
          toast({
            title: "Erreur",
            description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
            variant: "destructive",
          });
          return false;
        }
      } else {
        // Logique de connexion standard pour les comptes non-démo
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanedEmail,
          password
        });

        if (error) {
          console.error("Erreur de connexion:", error.message);
          toast({
            title: "Échec de connexion",
            description: "Identifiants incorrects. Veuillez réessayer.",
            variant: "destructive",
          });
          return false;
        }

        if (data.user) {
          console.log("Authentification réussie pour:", cleanedEmail);
          
          // Récupérer les informations complètes de l'utilisateur
          const userData = await getUserByAuthId(data.user.id);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            setSession(data.session);
            
            toast({
              title: "Connexion réussie",
              description: "Vous êtes maintenant connecté",
            });
            
            return true;
          }
        }
        
        return false;
      }
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
    try {
      console.log("Tentative de déconnexion");
      
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
      
      console.log("Déconnexion réussie");
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error) {
      console.error("Erreur inattendue lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de la déconnexion",
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

  return { login, logout, hasPermission };
};
