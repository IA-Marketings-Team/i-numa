
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getUserByAuthId, createUser } from "@/services/supabase/usersService";

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
        console.log("Authentification réussie pour:", email);
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
