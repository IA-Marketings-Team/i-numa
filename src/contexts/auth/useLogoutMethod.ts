
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useLogoutMethod = (
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setSession: (session: any) => void
) => {
  const { toast } = useToast();

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

  return { logout };
};
