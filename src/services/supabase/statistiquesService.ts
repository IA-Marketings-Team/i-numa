
import { supabase } from "@/integrations/supabase/client";
import { Statistique, UserRole } from "@/types";

export const getStatistiqueById = async (id: string): Promise<Statistique | null> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("statistiques")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching statistique:", error);
    return null;
  }

  return {
    periode: data.periode as "jour" | "semaine" | "mois",
    dateDebut: new Date(data.date_debut),
    dateFin: new Date(data.date_fin),
    appelsEmis: data.appels_emis,
    appelsDecroches: data.appels_decroches,
    appelsTransformes: data.appels_transformes,
    rendezVousHonores: data.rendez_vous_honores,
    rendezVousNonHonores: data.rendez_vous_non_honores,
    dossiersValides: data.dossiers_valides,
    dossiersSigne: data.dossiers_signe,
    chiffreAffaires: data.chiffre_affaires
  };
};

export const getAllStatistiques = async (): Promise<Statistique[]> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("statistiques")
    .select("*")
    .order("date_debut", { ascending: false });

  if (error) {
    console.error("Error fetching statistiques:", error);
    return [];
  }

  return data.map((stat) => ({
    periode: stat.periode as "jour" | "semaine" | "mois",
    dateDebut: new Date(stat.date_debut),
    dateFin: new Date(stat.date_fin),
    appelsEmis: stat.appels_emis,
    appelsDecroches: stat.appels_decroches,
    appelsTransformes: stat.appels_transformes,
    rendezVousHonores: stat.rendez_vous_honores,
    rendezVousNonHonores: stat.rendez_vous_non_honores,
    dossiersValides: stat.dossiers_valides,
    dossiersSigne: stat.dossiers_signe,
    chiffreAffaires: stat.chiffre_affaires
  }));
};

export const getStatistiquesByPeriode = async (periode: "jour" | "semaine" | "mois"): Promise<Statistique[]> => {
  const { data, error } = await supabase
    .from("statistiques")
    .select("*")
    .eq("periode", periode)
    .order("date_debut", { ascending: false });

  if (error) {
    console.error(`Error fetching ${periode} statistiques:`, error);
    return [];
  }

  return data.map((stat) => ({
    periode: stat.periode as "jour" | "semaine" | "mois",
    dateDebut: new Date(stat.date_debut),
    dateFin: new Date(stat.date_fin),
    appelsEmis: stat.appels_emis,
    appelsDecroches: stat.appels_decroches,
    appelsTransformes: stat.appels_transformes,
    rendezVousHonores: stat.rendez_vous_honores,
    rendezVousNonHonores: stat.rendez_vous_non_honores,
    dossiersValides: stat.dossiers_valides,
    dossiersSigne: stat.dossiers_signe,
    chiffreAffaires: stat.chiffre_affaires
  }));
};

export const getStatistiquesForPeriod = async (debut: Date, fin: Date): Promise<Statistique[]> => {
  const { data, error } = await supabase
    .from("statistiques")
    .select("*")
    .gte("date_debut", debut.toISOString())
    .lte("date_fin", fin.toISOString())
    .order("date_debut");

  if (error) {
    console.error("Error fetching statistiques for period:", error);
    return [];
  }

  return data.map((stat) => ({
    periode: stat.periode as "jour" | "semaine" | "mois",
    dateDebut: new Date(stat.date_debut),
    dateFin: new Date(stat.date_fin),
    appelsEmis: stat.appels_emis,
    appelsDecroches: stat.appels_decroches,
    appelsTransformes: stat.appels_transformes,
    rendezVousHonores: stat.rendez_vous_honores,
    rendezVousNonHonores: stat.rendez_vous_non_honores,
    dossiersValides: stat.dossiers_valides,
    dossiersSigne: stat.dossiers_signe,
    chiffreAffaires: stat.chiffre_affaires
  }));
};

