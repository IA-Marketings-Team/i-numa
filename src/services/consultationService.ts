
import { supabase } from "@/integrations/supabase/client";
import { DossierConsultation, UserRole } from "@/types";

/**
 * Record a consultation of a dossier by a user
 */
export const recordDossierConsultation = async (
  dossierId: string,
  userId: string,
  userName: string,
  userRole: UserRole
): Promise<DossierConsultation | null> => {
  try {
    const { data, error } = await supabase
      .from('dossier_consultations')
      .insert({
        dossier_id: dossierId,
        user_id: userId,
        user_name: userName,
        user_role: userRole,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error(`Erreur lors de l'enregistrement de la consultation du dossier ${dossierId}:`, error);
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userRole: data.user_role as UserRole,
      dossierId: data.dossier_id,
      timestamp: new Date(data.timestamp)
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de l'enregistrement de la consultation du dossier ${dossierId}:`, error);
    return null;
  }
};

/**
 * Fetch all consultations for a specific dossier
 */
export const fetchConsultationsByDossierId = async (dossierId: string): Promise<DossierConsultation[]> => {
  try {
    const { data, error } = await supabase
      .from('dossier_consultations')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des consultations du dossier ${dossierId}:`, error);
      return [];
    }

    return data.map(consultation => ({
      id: consultation.id,
      userId: consultation.user_id,
      userName: consultation.user_name,
      userRole: consultation.user_role as UserRole,
      dossierId: consultation.dossier_id,
      timestamp: new Date(consultation.timestamp)
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des consultations du dossier ${dossierId}:`, error);
    return [];
  }
};

/**
 * Fetch all recent consultations across all dossiers
 */
export const fetchRecentConsultations = async (limit: number = 50): Promise<DossierConsultation[]> => {
  try {
    const { data, error } = await supabase
      .from('dossier_consultations')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(`Erreur lors de la récupération des consultations récentes:`, error);
      return [];
    }

    return data.map(consultation => ({
      id: consultation.id,
      userId: consultation.user_id,
      userName: consultation.user_name,
      userRole: consultation.user_role as UserRole,
      dossierId: consultation.dossier_id,
      timestamp: new Date(consultation.timestamp)
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des consultations récentes:`, error);
    return [];
  }
};

export const consultationService = {
  recordDossierConsultation,
  fetchConsultationsByDossierId,
  fetchRecentConsultations
};
