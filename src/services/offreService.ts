
import { Offre } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère toutes les offres depuis Supabase
 */
export const fetchOffres = async (): Promise<Offre[]> => {
  try {
    const { data, error } = await supabase
      .from('offres')
      .select('*')
      .order('nom');

    if (error) {
      console.error("Erreur lors de la récupération des offres:", error);
      return [];
    }

    return data.map(offre => ({
      id: offre.id,
      nom: offre.nom || '',
      description: offre.description || '',
      type: convertOffreType(offre.type || ''),
      prix: offre.prix || 0
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des offres:", error);
    return [];
  }
};

/**
 * Récupère une offre par son ID
 */
export const fetchOffreById = async (id: string): Promise<Offre | null> => {
  try {
    const { data, error } = await supabase
      .from('offres')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'offre ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      nom: data.nom || '',
      description: data.description || '',
      type: convertOffreType(data.type || ''),
      prix: data.prix || 0
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de l'offre ${id}:`, error);
    return null;
  }
};

/**
 * Crée une nouvelle offre
 */
export const createOffre = async (offre: Omit<Offre, 'id'>): Promise<Offre | null> => {
  try {
    const { data, error } = await supabase
      .from('offres')
      .insert({
        nom: offre.nom,
        description: offre.description,
        type: offre.type,
        prix: offre.prix
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de l'offre:", error);
      return null;
    }

    return {
      id: data.id,
      nom: data.nom || '',
      description: data.description || '',
      type: convertOffreType(data.type || ''),
      prix: data.prix || 0
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création de l'offre:", error);
    return null;
  }
};

/**
 * Met à jour une offre existante
 */
export const updateOffre = async (id: string, updates: Partial<Offre>): Promise<boolean> => {
  try {
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
      console.error(`Erreur lors de la mise à jour de l'offre ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour de l'offre ${id}:`, error);
    return false;
  }
};

/**
 * Supprime une offre
 */
export const deleteOffre = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('offres')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression de l'offre ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression de l'offre ${id}:`, error);
    return false;
  }
};

// Fonction auxiliaire pour convertir le type d'offre
const convertOffreType = (type: string): "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis" => {
  if (type === "SEO" || type === "Google Ads" || type === "Email X" || type === "Foner" || type === "Devis") {
    return type as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis";
  }
  // Valeur par défaut si le type n'est pas reconnu
  return "Devis";
};
