
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { mapClientToDbFormat } from "./utils/mapClientToDbFormat";

/**
 * Met à jour les informations d'un client existant
 */
export const updateClient = async (id: string, clientData: Partial<Client>): Promise<boolean> => {
  try {
    // Format data for the database
    const dbData = mapClientToDbFormat({
      ...clientData,
      id // Make sure to include the ID for the update
    });

    const { error } = await supabase
      .from('profiles')
      .update(dbData)
      .eq('id', id)
      .eq('role', 'client');

    if (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur inattendue lors de la mise à jour du client:", error);
    return false;
  }
};
