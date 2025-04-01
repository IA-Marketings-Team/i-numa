
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";

export const useLogoutMethod = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setSession: (session: any) => void
) => {
  const { toast } = useToast();

  const logout = async () => {
    try {
      console.log("Tentative de déconnexion");
      
      // Avec notre authentification personnalisée, nous n'avons pas besoin de 
      // faire une requête au serveur, nous pouvons simplement effacer les états
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      
      // Effacer le token stocké localement (si applicable)
      localStorage.removeItem('auth_token');
      
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

  return { logout };
};
