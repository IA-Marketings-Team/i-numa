
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { mapProfileToClient } from "./utils/mapProfileToClient";
import { mapClientToDbFormat } from "./utils/mapClientToDbFormat";

/**
 * Crée un nouveau client
 */
export const createClient = async (clientData: Omit<Client, 'id' | 'dateCreation' | 'role'>): Promise<Client | null> => {
  try {
    // Prepare the data for database insertion
    const dbData = mapClientToDbFormat({
      ...clientData,
      role: 'client',
      date_creation: new Date().toISOString()
    });

    // When inserting to Supabase, the ID is generated automatically
    // so we don't need to include it in the dbData
    const { data, error } = await supabase
      .from('profiles')
      .insert([dbData])
      .select();

    if (error || !data || data.length === 0) {
      console.error("Erreur lors de la création du client:", error);
      return null;
    }

    return mapProfileToClient(data[0]);
  } catch (error) {
    console.error("Erreur inattendue lors de la création du client:", error);
    return null;
  }
};
