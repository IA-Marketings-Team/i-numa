
import { Agent, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère un agent par son ID depuis Supabase
 */
export const fetchAgentById = async (id: string): Promise<Agent | undefined> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'agent ${id}:`, error);
      return undefined;
    }

    if (!data) return undefined;

    // Conversion du profil Supabase en Agent
    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: convertToUserRole(data.role),
      equipeId: data.equipe_id || null,
      dateCreation: new Date(data.date_creation),
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
    return undefined;
  }
};

/**
 * Réinitialise les statistiques d'un agent
 */
export const resetAgentStats = async (agentId: string): Promise<boolean> => {
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
      .eq('id', agentId);
    
    if (error) {
      console.error(`Erreur lors de la réinitialisation des statistiques de l'agent ${agentId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la réinitialisation des statistiques de l'agent ${agentId}:`, error);
    return false;
  }
};

/**
 * Helper function to convert string to UserRole type
 */
const convertToUserRole = (role: string | null): UserRole => {
  switch (role) {
    case 'agent_phoner':
      return 'agent_phoner';
    case 'agent_visio':
      return 'agent_visio';
    case 'superviseur':
      return 'superviseur';
    case 'responsable':
      return 'responsable';
    case 'client':
      return 'client';
    default:
      return 'client';
  }
};

/**
 * Récupère tous les agents depuis Supabase
 */
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])
      .order('nom');

    if (error) {
      console.error("Erreur lors de la récupération des agents:", error);
      return [];
    }

    return data.map(profile => ({
      id: profile.id,
      nom: profile.nom || '',
      prenom: profile.prenom || '',
      email: profile.email || '',
      telephone: profile.telephone || '',
      role: convertToUserRole(profile.role),
      equipeId: profile.equipe_id || null,
      dateCreation: new Date(profile.date_creation),
      statistiques: {
        appelsEmis: profile.appels_emis || 0,
        appelsDecroches: profile.appels_decroches || 0,
        appelsTransformes: profile.appels_transformes || 0,
        rendezVousHonores: profile.rendez_vous_honores || 0,
        rendezVousNonHonores: profile.rendez_vous_non_honores || 0,
        dossiersValides: profile.dossiers_valides || 0,
        dossiersSigne: profile.dossiers_signe || 0
      }
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des agents:", error);
    return [];
  }
};

/**
 * Récupère tous les agents d'un certain rôle
 */
export const fetchAgentsByRole = async (role: UserRole): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('nom');

    if (error) {
      console.error(`Erreur lors de la récupération des agents avec le rôle ${role}:`, error);
      return [];
    }

    return data.map(profile => ({
      id: profile.id,
      nom: profile.nom || '',
      prenom: profile.prenom || '',
      email: profile.email || '',
      telephone: profile.telephone || '',
      role: convertToUserRole(profile.role),
      equipeId: profile.equipe_id || null,
      dateCreation: new Date(profile.date_creation),
      statistiques: {
        appelsEmis: profile.appels_emis || 0,
        appelsDecroches: profile.appels_decroches || 0,
        appelsTransformes: profile.appels_transformes || 0,
        rendezVousHonores: profile.rendez_vous_honores || 0,
        rendezVousNonHonores: profile.rendez_vous_non_honores || 0,
        dossiersValides: profile.dossiers_valides || 0,
        dossiersSigne: profile.dossiers_signe || 0
      }
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des agents avec le rôle ${role}:`, error);
    return [];
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
        nom: agent.nom,
        prenom: agent.prenom,
        telephone: agent.telephone,
        role: agent.role,
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
      equipeId: agent.equipeId,
      dateCreation: new Date(),
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
    // La suppression d'un utilisateur devrait être gérée avec précaution.
    // Dans un environnement de production, vous pourriez vouloir simplement le désactiver
    // ou conserver les données pour des raisons légales.
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
