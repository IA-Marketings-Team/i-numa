
import { Agent } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère tous les agents depuis Supabase
 */
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        nom,
        prenom,
        email,
        telephone,
        role,
        date_creation,
        equipe_id,
        appels_emis,
        appels_decroches,
        appels_transformes,
        rendez_vous_honores,
        rendez_vous_non_honores,
        dossiers_valides,
        dossiers_signe
      `)
      .or('role.eq.agent_phoner,role.eq.agent_visio,role.eq.agent_marketing,role.eq.agent_developpeur');

    if (error) {
      console.error("Erreur lors de la récupération des agents:", error);
      return [];
    }

    return data.map(agent => ({
      id: agent.id,
      nom: agent.nom || '',
      prenom: agent.prenom || '',
      email: agent.email || '',
      telephone: agent.telephone || '',
      role: agent.role || '',
      dateCreation: new Date(agent.date_creation),
      equipeId: agent.equipe_id,
      statistiques: {
        appelsEmis: agent.appels_emis || 0,
        appelsDecroches: agent.appels_decroches || 0,
        appelsTransformes: agent.appels_transformes || 0,
        rendezVousHonores: agent.rendez_vous_honores || 0,
        rendezVousNonHonores: agent.rendez_vous_non_honores || 0,
        dossiersValides: agent.dossiers_valides || 0,
        dossiersSigne: agent.dossiers_signe || 0
      }
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des agents:", error);
    return [];
  }
};

/**
 * Récupère un agent par son ID
 */
export const fetchAgentById = async (id: string): Promise<Agent | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        nom,
        prenom,
        email,
        telephone,
        role,
        date_creation,
        equipe_id,
        appels_emis,
        appels_decroches,
        appels_transformes,
        rendez_vous_honores,
        rendez_vous_non_honores,
        dossiers_valides,
        dossiers_signe
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'agent ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: data.role || '',
      dateCreation: new Date(data.date_creation),
      equipeId: data.equipe_id,
      statistiques: {
        appelsEmis: data.appels_emis || 0,
        appelsDecroches: data.appels_decroches || 0,
        appelsTransformes: data.appels_transformes || 0,
        rendezVousHonores: data.rendez_vous_honores || 0,
        rendezVousNonHonores: data.rendez_vous_non_honores || 0,
        dossiersValides: data.dossiers_valides || 0,
        dossiersSigne: data.dossiers_signe || 0
      }
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de l'agent ${id}:`, error);
    return null;
  }
};

/**
 * Crée un nouvel agent
 */
export const createAgent = async (agent: Omit<Agent, "id" | "dateCreation" | "statistiques">): Promise<Agent | null> => {
  try {
    // Créer un nouvel utilisateur avec authentification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: agent.email,
      password: "password123", // Mot de passe temporaire, à changer dans une vraie application
      options: {
        data: {
          nom: agent.nom,
          prenom: agent.prenom,
          role: agent.role
        }
      }
    });
    
    if (authError) {
      console.error("Erreur lors de la création de l'utilisateur agent:", authError);
      return null;
    }
    
    if (!authData.user) {
      console.error("Aucun utilisateur créé");
      return null;
    }
    
    // Mettre à jour le profil avec les informations supplémentaires
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        telephone: agent.telephone,
        equipe_id: agent.equipeId
      })
      .eq('id', authData.user.id);
    
    if (profileError) {
      console.error("Erreur lors de la mise à jour du profil agent:", profileError);
      return null;
    }
    
    return {
      id: authData.user.id,
      nom: agent.nom,
      prenom: agent.prenom,
      email: agent.email,
      telephone: agent.telephone,
      role: agent.role,
      dateCreation: new Date(),
      equipeId: agent.equipeId,
      statistiques: {
        appelsEmis: 0,
        appelsDecroches: 0,
        appelsTransformes: 0,
        rendezVousHonores: 0,
        rendezVousNonHonores: 0,
        dossiersValides: 0,
        dossiersSigne: 0
      }
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création de l'agent:", error);
    return null;
  }
};

/**
 * Met à jour un agent existant
 */
export const updateAgent = async (id: string, updates: Partial<Agent>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.nom !== undefined) updateData.nom = updates.nom;
    if (updates.prenom !== undefined) updateData.prenom = updates.prenom;
    if (updates.telephone !== undefined) updateData.telephone = updates.telephone;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.equipeId !== undefined) updateData.equipe_id = updates.equipeId;
    
    // Mettre à jour les statistiques si fournies
    if (updates.statistiques) {
      if (updates.statistiques.appelsEmis !== undefined) updateData.appels_emis = updates.statistiques.appelsEmis;
      if (updates.statistiques.appelsDecroches !== undefined) updateData.appels_decroches = updates.statistiques.appelsDecroches;
      if (updates.statistiques.appelsTransformes !== undefined) updateData.appels_transformes = updates.statistiques.appelsTransformes;
      if (updates.statistiques.rendezVousHonores !== undefined) updateData.rendez_vous_honores = updates.statistiques.rendezVousHonores;
      if (updates.statistiques.rendezVousNonHonores !== undefined) updateData.rendez_vous_non_honores = updates.statistiques.rendezVousNonHonores;
      if (updates.statistiques.dossiersValides !== undefined) updateData.dossiers_valides = updates.statistiques.dossiersValides;
      if (updates.statistiques.dossiersSigne !== undefined) updateData.dossiers_signe = updates.statistiques.dossiersSigne;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de l'agent ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour de l'agent ${id}:`, error);
    return false;
  }
};

/**
 * Supprime un agent
 */
export const deleteAgent = async (id: string): Promise<boolean> => {
  try {
    // Supprimer l'utilisateur d'authentification va aussi supprimer le profil
    // grâce à la contrainte de clé étrangère
    const { error } = await supabase.auth.admin.deleteUser(id);
    
    if (error) {
      console.error(`Erreur lors de la suppression de l'agent ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression de l'agent ${id}:`, error);
    return false;
  }
};

/**
 * Réinitialise les statistiques d'un agent
 */
export const resetAgentStats = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        appels_emis: 0,
        appels_decroches: 0,
        appels_transformes: 0,
        rendez_vous_honores: 0,
        rendez_vous_non_honores: 0,
        dossiers_valides: 0,
        dossiers_signe: 0
      })
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la réinitialisation des statistiques de l'agent ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la réinitialisation des statistiques de l'agent ${id}:`, error);
    return false;
  }
};
