
import { Statistique } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère toutes les statistiques depuis Supabase
 */
export const fetchStatistiques = async (): Promise<Statistique[]> => {
  try {
    const { data, error } = await supabase
      .from('statistiques')
      .select('*')
      .order('date_debut', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      return [];
    }

    return data.map(stat => ({
      id: stat.id,
      periode: stat.periode,
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
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des statistiques:", error);
    return [];
  }
};

/**
 * Récupère les statistiques entre deux dates
 */
export const fetchStatistiquesBetweenDates = async (
  startDate: Date,
  endDate: Date
): Promise<Statistique[]> => {
  try {
    const { data, error } = await supabase
      .from('statistiques')
      .select('*')
      .gte('date_debut', startDate.toISOString())
      .lte('date_fin', endDate.toISOString())
      .order('date_debut', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des statistiques par plage de dates:", error);
      return [];
    }

    return data.map(stat => ({
      id: stat.id,
      periode: stat.periode,
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
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des statistiques par plage de dates:", error);
    return [];
  }
};

/**
 * Récupère une statistique par son ID
 */
export const fetchStatistiqueById = async (id: string): Promise<Statistique | null> => {
  try {
    const { data, error } = await supabase
      .from('statistiques')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de la statistique ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      periode: data.periode,
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
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de la statistique ${id}:`, error);
    return null;
  }
};

/**
 * Crée une nouvelle statistique
 */
export const createStatistique = async (statistique: Omit<Statistique, "id">): Promise<Statistique | null> => {
  try {
    const { data, error } = await supabase
      .from('statistiques')
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la statistique:", error);
      return null;
    }

    return {
      id: data.id,
      periode: data.periode,
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
  } catch (error) {
    console.error("Erreur inattendue lors de la création de la statistique:", error);
    return null;
  }
};

/**
 * Met à jour une statistique existante
 */
export const updateStatistique = async (id: string, updates: Partial<Statistique>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.periode !== undefined) updateData.periode = updates.periode;
    if (updates.dateDebut !== undefined) updateData.date_debut = updates.dateDebut.toISOString();
    if (updates.dateFin !== undefined) updateData.date_fin = updates.dateFin.toISOString();
    if (updates.appelsEmis !== undefined) updateData.appels_emis = updates.appelsEmis;
    if (updates.appelsDecroches !== undefined) updateData.appels_decroches = updates.appelsDecroches;
    if (updates.appelsTransformes !== undefined) updateData.appels_transformes = updates.appelsTransformes;
    if (updates.rendezVousHonores !== undefined) updateData.rendez_vous_honores = updates.rendezVousHonores;
    if (updates.rendezVousNonHonores !== undefined) updateData.rendez_vous_non_honores = updates.rendezVousNonHonores;
    if (updates.dossiersValides !== undefined) updateData.dossiers_valides = updates.dossiersValides;
    if (updates.dossiersSigne !== undefined) updateData.dossiers_signe = updates.dossiersSigne;
    if (updates.chiffreAffaires !== undefined) updateData.chiffre_affaires = updates.chiffreAffaires;
    
    const { error } = await supabase
      .from('statistiques')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de la statistique ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour de la statistique ${id}:`, error);
    return false;
  }
};

/**
 * Supprime une statistique
 */
export const deleteStatistique = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('statistiques')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression de la statistique ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression de la statistique ${id}:`, error);
    return false;
  }
};
