
import { supabase } from "@/integrations/supabase/client";

/**
 * Supprime un client existant
 */
export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .eq('role', 'client');

    if (error) {
      console.error("Erreur lors de la suppression du client:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur inattendue lors de la suppression du client:", error);
    return false;
  }
};
