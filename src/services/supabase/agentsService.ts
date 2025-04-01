
import { supabase } from "@/integrations/supabase/client";
import { Agent } from "@/types";

export const getAgentById = async (id: string): Promise<Agent | null> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("agents")
    .select(`
      id,
      equipe_id,
      appels_emis,
      appels_decroches,
      appels_transformes,
      rendez_vous_honores,
      rendez_vous_non_honores,
      dossiers_valides,
      dossiers_signe,
      users:id (*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching agent:", error);
    return null;
  }

  const user = data.users;
  
  return {
    id: data.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    role: user.role,
    dateCreation: new Date(user.date_creation),
    adresse: user.adresse || undefined,
    ville: user.ville || undefined,
    codePostal: user.code_postal || undefined,
    iban: user.iban || undefined,
    bic: user.bic || undefined,
    nomBanque: user.nom_banque || undefined,
    equipeId: data.equipe_id || undefined,
    statistiques: {
      appelsEmis: data.appels_emis,
      appelsDecroches: data.appels_decroches,
      appelsTransformes: data.appels_transformes,
      rendezVousHonores: data.rendez_vous_honores,
      rendezVousNonHonores: data.rendez_vous_non_honores,
      dossiersValides: data.dossiers_valides,
      dossiersSigne: data.dossiers_signe
    }
  };
};

export const getAllAgents = async (): Promise<Agent[]> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("agents")
    .select(`
      id,
      equipe_id,
      appels_emis,
      appels_decroches,
      appels_transformes,
      rendez_vous_honores,
      rendez_vous_non_honores,
      dossiers_valides,
      dossiers_signe,
      users:id (*)
    `)
    .order("id");

  if (error) {
    console.error("Error fetching agents:", error);
    return [];
  }

  return data.map((item) => {
    const user = item.users;
    
    return {
      id: item.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      dateCreation: new Date(user.date_creation),
      adresse: user.adresse || undefined,
      ville: user.ville || undefined,
      codePostal: user.code_postal || undefined,
      iban: user.iban || undefined,
      bic: user.bic || undefined,
      nomBanque: user.nom_banque || undefined,
      equipeId: item.equipe_id || undefined,
      statistiques: {
        appelsEmis: item.appels_emis,
        appelsDecroches: item.appels_decroches,
        appelsTransformes: item.appels_transformes,
        rendezVousHonores: item.rendez_vous_honores,
        rendezVousNonHonores: item.rendez_vous_non_honores,
        dossiersValides: item.dossiers_valides,
        dossiersSigne: item.dossiers_signe
      }
    };
  });
};

export const getAgentsByRole = async (role: string): Promise<Agent[]> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id")
    .eq("role", role);

  if (usersError) {
    console.error("Error fetching users by role:", usersError);
    return [];
  }

  const userIds = users.map(user => user.id);
  
  if (userIds.length === 0) {
    return [];
  }

  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("agents")
    .select(`
      id,
      equipe_id,
      appels_emis,
      appels_decroches,
      appels_transformes,
      rendez_vous_honores,
      rendez_vous_non_honores,
      dossiers_valides,
      dossiers_signe,
      users:id (*)
    `)
    .in("id", userIds)
    .order("id");

  if (error) {
    console.error("Error fetching agents by role:", error);
    return [];
  }

  return data.map((item) => {
    const user = item.users;
    
    return {
      id: item.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      dateCreation: new Date(user.date_creation),
      adresse: user.adresse || undefined,
      ville: user.ville || undefined,
      codePostal: user.code_postal || undefined,
      iban: user.iban || undefined,
      bic: user.bic || undefined,
      nomBanque: user.nom_banque || undefined,
      equipeId: item.equipe_id || undefined,
      statistiques: {
        appelsEmis: item.appels_emis,
        appelsDecroches: item.appels_decroches,
        appelsTransformes: item.appels_transformes,
        rendezVousHonores: item.rendez_vous_honores,
        rendezVousNonHonores: item.rendez_vous_non_honores,
        dossiersValides: item.dossiers_valides,
        dossiersSigne: item.dossiers_signe
      }
    };
  });
};

export const createAgent = async (agent: Omit<Agent, "id" | "dateCreation" | "statistiques">): Promise<Agent | null> => {
  // D'abord créer l'utilisateur
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([
      {
        nom: agent.nom,
        prenom: agent.prenom,
        email: agent.email,
        telephone: agent.telephone,
        role: agent.role,
        adresse: agent.adresse,
        ville: agent.ville,
        code_postal: agent.codePostal,
        iban: agent.iban,
        bic: agent.bic,
        nom_banque: agent.nomBanque
      }
    ])
    .select()
    .single();

  if (userError) {
    console.error("Error creating user for agent:", userError);
    return null;
  }

  // Ensuite créer l'agent associé
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data: agentData, error: agentError } = await supabase
    .from("agents")
    .insert([
      {
        id: userData.id,
        equipe_id: agent.equipeId
      }
    ])
    .select()
    .single();

  if (agentError) {
    console.error("Error creating agent:", agentError);
    return null;
  }

  return {
    id: userData.id,
    nom: userData.nom,
    prenom: userData.prenom,
    email: userData.email,
    telephone: userData.telephone,
    role: userData.role,
    dateCreation: new Date(userData.date_creation),
    adresse: userData.adresse || undefined,
    ville: userData.ville || undefined,
    codePostal: userData.code_postal || undefined,
    iban: userData.iban || undefined,
    bic: userData.bic || undefined,
    nomBanque: userData.nom_banque || undefined,
    equipeId: agentData.equipe_id || undefined,
    statistiques: {
      appelsEmis: agentData.appels_emis,
      appelsDecroches: agentData.appels_decroches,
      appelsTransformes: agentData.appels_transformes,
      rendezVousHonores: agentData.rendez_vous_honores,
      rendezVousNonHonores: agentData.rendez_vous_non_honores,
      dossiersValides: agentData.dossiers_valides,
      dossiersSigne: agentData.dossiers_signe
    }
  };
};

export const updateAgent = async (id: string, updates: Partial<Agent>): Promise<Agent | null> => {
  // Mettre à jour les infos utilisateur
  const userUpdates: any = {};
  
  if (updates.nom) userUpdates.nom = updates.nom;
  if (updates.prenom) userUpdates.prenom = updates.prenom;
  if (updates.email) userUpdates.email = updates.email;
  if (updates.telephone) userUpdates.telephone = updates.telephone;
  if (updates.role) userUpdates.role = updates.role;
  if (updates.adresse !== undefined) userUpdates.adresse = updates.adresse;
  if (updates.ville !== undefined) userUpdates.ville = updates.ville;
  if (updates.codePostal !== undefined) userUpdates.code_postal = updates.codePostal;
  if (updates.iban !== undefined) userUpdates.iban = updates.iban;
  if (updates.bic !== undefined) userUpdates.bic = updates.bic;
  if (updates.nomBanque !== undefined) userUpdates.nom_banque = updates.nomBanque;

  if (Object.keys(userUpdates).length > 0) {
    // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
    const { error: userError } = await supabase
      .from("users")
      .update(userUpdates)
      .eq("id", id);

    if (userError) {
      console.error("Error updating user for agent:", userError);
      return null;
    }
  }

  // Mettre à jour les infos agent
  const agentUpdates: any = {};
  
  if (updates.equipeId !== undefined) agentUpdates.equipe_id = updates.equipeId;
  if (updates.statistiques) {
    if (updates.statistiques.appelsEmis !== undefined) agentUpdates.appels_emis = updates.statistiques.appelsEmis;
    if (updates.statistiques.appelsDecroches !== undefined) agentUpdates.appels_decroches = updates.statistiques.appelsDecroches;
    if (updates.statistiques.appelsTransformes !== undefined) agentUpdates.appels_transformes = updates.statistiques.appelsTransformes;
    if (updates.statistiques.rendezVousHonores !== undefined) agentUpdates.rendez_vous_honores = updates.statistiques.rendezVousHonores;
    if (updates.statistiques.rendezVousNonHonores !== undefined) agentUpdates.rendez_vous_non_honores = updates.statistiques.rendezVousNonHonores;
    if (updates.statistiques.dossiersValides !== undefined) agentUpdates.dossiers_valides = updates.statistiques.dossiersValides;
    if (updates.statistiques.dossiersSigne !== undefined) agentUpdates.dossiers_signe = updates.statistiques.dossiersSigne;
  }

  if (Object.keys(agentUpdates).length > 0) {
    // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
    const { error: agentError } = await supabase
      .from("agents")
      .update(agentUpdates)
      .eq("id", id);

    if (agentError) {
      console.error("Error updating agent:", agentError);
      return null;
    }
  }

  // Récupérer l'agent mis à jour
  return await getAgentById(id);
};

export const deleteAgent = async (id: string): Promise<boolean> => {
  // Comme nous avons une contrainte ON DELETE CASCADE, 
  // supprimer l'utilisateur supprimera automatiquement l'agent
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting agent:", error);
    return false;
  }

  return true;
};
