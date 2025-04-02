
import { Team } from "@/types";
import { supabase } from "@/integrations/supabase/client";

type TeamFonction = "phoning" | "visio" | "developpement" | "marketing" | "mixte";

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
      nom: team.nom || '',
      fonction: convertTeamFonction(team.fonction),
      description: team.description || '',
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
      nom: data.nom || '',
      fonction: convertTeamFonction(data.fonction),
      description: data.description || '',
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
export const createTeam = async (team: Omit<Team, "id" | "dateCreation">): Promise<Team | null> => {
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
      nom: data.nom || '',
      fonction: convertTeamFonction(data.fonction),
      description: data.description || '',
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
    // Vérifier si l'équipe a des agents associés
    const { data: agents, error: agentsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('equipe_id', id);

    if (agentsError) {
      console.error(`Erreur lors de la vérification des agents pour l'équipe ${id}:`, agentsError);
      return false;
    }

    // Si l'équipe a des agents associés, retirer l'association
    if (agents && agents.length > 0) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ equipe_id: null })
        .eq('equipe_id', id);

      if (updateError) {
        console.error(`Erreur lors de la mise à jour des agents pour l'équipe ${id}:`, updateError);
        return false;
      }
    }
    
    // Supprimer l'équipe
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

/**
 * Récupère les équipes par fonction
 */
export const fetchTeamsByFunction = async (fonction: TeamFonction): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('fonction', fonction)
      .order('nom');

    if (error) {
      console.error(`Erreur lors de la récupération des équipes avec la fonction ${fonction}:`, error);
      return [];
    }

    return data.map(team => ({
      id: team.id,
      nom: team.nom || '',
      fonction: convertTeamFonction(team.fonction),
      description: team.description || '',
      dateCreation: new Date(team.date_creation)
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des équipes avec la fonction ${fonction}:`, error);
    return [];
  }
};

/**
 * Récupère les agents d'une équipe
 */
export const fetchAgentsByTeam = async (teamId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('equipe_id', teamId)
      .order('nom');

    if (error) {
      console.error(`Erreur lors de la récupération des agents de l'équipe ${teamId}:`, error);
      return [];
    }

    return data;
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des agents de l'équipe ${teamId}:`, error);
    return [];
  }
};

// Fonction auxiliaire pour convertir le type d'équipe
const convertTeamFonction = (fonction: string): TeamFonction => {
  if (fonction === "phoning" || fonction === "visio" || fonction === "developpement" || fonction === "marketing" || fonction === "mixte") {
    return fonction as TeamFonction;
  }
  // Valeur par défaut si le type n'est pas reconnu
  return "mixte";
};
