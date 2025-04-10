
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { parseCSVFile } from "./utils/parseCSVFile";
import { mapClientToDbFormat } from "./utils/mapClientToDbFormat";
import { mapProfileToClient } from "./utils/mapProfileToClient";
import { v4 as uuidv4 } from 'uuid';

// Export des fonctions individuelles
export * from "./createClient";
export * from "./fetchClients";
export * from "./fetchClientById";
export * from "./updateClient";
export * from "./deleteClient";
export * from "./utils/parseCSVFile";

/**
 * Service pour gérer les clients
 */
export const clientService = {
  /**
   * Crée un nouveau client
   */
  createClient: async (client: Partial<Client>): Promise<{ data: Client | null; error: any }> => {
    try {
      // Convertir le client en format DB
      const clientData = mapClientToDbFormat(client);
      
      // Ajouter un ID si non fourni
      if (!clientData.id) {
        clientData.id = uuidv4();
      }

      // Insérer dans la table profiles
      const { data, error } = await supabase
        .from("profiles")
        .insert(clientData)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création du client:", error);
        return { data: null, error };
      }

      // Convertir les données retournées en objet Client
      const newClient = mapProfileToClient(data);
      return { data: newClient, error: null };
    } catch (error) {
      console.error("Erreur inattendue lors de la création du client:", error);
      return { data: null, error };
    }
  },

  /**
   * Récupère tous les clients
   */
  fetchClients: async (): Promise<{ data: Client[]; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client");

      if (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        return { data: [], error };
      }

      // Convertir les données en objets Client
      const clients = data.map(mapProfileToClient);
      return { data: clients, error: null };
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération des clients:", error);
      return { data: [], error };
    }
  },

  /**
   * Récupère un client par son ID
   */
  fetchClientById: async (clientId: string): Promise<{ data: Client | null; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", clientId)
        .single();

      if (error) {
        console.error(`Erreur lors de la récupération du client ${clientId}:`, error);
        return { data: null, error };
      }

      // Convertir les données en objet Client
      const client = mapProfileToClient(data);
      return { data: client, error: null };
    } catch (error) {
      console.error(`Erreur inattendue lors de la récupération du client ${clientId}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Met à jour un client existant
   */
  updateClient: async (clientId: string, updates: Partial<Client>): Promise<{ data: Client | null; error: any }> => {
    try {
      // Convertir les mises à jour en format DB
      const updateData = mapClientToDbFormat(updates);

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", clientId)
        .select()
        .single();

      if (error) {
        console.error(`Erreur lors de la mise à jour du client ${clientId}:`, error);
        return { data: null, error };
      }

      // Convertir les données en objet Client
      const updatedClient = mapProfileToClient(data);
      return { data: updatedClient, error: null };
    } catch (error) {
      console.error(`Erreur inattendue lors de la mise à jour du client ${clientId}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Importe des clients à partir d'un fichier CSV
   */
  importClientsFromCSV: async (file: File): Promise<{ data: Client[]; error: any }> => {
    try {
      // Analyser le fichier CSV
      const clients = await parseCSVFile(file);
      
      if (!clients.length) {
        return { data: [], error: new Error("Aucun client trouvé dans le fichier CSV") };
      }

      // Préparer les données pour insertion en masse
      const clientsForDb = clients.map(client => {
        const dbClient = mapClientToDbFormat(client);
        // Ajouter un ID à chaque client
        if (!dbClient.id) {
          dbClient.id = uuidv4();
        }
        return dbClient;
      });

      // Insertion en masse dans la table profiles
      const { data, error } = await supabase
        .from("profiles")
        .insert(clientsForDb)
        .select();

      if (error) {
        console.error("Erreur lors de l'importation des clients:", error);
        return { data: [], error };
      }

      // Convertir les données retournées en objets Client
      const createdClients = data.map(mapProfileToClient);
      return { data: createdClients, error: null };
    } catch (error) {
      console.error("Erreur inattendue lors de l'importation des clients:", error);
      return { data: [], error };
    }
  },

  /**
   * Supprime un client
   */
  deleteClient: async (clientId: string): Promise<{ success: boolean; error: any }> => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", clientId);

      if (error) {
        console.error(`Erreur lors de la suppression du client ${clientId}:`, error);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error(`Erreur inattendue lors de la suppression du client ${clientId}:`, error);
      return { success: false, error };
    }
  }
};

// Export par défaut pour compatibilité
export default clientService;
