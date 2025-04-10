
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { mapClientToDbFormat } from "./utils/mapClientToDbFormat";
import { mapProfileToClient } from "./utils/mapProfileToClient";
import { Client } from "@/types";

export const clientService = {
  // Create a new client
  createClient: async (client: Omit<Client, "id">): Promise<Client | null> => {
    try {
      const clientData = mapClientToDbFormat(client);
      
      // Generate a UUID for the client
      const { data, error } = await supabase
        .from('profiles')
        .insert(clientData)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating client:", error);
        return null;
      }
      
      return mapProfileToClient(data);
    } catch (error) {
      console.error("Unexpected error creating client:", error);
      return null;
    }
  },
  
  // Update an existing client
  updateClient: async (id: string, updates: Partial<Client>): Promise<boolean> => {
    try {
      const clientData = mapClientToDbFormat(updates as Client);
      
      const { error } = await supabase
        .from('profiles')
        .update(clientData)
        .eq('id', id);
      
      if (error) {
        console.error(`Error updating client ${id}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Unexpected error updating client ${id}:`, error);
      return false;
    }
  },
  
  // Delete a client
  deleteClient: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting client ${id}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Unexpected error deleting client ${id}:`, error);
      return false;
    }
  },
  
  // Get a client by ID
  getClientById: async (id: string): Promise<Client | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'client')
        .single();
      
      if (error || !data) {
        console.error(`Error fetching client ${id}:`, error);
        return null;
      }
      
      return mapProfileToClient(data);
    } catch (error) {
      console.error(`Unexpected error fetching client ${id}:`, error);
      return null;
    }
  },
  
  // Get all clients
  getClients: async (): Promise<Client[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('nom', { ascending: true });
      
      if (error) {
        console.error("Error fetching clients:", error);
        return [];
      }
      
      return data.map(mapProfileToClient);
    } catch (error) {
      console.error("Unexpected error fetching clients:", error);
      return [];
    }
  },
  
  // Import clients from CSV
  importClientsFromCSV: async (file: File): Promise<{ success: boolean; count: number; errors: any[] }> => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const { data, errors } = results;
          const clients = data as any[];
          let successCount = 0;
          
          try {
            // Process clients in batches
            for (const client of clients) {
              try {
                // Map CSV fields to client fields
                const clientData = {
                  nom: client.nom,
                  prenom: client.prenom,
                  email: client.email,
                  telephone: client.telephone,
                  role: 'client',
                  date_creation: new Date().toISOString(),
                  adresse: client.adresse,
                  ville: client.ville,
                  code_postal: client.code_postal,
                  iban: client.iban,
                  bic: client.bic,
                  nom_banque: client.nom_banque,
                  secteur_activite: client.secteur_activite,
                  type_entreprise: client.type_entreprise,
                  statut_juridique: client.statut_juridique,
                  site_web: client.site_web,
                  activite_detail: client.activite_detail,
                  moyens_communication: client.moyens_communication?.split(',') || null,
                  besoins: client.besoins,
                  commentaires: client.commentaires
                };
                
                // Insert into database
                const { error } = await supabase.from('profiles').insert({
                  ...clientData,
                  id: client.id || undefined // Use provided ID or let Supabase generate one
                });
                
                if (error) {
                  console.error("Error inserting client:", error);
                  errors.push({ row: client, error: error.message });
                } else {
                  successCount++;
                }
              } catch (error) {
                console.error("Error processing client:", error);
                errors.push({ row: client, error: "Failed to process" });
              }
            }
            
            resolve({ 
              success: successCount > 0,
              count: successCount,
              errors: errors
            });
          } catch (error) {
            console.error("Global error importing clients:", error);
            resolve({ 
              success: false,
              count: 0,
              errors: [{ error: "Global import failure" }]
            });
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          resolve({ 
            success: false, 
            count: 0, 
            errors: [{ error: "CSV parsing error" }]
          });
        }
      });
    });
  }
};
