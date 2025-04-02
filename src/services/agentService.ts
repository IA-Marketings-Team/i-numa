
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

    // Convertir les données Supabase en objet Agent
    const role = data.role as UserRole;
    
    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: role,
      dateCreation: new Date(data.date_creation),
      equipeId: data.equipe_id,
      adresse: data.adresse,
      ville: data.ville,
      codePostal: data.code_postal,
      iban: data.iban,
      bic: data.bic,
      nomBanque: data.nom_banque,
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
 * Récupère tous les agents depuis Supabase
 */
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['agent_phoner', 'agent_visio', 'agent_developpeur', 'agent_marketing']);

    if (error) {
      console.error("Erreur lors de la récupération des agents:", error);
      return [];
    }

    return data.map(agent => {
      const role = agent.role as UserRole;
      
      return {
        id: agent.id,
        nom: agent.nom || '',
        prenom: agent.prenom || '',
        email: agent.email || '',
        telephone: agent.telephone || '',
        role: role,
        dateCreation: new Date(agent.date_creation),
        equipeId: agent.equipe_id,
        adresse: agent.adresse,
        ville: agent.ville,
        codePostal: agent.code_postal,
        iban: agent.iban,
        bic: agent.bic,
        nomBanque: agent.nom_banque,
        statistiques: {
          appelsEmis: agent.appels_emis || 0,
          appelsDecroches: agent.appels_decroches || 0,
          appelsTransformes: agent.appels_transformes || 0,
          rendezVousHonores: agent.rendez_vous_honores || 0,
          rendezVousNonHonores: agent.rendez_vous_non_honores || 0,
          dossiersValides: agent.dossiers_valides || 0,
          dossiersSigne: agent.dossiers_signe || 0
        }
      };
    });
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des agents:", error);
    return [];
  }
};

/**
 * Remet à zéro les statistiques d'un agent
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
      console.error(`Erreur lors de la réinitialisation des statistiques pour l'agent ${agentId}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la réinitialisation des statistiques pour l'agent ${agentId}:`, error);
    return false;
  }
};

/**
 * Met à jour les informations d'un agent
 */
export const updateAgent = async (id: string, updates: Partial<Agent>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.nom !== undefined) updateData.nom = updates.nom;
    if (updates.prenom !== undefined) updateData.prenom = updates.prenom;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.telephone !== undefined) updateData.telephone = updates.telephone;
    if (updates.adresse !== undefined) updateData.adresse = updates.adresse;
    if (updates.ville !== undefined) updateData.ville = updates.ville;
    if (updates.codePostal !== undefined) updateData.code_postal = updates.codePostal;
    if (updates.iban !== undefined) updateData.iban = updates.iban;
    if (updates.bic !== undefined) updateData.bic = updates.bic;
    if (updates.nomBanque !== undefined) updateData.nom_banque = updates.nomBanque;
    if (updates.equipeId !== undefined) updateData.equipe_id = updates.equipeId;
    
    // Mise à jour des statistiques si elles sont fournies
    const stats = updates.statistiques;
    if (stats) {
      if (stats.appelsEmis !== undefined) updateData.appels_emis = stats.appelsEmis;
      if (stats.appelsDecroches !== undefined) updateData.appels_decroches = stats.appelsDecroches;
      if (stats.appelsTransformes !== undefined) updateData.appels_transformes = stats.appelsTransformes;
      if (stats.rendezVousHonores !== undefined) updateData.rendez_vous_honores = stats.rendezVousHonores;
      if (stats.rendezVousNonHonores !== undefined) updateData.rendez_vous_non_honores = stats.rendezVousNonHonores;
      if (stats.dossiersValides !== undefined) updateData.dossiers_valides = stats.dossiersValides;
      if (stats.dossiersSigne !== undefined) updateData.dossiers_signe = stats.dossiersSigne;
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
