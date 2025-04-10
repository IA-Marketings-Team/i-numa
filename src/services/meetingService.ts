
import { supabase } from "@/integrations/supabase/client";
import { Meeting } from "@/types";

interface MeetingData {
  titre: string;
  description?: string;
  date: Date;
  heure?: string;
  duree?: number;
  type: 'visio' | 'presentiel' | 'telephonique';
  participants: string[];
  lien?: string;
  statut?: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'effectue' | 'manque';
}

/**
 * Créer un nouveau meeting
 */
export const createMeeting = async (meetingData: MeetingData): Promise<Meeting | null> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        titre: meetingData.titre,
        description: meetingData.description,
        date: meetingData.date.toISOString(),
        duree: meetingData.duree || 30, // Durée par défaut de 30 minutes
        participants: meetingData.participants,
        type: meetingData.type,
        lien: meetingData.lien || '',
        statut: meetingData.statut || 'planifie'
      })
      .select('*')
      .single();

    if (error) {
      console.error("Erreur lors de la création du meeting:", error);
      return null;
    }

    return {
      id: data.id,
      titre: data.titre,
      description: data.description || '',
      date: new Date(data.date),
      duree: data.duree,
      lien: data.lien || '',
      type: data.type as 'visio' | 'presentiel' | 'telephonique',
      statut: data.statut as 'planifie' | 'en_cours' | 'termine' | 'annule' | 'effectue' | 'manque',
      participants: data.participants || [],
      heure: meetingData.heure || new Date(data.date).toTimeString().substr(0, 5)
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création du meeting:", error);
    return null;
  }
};

/**
 * Récupérer tous les meetings
 */
export const fetchMeetings = async (): Promise<Meeting[]> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des meetings:", error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      titre: item.titre,
      description: item.description || '',
      date: new Date(item.date),
      duree: item.duree,
      lien: item.lien || '',
      type: item.type as 'visio' | 'presentiel' | 'telephonique',
      statut: item.statut as 'planifie' | 'en_cours' | 'termine' | 'annule' | 'effectue' | 'manque',
      participants: item.participants || [],
      heure: new Date(item.date).toTimeString().substr(0, 5) // Extract hours and minutes from date
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des meetings:", error);
    return [];
  }
};

/**
 * Récupérer un meeting par son ID
 */
export const fetchMeetingById = async (id: string): Promise<Meeting | null> => {
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

    return {
      id: data.id,
      titre: data.titre,
      description: data.description || '',
      date: new Date(data.date),
      duree: data.duree,
      lien: data.lien || '',
      type: data.type as 'visio' | 'presentiel' | 'telephonique',
      statut: data.statut as 'planifie' | 'en_cours' | 'termine' | 'annule' | 'effectue' | 'manque',
      participants: data.participants || [],
      heure: new Date(data.date).toTimeString().substr(0, 5) // Extract hours and minutes from date
    };
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
    if (meetingData.type) updateData.type = meetingData.type;
    if (meetingData.participants) updateData.participants = meetingData.participants;
    if (meetingData.lien !== undefined) updateData.lien = meetingData.lien;
    if (meetingData.statut) updateData.statut = meetingData.statut;
    if (meetingData.duree) updateData.duree = meetingData.duree;

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
