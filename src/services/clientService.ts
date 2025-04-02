
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*');
  
  if (error) {
    console.error("Error fetching clients:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export const fetchClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching client with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating client:", error);
    throw new Error(error.message);
  }
  
  return data;
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating client with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting client with ID ${id}:`, error);
    throw new Error(error.message);
  }
};
