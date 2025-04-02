
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client');
  
  if (error) {
    console.error("Error fetching clients:", error);
    throw new Error(error.message);
  }
  
  // Transform the Supabase data to match our Client type
  const clients: Client[] = data.map(profile => ({
    id: profile.id,
    nom: profile.nom || '',
    prenom: profile.prenom || '',
    email: profile.email || '',
    telephone: profile.telephone || '',
    adresse: profile.adresse || '',
    ville: profile.ville || '',
    codePostal: profile.code_postal || '',
    secteurActivite: profile.secteur_activite || '',
    typeEntreprise: profile.type_entreprise || '',
    besoins: profile.besoins || '',
    iban: profile.iban || '',
    bic: profile.bic || '',
    nomBanque: profile.nom_banque || '',
    role: 'client',
    dateCreation: new Date(profile.date_creation || new Date())
  }));
  
  return clients;
};

export const fetchClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'client')
    .single();
  
  if (error) {
    console.error(`Error fetching client with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  if (!data) return null;
  
  // Transform the Supabase data to match our Client type
  const client: Client = {
    id: data.id,
    nom: data.nom || '',
    prenom: data.prenom || '',
    email: data.email || '',
    telephone: data.telephone || '',
    adresse: data.adresse || '',
    ville: data.ville || '',
    codePostal: data.code_postal || '',
    secteurActivite: data.secteur_activite || '',
    typeEntreprise: data.type_entreprise || '',
    besoins: data.besoins || '',
    iban: data.iban || '',
    bic: data.bic || '',
    nomBanque: data.nom_banque || '',
    role: 'client',
    dateCreation: new Date(data.date_creation || new Date())
  };
  
  return client;
};

export const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
  // Transform our Client type to match the Supabase profiles table structure
  const clientForSupabase = {
    // Use an empty string for ID to allow Supabase to generate it
    // The type definitions expect id but Supabase will ignore it for inserts
    id: undefined,
    nom: clientData.nom,
    prenom: clientData.prenom,
    email: clientData.email,
    telephone: clientData.telephone,
    adresse: clientData.adresse,
    ville: clientData.ville || '',
    code_postal: clientData.codePostal || '',
    secteur_activite: clientData.secteurActivite,
    type_entreprise: clientData.typeEntreprise,
    besoins: clientData.besoins,
    iban: clientData.iban || '',
    bic: clientData.bic || '',
    nom_banque: clientData.nomBanque || '',
    role: 'client'
  };

  // Insert the client into the profiles table using insert instead of upsert
  // The TypeScript error occurs because upsert expects an id
  const { data, error } = await supabase
    .from('profiles')
    .insert(clientForSupabase)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating client:", error);
    throw new Error(error.message);
  }
  
  // Transform the Supabase data back to our Client type
  const client: Client = {
    id: data.id,
    nom: data.nom || '',
    prenom: data.prenom || '',
    email: data.email || '',
    telephone: data.telephone || '',
    adresse: data.adresse || '',
    ville: data.ville || '',
    codePostal: data.code_postal || '',
    secteurActivite: data.secteur_activite || '',
    typeEntreprise: data.type_entreprise || '',
    besoins: data.besoins || '',
    iban: data.iban || '',
    bic: data.bic || '',
    nomBanque: data.nom_banque || '',
    role: 'client',
    dateCreation: new Date(data.date_creation || new Date())
  };
  
  return client;
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<boolean> => {
  // Convert Client type to Supabase table structure
  const updateData: any = {};
  
  if (updates.nom !== undefined) updateData.nom = updates.nom;
  if (updates.prenom !== undefined) updateData.prenom = updates.prenom;
  if (updates.email !== undefined) updateData.email = updates.email;
  if (updates.telephone !== undefined) updateData.telephone = updates.telephone;
  if (updates.adresse !== undefined) updateData.adresse = updates.adresse;
  if (updates.ville !== undefined) updateData.ville = updates.ville;
  if (updates.codePostal !== undefined) updateData.code_postal = updates.codePostal;
  if (updates.secteurActivite !== undefined) updateData.secteur_activite = updates.secteurActivite;
  if (updates.typeEntreprise !== undefined) updateData.type_entreprise = updates.typeEntreprise;
  if (updates.besoins !== undefined) updateData.besoins = updates.besoins;
  if (updates.iban !== undefined) updateData.iban = updates.iban;
  if (updates.bic !== undefined) updateData.bic = updates.bic;
  if (updates.nomBanque !== undefined) updateData.nom_banque = updates.nomBanque;
  
  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating client with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
    .eq('role', 'client');
  
  if (error) {
    console.error(`Error deleting client with ID ${id}:`, error);
    throw new Error(error.message);
  }
};
