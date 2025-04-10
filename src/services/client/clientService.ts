
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import Papa from "papaparse";

// Fetch all clients
export const fetchClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("nom", { ascending: true });

  if (error) {
    console.error("Error fetching clients:", error);
    throw new Error("Failed to fetch clients");
  }

  return data || [];
};

// Create a new client
export const createClient = async (clientData: Omit<Client, "id" | "dateCreation">): Promise<Client> => {
  const newClient = {
    ...clientData,
    date_creation: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("clients")
    .insert(newClient)
    .select()
    .single();

  if (error) {
    console.error("Error creating client:", error);
    throw new Error("Failed to create client");
  }

  return data;
};

// Fetch a client by ID
export const fetchClientById = async (id: string): Promise<Client> => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching client with ID ${id}:`, error);
    throw new Error("Failed to fetch client");
  }

  if (!data) {
    throw new Error(`Client with ID ${id} not found`);
  }

  return data;
};

// Update a client
export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  const { data, error } = await supabase
    .from("clients")
    .update(clientData)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error(`Error updating client with ID ${id}:`, error);
    throw new Error("Failed to update client");
  }

  if (!data) {
    throw new Error(`Client with ID ${id} not found`);
  }

  return data;
};

// Delete a client
export const deleteClient = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting client with ID ${id}:`, error);
    throw new Error("Failed to delete client");
  }

  return true;
};

// Import clients from CSV
export const importClientsFromCSV = async (
  clientsData: Omit<Client, "id" | "dateCreation" | "role">[]
): Promise<Client[]> => {
  // Prepare data for insertion
  const clientsToInsert = clientsData.map(client => ({
    ...client,
    date_creation: new Date().toISOString(),
    role: "client"
  }));

  // Insert clients into the database
  const { data, error } = await supabase
    .from("clients")
    .insert(clientsToInsert)
    .select();

  if (error) {
    console.error("Error importing clients:", error);
    throw new Error("Failed to import clients");
  }

  return data || [];
};

// Parse CSV file and validate data
export const parseCSVFile = async (file: File): Promise<Omit<Client, "id" | "dateCreation" | "role">[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const clients: Omit<Client, "id" | "dateCreation" | "role">[] = [];
          
          // Process each row
          results.data.forEach((row: any) => {
            const client: any = {
              nom: row.nom || row.Nom || "",
              prenom: row.prenom || row.Prenom || "",
              email: row.email || row.Email || "",
              telephone: row.telephone || row.Telephone || row.tel || "",
              adresse: row.adresse || row.Adresse || "",
              ville: row.ville || row.Ville || "",
              code_postal: row.code_postal || row.Code_Postal || row.codePostal || "",
              secteur_activite: row.secteur_activite || row.Secteur_Activite || row.secteurActivite || "",
              type_entreprise: row.type_entreprise || row.Type_Entreprise || row.typeEntreprise || "",
              commentaires: row.commentaires || row.Commentaires || ""
            };
            
            // Validation
            if (!client.nom || !client.prenom || !client.email) {
              console.warn("Skipping invalid client row:", row);
              return;
            }
            
            clients.push(client);
          });
          
          resolve(clients);
        } catch (err) {
          reject(new Error(`Error parsing CSV: ${err instanceof Error ? err.message : String(err)}`));
        }
      },
      error: (err) => {
        reject(new Error(`Error parsing CSV: ${err.message}`));
      }
    });
  });
};

export const clientService = {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  importClientsFromCSV,
  parseCSVFile
};
