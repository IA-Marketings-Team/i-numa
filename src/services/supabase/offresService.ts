
import { supabase } from "@/integrations/supabase/client";
import { Offre } from "@/types";

export const getOffreById = async (id: string): Promise<Offre | null> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("offres")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching offre:", error);
    return null;
  }

  return {
    id: data.id,
    nom: data.nom,
    description: data.description,
    type: data.type,
    prix: data.prix
  };
};

export const getAllOffres = async (): Promise<Offre[]> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("offres")
    .select("*")
    .order("nom");

  if (error) {
    console.error("Error fetching offres:", error);
    return [];
  }

  return data.map((offre) => ({
    id: offre.id,
    nom: offre.nom,
    description: offre.description,
    type: offre.type,
    prix: offre.prix
  }));
};

export const createOffre = async (offre: Omit<Offre, "id">): Promise<Offre | null> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("offres")
    .insert([
      {
        nom: offre.nom,
        description: offre.description,
        type: offre.type,
        prix: offre.prix
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating offre:", error);
    return null;
  }

  return {
    id: data.id,
    nom: data.nom,
    description: data.description,
    type: data.type,
    prix: data.prix
  };
};

export const updateOffre = async (id: string, updates: Partial<Offre>): Promise<Offre | null> => {
  const updateData: any = {};
  
  if (updates.nom) updateData.nom = updates.nom;
  if (updates.description) updateData.description = updates.description;
  if (updates.type) updateData.type = updates.type;
  if (updates.prix !== undefined) updateData.prix = updates.prix;

  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("offres")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating offre:", error);
    return null;
  }

  return {
    id: data.id,
    nom: data.nom,
    description: data.description,
    type: data.type,
    prix: data.prix
  };
};

export const deleteOffre = async (id: string): Promise<boolean> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { error } = await supabase
    .from("offres")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting offre:", error);
    return false;
  }

  return true;
};
