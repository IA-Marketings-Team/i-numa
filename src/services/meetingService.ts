
import { supabase } from "@/integrations/supabase/client";

interface MeetingData {
  titre: string;
  description?: string;
  date: Date;
  heure: string;
  type: 'visio' | 'presentiel';
  participants: string[];
  lien?: string;
  statut?: string;
}

/**
 * Créer un nouveau meeting
 */
export const createMeeting = async (meetingData: MeetingData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meetings')
      .insert({
        titre: meetingData.titre,
        description: meetingData.description,
        date: meetingData.date.toISOString(),
        duree: 30, // Durée par défaut de 30 minutes
        participants: meetingData.participants,
        type: meetingData.type,
        lien: meetingData.lien,
        statut: meetingData.statut || 'planifie'
      });

    if (error) {
      console.error("Erreur lors de la création du meeting:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur inattendue lors de la création du meeting:", error);
    return false;
  }
};

/**
 * Récupérer tous les meetings
 */
export const fetchMeetings = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des meetings:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des meetings:", error);
    return [];
  }
};

/**
 * Récupérer un meeting par son ID
 */
export const fetchMeetingById = async (id: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération du meeting ${id}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération du meeting ${id}:`, error);
    return null;
  }
};

/**
 * Mettre à jour un meeting existant
 */
export const updateMeeting = async (id: string, meetingData: Partial<MeetingData>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (meetingData.titre) updateData.titre = meetingData.titre;
    if (meetingData.description !== undefined) updateData.description = meetingData.description;
    if (meetingData.date) updateData.date = meetingData.date.toISOString();
    if (meetingData.heure) updateData.heure = meetingData.heure;
    if (meetingData.type) updateData.type = meetingData.type;
    if (meetingData.participants) updateData.participants = meetingData.participants;
    if (meetingData.lien !== undefined) updateData.lien = meetingData.lien;
    if (meetingData.statut) updateData.statut = meetingData.statut;

    const { error } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour du meeting ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour du meeting ${id}:`, error);
    return false;
  }
};

/**
 * Supprimer un meeting existant
 */
export const deleteMeeting = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression du meeting ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression du meeting ${id}:`, error);
    return false;
  }
};

export const meetingService = {
  createMeeting,
  fetchMeetings,
  fetchMeetingById,
  updateMeeting,
  deleteMeeting
};
