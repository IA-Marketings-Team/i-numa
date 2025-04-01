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
        
        // Pour les comptes de démo, effectuer une connexion directe avec le mot de passe standard
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanedEmail,
          password: "demo12345"  // Mot de passe fixe pour tous les comptes de démo
        });

        if (error) {
          console.error("Erreur d'authentification pour le compte de démo:", error.message);
          
          // Message d'erreur plus détaillé pour déboguer
          toast({
            title: "Échec de connexion",
            description: `Erreur: ${error.message}. Veuillez contacter le support.`,
            variant: "destructive",
          });
          return false;
        }

        if (data.user) {
          console.log("Authentification réussie pour le compte de démo:", data.user);
          
          try {
            // Récupérer l'utilisateur depuis la base de données
            const userData = await getUserByAuthId(data.user.id);
            
            if (userData) {
              console.log("Profil utilisateur de démo trouvé:", userData);
              setUser(userData);
              setIsAuthenticated(true);
              setSession(data.session);
              
              toast({
                title: "Connexion réussie",
                description: `Bienvenue, ${userData.prenom} ${userData.nom} (${userData.role})`,
              });
              
              return true;
            } else {
              console.log("Profil utilisateur de démo non trouvé dans la base, tentative de recherche par email");
              
              // Recherche alternative par email
              const { data: userByEmail, error: userEmailError } = await supabase
                .from('users')
                .select('*')
                .eq('email', cleanedEmail)
                .single();
              
              if (userEmailError || !userByEmail) {
                console.error("Utilisateur démo non trouvé par email:", userEmailError);
                toast({
                  title: "Échec de connexion",
                  description: "Profil utilisateur introuvable. Veuillez contacter le support.",
                  variant: "destructive",
                });
                return false;
              }
              
              // Mettre à jour l'auth_id dans la table users
              const { error: updateError } = await supabase
                .from('users')
                .update({ auth_id: data.user.id })
                .eq('id', userByEmail.id);
              
              if (updateError) {
                console.error("Erreur lors de la mise à jour de l'auth_id:", updateError);
              }
              
              // Convertir les données utilisateur en objet User
              const demoUser: User = {
                id: userByEmail.id,
                nom: userByEmail.nom,
                prenom: userByEmail.prenom,
                email: userByEmail.email,
                telephone: userByEmail.telephone,
                role: userByEmail.role as UserRole,
                dateCreation: new Date(userByEmail.date_creation),
                adresse: userByEmail.adresse || undefined,
                ville: userByEmail.ville || undefined,
                codePostal: userByEmail.code_postal || undefined,
              };
              
              // Mettre à jour l'état de l'utilisateur
              setUser(demoUser);
              setIsAuthenticated(true);
              setSession(data.session);
              
              toast({
                title: "Connexion réussie",
                description: `Bienvenue, ${demoUser.prenom} ${demoUser.nom} (${demoUser.role})`,
              });
              
              return true;
            }
          } catch (profileError) {
            console.error("Erreur lors de la récupération du profil démo:", profileError);
            toast({
              title: "Erreur",
              description: "Erreur lors de la récupération de votre profil. Veuillez réessayer.",
              variant: "destructive",
            });
            return false;
          }
        }
        
        return false;
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
