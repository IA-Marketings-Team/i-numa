
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { mapProfileToClient } from "./utils/mapProfileToClient";

/**
 * Récupère tous les clients
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('nom', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      return [];
    }

    return data ? data.map(mapProfileToClient) : [];
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des clients:", error);
    return [];
  }
};
