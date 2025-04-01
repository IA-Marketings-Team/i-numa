
import { Team } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère toutes les équipes depuis Supabase
 */
export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('nom');

    if (error) {
      console.error("Erreur lors de la récupération des équipes:", error);
      return [];
    }

    return data.map(team => ({
      id: team.id,
      nom: team.nom,
      fonction: team.fonction,
      description: team.description || undefined,
      dateCreation: new Date(team.date_creation)
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des équipes:", error);
    return [];
  }
};

/**
 * Récupère une équipe par son ID
 */
export const fetchTeamById = async (id: string): Promise<Team | null> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'équipe ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      nom: data.nom,
      fonction: data.fonction,
      description: data.description || undefined,
      dateCreation: new Date(data.date_creation)
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de l'équipe ${id}:`, error);
    return null;
  }
};

/**
 * Crée une nouvelle équipe
 */
export const createTeam = async (team: Omit<Team, 'id' | 'dateCreation'>): Promise<Team | null> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert({
        nom: team.nom,
        fonction: team.fonction,
        description: team.description
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de l'équipe:", error);
      return null;
    }

    return {
      id: data.id,
      nom: data.nom,
      fonction: data.fonction,
      description: data.description || undefined,
      dateCreation: new Date(data.date_creation)
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création de l'équipe:", error);
    return null;
  }
};

/**
 * Met à jour une équipe existante
 */
export const updateTeam = async (id: string, updates: Partial<Team>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (updates.nom !== undefined) updateData.nom = updates.nom;
    if (updates.fonction !== undefined) updateData.fonction = updates.fonction;
    if (updates.description !== undefined) updateData.description = updates.description;

    const { error } = await supabase
      .from('teams')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour de l'équipe ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour de l'équipe ${id}:`, error);
    return false;
  }
};

/**
 * Supprime une équipe
 */
export const deleteTeam = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression de l'équipe ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression de l'équipe ${id}:`, error);
    return false;
  }
};
