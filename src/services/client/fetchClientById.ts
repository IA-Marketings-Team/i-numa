
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { mapProfileToClient } from "./utils/mapProfileToClient";

/**
 * Récupère un client par son ID
 */
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'client')
      .single();

    if (error || !data) {
      console.error("Erreur lors de la récupération du client:", error);
      return null;
    }

    return mapProfileToClient(data);
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération du client:", error);
    return null;
  }
};