export const getAuthorizedStatistics = async (userRole: UserRole): Promise<Partial<Statistique>[]> => {
  const { data, error } = await supabase
    .from("statistiques")
    .select("*")
    .order("date_debut", { ascending: false });

  if (error) {
    console.error("Error fetching statistiques:", error);
    return [];
  }

  // Cloner les statistiques pour éviter de modifier les originales
  const authorizedStats = data.map((stat) => ({
    periode: stat.periode as "jour" | "semaine" | "mois",
    dateDebut: new Date(stat.date_debut),
    dateFin: new Date(stat.date_fin),
    appelsEmis: stat.appels_emis,
    appelsDecroches: stat.appels_decroches,
    appelsTransformes: stat.appels_transformes,
    rendezVousHonores: stat.rendez_vous_honores,
    rendezVousNonHonores: stat.rendez_vous_non_honores,
    dossiersValides: stat.dossiers_valides,
    dossiersSigne: stat.dossiers_signe,
    chiffreAffaires: stat.chiffre_affaires
  }));
  
  // Appliquer les restrictions selon le rôle
  if (userRole !== 'responsable' && userRole !== 'superviseur') {
    // Supprimer les informations financières pour les autres rôles
    authorizedStats.forEach(stat => {
      delete stat.chiffreAffaires;
    });
  }
  
  // Limiter l'historique à 3 mois pour les agents
  if (userRole === 'agent_phoner' || userRole === 'agent_visio') {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    return authorizedStats.filter(stat => stat.dateDebut >= threeMonthsAgo);
  }
  
  return authorizedStats;
};

export const createStatistique = async (statistique: Omit<Statistique, "id">): Promise<Statistique | null> => {
  // @ts-ignore - Ignoring type error since we know the table exists but TypeScript doesn't
  const { data, error } = await supabase
    .from("statistiques")
    .insert([
      {
        periode: statistique.periode,
        date_debut: statistique.dateDebut.toISOString(),
        date_fin: statistique.dateFin.toISOString(),
        appels_emis: statistique.appelsEmis,
        appels_decroches: statistique.appelsDecroches,
        appels_transformes: statistique.appelsTransformes,
        rendez_vous_honores: statistique.rendezVousHonores,
        rendez_vous_non_honores: statistique.rendezVousNonHonores,
        dossiers_valides: statistique.dossiersValides,
        dossiers_signe: statistique.dossiersSigne,
        chiffre_affaires: statistique.chiffreAffaires
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating statistique:", error);
    return null;
  }

  return {
    periode: data.periode as "jour" | "semaine" | "mois",
    dateDebut: new Date(data.date_debut),
    dateFin: new Date(data.date_fin),
    appelsEmis: data.appels_emis,
    appelsDecroches: data.appels_decroches,
    appelsTransformes: data.appels_transformes,
    rendezVousHonores: data.rendez_vous_honores,
    rendezVousNonHonores: data.rendez_vous_non_honores,
    dossiersValides: data.dossiers_valides,
    dossiersSigne: data.dossiers_signe,
    chiffreAffaires: data.chiffre_affaires
  };
};

export const updateStatistique = async (id: string, updates: Partial<Statistique>): Promise<Statistique | null> => {
  const updateData: any = {};
  
  if (updates.periode) updateData.periode = updates.periode;
  if (updates.dateDebut) updateData.date_debut = updates.dateDebut.toISOString();
  if (updates.dateFin) updateData.date_fin = updates.dateFin.toISOString();
  if (updates.appelsEmis !== undefined) updateData.appels_emis = updates.appelsEmis;
  if (updates.appelsDecroches !== undefined) updateData.appels_decroches = updates.appelsDecroches;
  if (updates.appelsTransformes !== undefined) updateData.appels_transformes = updates.appelsTransformes;
  if (updates.rendezVousHonores !== undefined) updateData.rendez_vous_honores = updates.rendezVousHonores;
  if (updates.rendezVousNonHonores !== undefined) updateData.rendez_vous_non_honores = updates.rendezVousNonHonores;
  if (updates.dossiersValides !== undefined) updateData.dossiers_valides = updates.dossiersValides;
  if (updates.dossiersSigne !== undefined) updateData.dossiers_signe = updates.dossiersSigne;
  if (updates.chiffreAffaires !== undefined) updateData.chiffre_affaires = updates.chiffreAffaires;

  const { data, error } = await supabase
    .from("statistiques")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating statistique:", error);
    return null;
  }

  return {
    periode: data.periode as "jour" | "semaine" | "mois",
    dateDebut: new Date(data.date_debut),
    dateFin: new Date(data.date_fin),
    appelsEmis: data.appels_emis,
    appelsDecroches: data.appels_decroches,
    appelsTransformes: data.appels_transformes,
    rendezVousHonores: data.rendez_vous_honores,
    rendezVousNonHonores: data.rendez_vous_non_honores,
    dossiersValides: data.dossiers_valides,
    dossiersSigne: data.dossiers_signe,
    chiffreAffaires: data.chiffre_affaires
  };
};

export const deleteStatistique = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("statistiques")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting statistique:", error);
    return false;
  }

  return true;
};
