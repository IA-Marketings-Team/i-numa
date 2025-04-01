
import { supabase } from "@/integrations/supabase/client";
import { Team } from "@/types";

export const getTeamById = async (id: string): Promise<Team | null> => {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching team:", error);
    return null;
  }

  return {
    id: data.id,
    nom: data.nom,
    fonction: data.fonction,
    description: data.description,
    dateCreation: new Date(data.date_creation)
  };
};

export const getAllTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("nom");

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  return data.map((team) => ({
    id: team.id,
    nom: team.nom,
    fonction: team.fonction,
    description: team.description,
    dateCreation: new Date(team.date_creation)
  }));
};

export const createTeam = async (team: Omit<Team, "id" | "dateCreation">): Promise<Team | null> => {
  const { data, error } = await supabase
    .from("teams")
    .insert([
      {
        nom: team.nom,
        fonction: team.fonction,
        description: team.description
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating team:", error);
    return null;
  }

  return {
    id: data.id,
    nom: data.nom,
    fonction: data.fonction,
    description: data.description,
    dateCreation: new Date(data.date_creation)
  };
};

export const updateTeam = async (id: string, updates: Partial<Team>): Promise<Team | null> => {
  const updateData: any = {};
  
  if (updates.nom) updateData.nom = updates.nom;
  if (updates.fonction) updateData.fonction = updates.fonction;
  if (updates.description !== undefined) updateData.description = updates.description;

  const { data, error } = await supabase
    .from("teams")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating team:", error);
    return null;
  }

  return {
    id: data.id,
    nom: data.nom,
    fonction: data.fonction,
    description: data.description,
    dateCreation: new Date(data.date_creation)
  };
};

export const deleteTeam = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("teams")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting team:", error);
    return false;
  }

  return true;
};
