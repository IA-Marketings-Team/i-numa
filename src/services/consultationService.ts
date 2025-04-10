
import { supabase } from "@/integrations/supabase/client";
import { DossierConsultation, UserRole } from "@/types";

/**
 * Enregistre une consultation de dossier
 */
export const recordDossierConsultation = async (
  dossierId: string,
  userId: string,
  userName: string,
  userRole: UserRole
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('dossier_consultations')
      .insert({
        dossier_id: dossierId,
        user_id: userId,
        user_name: userName,
        user_role: userRole,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error("Erreur lors de l'enregistrement de la consultation:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur inattendue lors de l'enregistrement de la consultation:", error);
    return false;
  }
};

/**
 * Récupère l'historique des consultations de dossier
 */
export const fetchDossierConsultations = async (): Promise<DossierConsultation[]> => {
  try {
    const { data, error } = await supabase
      .from('dossier_consultations')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des consultations:", error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      dossierId: item.dossier_id,
      userId: item.user_id,
      userName: item.user_name,
      userRole: item.user_role as UserRole,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des consultations:", error);
    return [];
  }
};

/**
 * Récupère l'historique des consultations d'un dossier spécifique
 */
export const fetchConsultationsByDossierId = async (dossierId: string): Promise<DossierConsultation[]> => {
  try {
    const { data, error } = await supabase
      .from('dossier_consultations')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des consultations pour le dossier ${dossierId}:`, error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      dossierId: item.dossier_id,
      userId: item.user_id,
      userName: item.user_name,
      userRole: item.user_role as UserRole,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des consultations pour le dossier ${dossierId}:`, error);
    return [];
  }
};

export const consultationService = {
  recordDossierConsultation,
  fetchDossierConsultations,
  fetchConsultationsByDossierId
};
