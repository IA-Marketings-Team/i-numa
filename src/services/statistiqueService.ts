
import { Statistique } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Helper function to convert Supabase table data to Statistique objects
const mapToStatistique = (data: any): Statistique => ({
  id: data.id || crypto.randomUUID(),
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
});

// Fetch all statistiques from backup table
export const fetchStatistiques = async (): Promise<Statistique[]> => {
  try {
    const { data, error } = await supabase
      .from('statistiques_backup')
      .select('*')
      .order('date_debut', { ascending: false });

    if (error) {
      console.error("Error fetching statistiques:", error);
      return [];
    }

    return data.map(mapToStatistique);
  } catch (error) {
    console.error("Unexpected error fetching statistiques:", error);
    return [];
  }
};

// Fetch statistiques by period type (day, week, month)
export const fetchStatistiquesByPeriode = async (periode: "jour" | "semaine" | "mois"): Promise<Statistique[]> => {
  try {
    const { data, error } = await supabase
      .from('statistiques_backup')
      .select('*')
      .eq('periode', periode)
      .order('date_debut', { ascending: false });

    if (error) {
      console.error(`Error fetching statistiques for period ${periode}:`, error);
      return [];
    }

    return data.map(mapToStatistique);
  } catch (error) {
    console.error(`Unexpected error fetching statistiques for period ${periode}:`, error);
    return [];
  }
};

// Fetch statistiques between two dates
export const fetchStatistiquesBetweenDates = async (debut: Date, fin: Date): Promise<Statistique[]> => {
  try {
    const { data, error } = await supabase
      .from('statistiques_backup')
      .select('*')
      .gte('date_debut', debut.toISOString())
      .lte('date_fin', fin.toISOString())
      .order('date_debut', { ascending: false });

    if (error) {
      console.error("Error fetching statistiques between dates:", error);
      return [];
    }

    return data.map(mapToStatistique);
  } catch (error) {
    console.error("Unexpected error fetching statistiques between dates:", error);
    return [];
  }
};

// Create a new statistique
export const createStatistique = async (statistique: Omit<Statistique, "id">): Promise<Statistique | null> => {
  try {
    const { data, error } = await supabase
      .from('statistiques_backup')
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
      console.error("Error creating statistique:", error);
      return null;
    }

    return mapToStatistique(data);
  } catch (error) {
    console.error("Unexpected error creating statistique:", error);
    return null;
  }
};

// Update an existing statistique
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
      .from('statistiques_backup')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating statistique ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error updating statistique ${id}:`, error);
    return false;
  }
};

// Delete a statistique
export const deleteStatistique = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('statistiques_backup')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting statistique ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting statistique ${id}:`, error);
    return false;
  }
};
