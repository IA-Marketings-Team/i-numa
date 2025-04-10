
import { supabase } from "@/integrations/supabase/client";
import { DossierConsultation } from "@/types";

/**
 * Record a dossier consultation event
 */
export const recordDossierConsultation = async (
  dossierId: string,
  userId: string,
  userName: string,
  userRole: string,
  action: string = 'view'
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .rpc('record_dossier_consultation', {
        p_dossier_id: dossierId,
        p_user_id: userId,
        p_user_name: userName,
        p_user_role: userRole,
        p_action: action
      });
      
    if (error) {
      console.error("Error recording dossier consultation:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Unexpected error recording dossier consultation:", error);
    return null;
  }
};

/**
 * Fetch consultations for a specific dossier
 */
export const fetchConsultationsByDossierId = async (dossierId: string): Promise<DossierConsultation[]> => {
  try {
    const { data, error } = await supabase
      .from('dossier_consultations')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error(`Error fetching consultations for dossier ${dossierId}:`, error);
      return [];
    }
    
    return data.map(consultation => ({
      id: consultation.id,
      userId: consultation.user_id,
      userName: consultation.user_name,
      userRole: consultation.user_role,
      dossierId: consultation.dossier_id,
      timestamp: new Date(consultation.timestamp)
    }));
  } catch (error) {
    console.error(`Unexpected error fetching consultations for dossier ${dossierId}:`, error);
    return [];
  }
};

/**
 * Fetch all consultations with optional filtering
 */
export const fetchAllConsultations = async (
  filters: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    dossierId?: string;
  } = {}
): Promise<DossierConsultation[]> => {
  try {
    let query = supabase
      .from('dossier_consultations')
      .select('*')
      .order('timestamp', { ascending: false });
      
    // Apply filters
    if (filters.startDate) {
      query = query.gte('timestamp', filters.startDate.toISOString());
    }
    
    if (filters.endDate) {
      query = query.lte('timestamp', filters.endDate.toISOString());
    }
    
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    
    if (filters.dossierId) {
      query = query.eq('dossier_id', filters.dossierId);
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error("Error fetching all consultations:", error);
      return [];
    }
    
    return data.map(consultation => ({
      id: consultation.id,
      userId: consultation.user_id,
      userName: consultation.user_name,
      userRole: consultation.user_role,
      dossierId: consultation.dossier_id,
      timestamp: new Date(consultation.timestamp)
    }));
  } catch (error) {
    console.error("Unexpected error fetching all consultations:", error);
    return [];
  }
};
