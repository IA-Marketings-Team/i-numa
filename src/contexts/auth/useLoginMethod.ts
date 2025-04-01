
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { customLogin } from "@/services/supabase/authService";
import { isDemoAccount, createDemoUserProfile } from "./demoUserHandling";

export const useLoginMethod = (
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
        console.log("Compte de démonstration détecté, traitement spécial");
        
        // Pour les comptes de démo, simuler une connexion réussie sans authentification réelle
        // et créer directement un profil utilisateur de démo
        try {
          const demoUser = await createDemoUserProfile(
            `demo_${cleanedEmail.replace('@', '_at_')}`, // Générer un ID fictif pour le démo
            cleanedEmail
          );
          
          if (demoUser) {
            console.log("Profil utilisateur de démo configuré:", demoUser);
            
            // Mettre à jour l'état de l'application
            setUser(demoUser);
            setIsAuthenticated(true);
            setSession({ user: { id: demoUser.id, email: demoUser.email } });
            
            toast({
              title: "Connexion réussie",
              description: `Bienvenue, ${demoUser.prenom} ${demoUser.nom} (${demoUser.role})`,
            });
            
            return true;
          } else {
            console.error("Échec de création du profil utilisateur de démo");
            toast({
              title: "Échec de connexion",
              description: "Erreur lors de la configuration du compte de démonstration",
              variant: "destructive",
            });
            return false;
          }
        } catch (profileError) {
          console.error("Erreur lors de la création du profil démo:", profileError);
          toast({
            title: "Erreur",
            description: "Erreur lors de la création de votre profil de démo. Veuillez réessayer.",
            variant: "destructive",
          });
          return false;
        }
      } else {
        // Utiliser notre service d'authentification personnalisé
        try {
          const { token, user } = await customLogin(cleanedEmail, password);
          
          if (!user) {
            console.error("Authentification réussie mais profil utilisateur non trouvé");
            toast({
              title: "Erreur",
              description: "Profil utilisateur non trouvé. Veuillez contacter le support.",
              variant: "destructive",
            });
            return false;
          }
          
          // Mettre à jour l'état de l'application
          setUser(user);
          setIsAuthenticated(true);
          setSession({ token, user: { id: user.id, email: user.email } });
          
          toast({
            title: "Connexion réussie",
            description: `Bienvenue, ${user.prenom} ${user.nom}`,
          });
          
          return true;
        } catch (error: any) {
          console.error("Erreur lors de la connexion:", error.message || error);
          toast({
            title: "Échec de connexion",
            description: "Identifiants incorrects. Veuillez réessayer.",
            variant: "destructive",
          });
          return false;
        }
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

  return { login };
};
