
import { Statistique } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère toutes les statistiques
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
 * Récupère les statistiques par période
 */
export const fetchStatistiquesByPeriode = async (periode: 'jour' | 'semaine' | 'mois'): Promise<Statistique[]> => {
  try {
    const { data, error } = await supabase
      .from('statistiques')
      .select('*')
      .eq('periode', periode)
      .order('date_debut', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des statistiques pour la période ${periode}:`, error);
      return [];
    }

    return data.map(stat => ({
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
    console.error(`Erreur inattendue lors de la récupération des statistiques pour la période ${periode}:`, error);
    return [];
  }
};

/**
 * Récupère les statistiques entre deux dates
 */
export const fetchStatistiquesBetweenDates = async (debut: Date, fin: Date): Promise<Statistique[]> => {
  try {
    const { data, error } = await supabase
      .from('statistiques')
      .select('*')
      .gte('date_debut', debut.toISOString())
      .lte('date_fin', fin.toISOString())
      .order('date_debut', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des statistiques entre ${debut} et ${fin}:`, error);
      return [];
    }

    return data.map(stat => ({
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
    console.error(`Erreur inattendue lors de la récupération des statistiques entre ${debut} et ${fin}:`, error);
    return [];
  }
};

/**
 * Crée de nouvelles statistiques
 */
export const createStatistique = async (statistique: Omit<Statistique, 'id'>): Promise<Statistique | null> => {
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
      console.error("Erreur lors de la création des statistiques:", error);
      return null;
    }

    return {
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
    console.error("Erreur inattendue lors de la création des statistiques:", error);
    return null;
  }
};

/**
 * Fonction pour générer automatiquement les statistiques globales à partir des actions effectuées
 */
export const generateStatistiques = async (): Promise<boolean> => {
  try {
    // 1. Récupérer les données des agents (statistiques individuelles)
    const { data: agents } = await supabase
      .from('profiles')
      .select('appels_emis, appels_decroches, appels_transformes, rendez_vous_honores, rendez_vous_non_honores, dossiers_valides, dossiers_signe')
      .in('role', ['agent_phoner', 'agent_visio']);
    
    if (!agents || agents.length === 0) return false;
    
    // 2. Agréger les données
    const stats = agents.reduce((acc, agent) => {
      acc.appelsEmis += agent.appels_emis || 0;
      acc.appelsDecroches += agent.appels_decroches || 0;
      acc.appelsTransformes += agent.appels_transformes || 0;
      acc.rendezVousHonores += agent.rendez_vous_honores || 0;
      acc.rendezVousNonHonores += agent.rendez_vous_non_honores || 0;
      acc.dossiersValides += agent.dossiers_valides || 0;
      acc.dossiersSigne += agent.dossiers_signe || 0;
      return acc;
    }, {
      appelsEmis: 0,
      appelsDecroches: 0,
      appelsTransformes: 0,
      rendezVousHonores: 0,
      rendezVousNonHonores: 0,
      dossiersValides: 0,
      dossiersSigne: 0
    });
    
    // 3. Calculer le chiffre d'affaires
    const { data: dossiers } = await supabase
      .from('dossiers')
      .select('montant')
      .eq('status', 'signe');
    
    const chiffreAffaires = dossiers?.reduce((sum, dossier) => sum + (dossier.montant || 0), 0) || 0;
    
    // 4. Créer les statistiques pour aujourd'hui
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await createStatistique({
      periode: 'jour',
      dateDebut: today,
      dateFin: tomorrow,
      appelsEmis: stats.appelsEmis,
      appelsDecroches: stats.appelsDecroches,
      appelsTransformes: stats.appelsTransformes,
      rendezVousHonores: stats.rendezVousHonores,
      rendezVousNonHonores: stats.rendezVousNonHonores,
      dossiersValides: stats.dossiersValides,
      dossiersSigne: stats.dossiersSigne,
      chiffreAffaires
    });
    
    return true;
  } catch (error) {
    console.error("Erreur inattendue lors de la génération des statistiques:", error);
    return false;
  }
};
