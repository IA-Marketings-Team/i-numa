import { Offre } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchOffres = async (): Promise<Offre[]> => {
  const { data, error } = await supabase
    .from('offres')
    .select('*');
  
  if (error) {
    console.error("Error fetching offres:", error);
    throw new Error(error.message);
  }
  
  // Transform Supabase data to match our Offre type
  const offres: Offre[] = data.map(item => ({
    id: item.id,
    nom: item.nom || '',
    description: item.description || '',
    type: (item.type || 'SEO') as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
    prix: item.prix || 0
  }));
  
  return offres;
};

export const fetchOffreById = async (id: string): Promise<Offre | null> => {
  const { data, error } = await supabase
    .from('offres')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching offre with ID ${id}:`, error);
    return null;
  }
  
  if (!data) return null;
  
  // Transform Supabase data to match our Offre type
  const offre: Offre = {
    id: data.id,
    nom: data.nom || '',
    description: data.description || '',
    type: (data.type || 'SEO') as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
    prix: data.prix || 0
  };
  
  return offre;
};

export const createOffre = async (offreData: Omit<Offre, 'id'>): Promise<Offre | null> => {
  const { data, error } = await supabase
    .from('offres')
    .insert([{
      nom: offreData.nom,
      description: offreData.description,
      type: offreData.type,
      prix: offreData.prix
    }])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating offre:", error);
    throw new Error(error.message);
  }
  
  const offre: Offre = {
    id: data.id,
    nom: data.nom || '',
    description: data.description || '',
    type: (data.type || 'SEO') as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
    prix: data.prix || 0
  };
  
  return offre;
};

export const updateOffre = async (id: string, updates: Partial<Offre>): Promise<boolean> => {
  const updateData: any = {};
  
  if (updates.nom !== undefined) updateData.nom = updates.nom;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.prix !== undefined) updateData.prix = updates.prix;
  
  const { error } = await supabase
    .from('offres')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating offre with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

export const deleteOffre = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('offres')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting offre with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};
