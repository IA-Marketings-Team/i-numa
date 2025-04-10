
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { mapProfileToClient } from "./utils/mapProfileToClient";
import { mapClientToDbFormat } from "./utils/mapClientToDbFormat";

/**
 * Crée un nouveau client
 */
export const createClient = async (clientData: Omit<Client, 'id' | 'dateCreation' | 'role'>): Promise<Client | null> => {
  try {
    const dbData = mapClientToDbFormat({
      ...clientData,
      role: 'client',
      date_creation: new Date().toISOString()
    });

    const { data, error } = await supabase
      .from('profiles')
      .insert(dbData)
      .select()
      .single();

    if (error || !data) {
      console.error("Erreur lors de la création du client:", error);
      return null;
    }

    return mapProfileToClient(data);
  } catch (error) {
    console.error("Erreur inattendue lors de la création du client:", error);
    return null;
  }
};
