
import { supabase } from "@/integrations/supabase/client";

export interface Meeting {
  id: string;
  titre: string;
  description: string;
  date: Date;
  duree: number; // en minutes
  lien: string;
  type: 'visio' | 'presentiel' | 'telephonique';
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule';
  participants: string[]; // IDs des participants
}

/**
 * Récupère toutes les réunions depuis Supabase
 */
export const fetchMeetings = async (): Promise<Meeting[]> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des réunions:", error);
      return [];
    }

    return data.map(meeting => ({
      id: meeting.id,
      titre: meeting.titre || '',
      description: meeting.description || '',
      date: new Date(meeting.date),
      duree: meeting.duree,
      lien: meeting.lien || '',
      type: convertMeetingType(meeting.type),
      statut: convertMeetingStatut(meeting.statut),
      participants: meeting.participants || []
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des réunions:", error);
    return [];
  }
};

/**
 * Récupère les réunions pour un participant spécifique
 */
export const fetchMeetingsByParticipant = async (participantId: string): Promise<Meeting[]> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .contains('participants', [participantId])
      .order('date', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des réunions pour le participant ${participantId}:`, error);
      return [];
    }

    return data.map(meeting => ({
      id: meeting.id,
      titre: meeting.titre || '',
      description: meeting.description || '',
      date: new Date(meeting.date),
      duree: meeting.duree,
      lien: meeting.lien || '',
      type: convertMeetingType(meeting.type),
      statut: convertMeetingStatut(meeting.statut),
      participants: meeting.participants || []
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des réunions pour le participant ${participantId}:`, error);
    return [];
  }
};

/**
 * Récupère une réunion par son ID
 */
export const fetchMeetingById = async (id: string): Promise<Meeting | null> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de la réunion ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      titre: data.titre || '',
      description: data.description || '',
      date: new Date(data.date),
      duree: data.duree,
      lien: data.lien || '',
      type: convertMeetingType(data.type),
      statut: convertMeetingStatut(data.statut),
      participants: data.participants || []
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de la réunion ${id}:`, error);
    return null;
  }
};

/**
 * Crée une nouvelle réunion
 */
export const createMeeting = async (meeting: Omit<Meeting, "id">): Promise<Meeting | null> => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        titre: meeting.titre,
        description: meeting.description,
        date: meeting.date.toISOString(),
        duree: meeting.duree,
        lien: meeting.lien,
        type: meeting.type,
        statut: meeting.statut,
        participants: meeting.participants
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la réunion:", error);
      return null;
    }

    return {
      id: data.id,
      titre: data.titre || '',
      description: data.description || '',
      date: new Date(data.date),
      duree: data.duree,
      lien: data.lien || '',
      type: convertMeetingType(data.type),
      statut: convertMeetingStatut(data.statut),
      participants: data.participants || []
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création de la réunion:", error);
    return null;
  }
};

/**
 * Met à jour une réunion existante
 */
export const updateMeeting = async (id: string, updates: Partial<Meeting>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.titre !== undefined) updateData.titre = updates.titre;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.date !== undefined) updateData.date = updates.date.toISOString();
    if (updates.duree !== undefined) updateData.duree = updates.duree;
    if (updates.lien !== undefined) updateData.lien = updates.lien;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.statut !== undefined) updateData.statut = updates.statut;
    if (updates.participants !== undefined) updateData.participants = updates.participants;
    
    const { error } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de la réunion ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour de la réunion ${id}:`, error);
    return false;
  }
};

/**
 * Supprime une réunion
 */
export const deleteMeeting = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression de la réunion ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression de la réunion ${id}:`, error);
    return false;
  }
};

/**
 * Ajoute un participant à une réunion
 */
export const addParticipantToMeeting = async (meetingId: string, participantId: string): Promise<boolean> => {
  try {
    // D'abord, récupérons la réunion pour obtenir les participants actuels
    const meeting = await fetchMeetingById(meetingId);
    if (!meeting) return false;
    
    // Vérifions si le participant est déjà dans la liste
    if (meeting.participants.includes(participantId)) return true;
    
    // Ajoutons le nouveau participant
    const updatedParticipants = [...meeting.participants, participantId];
    
    const { error } = await supabase
      .from('meetings')
      .update({ participants: updatedParticipants })
      .eq('id', meetingId);
    
    if (error) {
      console.error(`Erreur lors de l'ajout du participant ${participantId} à la réunion ${meetingId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de l'ajout du participant ${participantId} à la réunion ${meetingId}:`, error);
    return false;
  }
};

/**
 * Supprime un participant d'une réunion
 */
export const removeParticipantFromMeeting = async (meetingId: string, participantId: string): Promise<boolean> => {
  try {
    // D'abord, récupérons la réunion pour obtenir les participants actuels
    const meeting = await fetchMeetingById(meetingId);
    if (!meeting) return false;
    
    // Filtrons le participant à supprimer
    const updatedParticipants = meeting.participants.filter(id => id !== participantId);
    
    const { error } = await supabase
      .from('meetings')
      .update({ participants: updatedParticipants })
      .eq('id', meetingId);
    
    if (error) {
      console.error(`Erreur lors de la suppression du participant ${participantId} de la réunion ${meetingId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression du participant ${participantId} de la réunion ${meetingId}:`, error);
    return false;
  }
};

// Fonctions auxiliaires pour convertir les types de réunion
const convertMeetingType = (type: string): 'visio' | 'presentiel' | 'telephonique' => {
  if (type === 'visio' || type === 'presentiel' || type === 'telephonique') {
    return type as 'visio' | 'presentiel' | 'telephonique';
  }
  // Valeur par défaut si le type n'est pas reconnu
  return 'visio';
};

const convertMeetingStatut = (statut: string): 'planifie' | 'en_cours' | 'termine' | 'annule' => {
  if (statut === 'planifie' || statut === 'en_cours' || statut === 'termine' || statut === 'annule') {
    return statut as 'planifie' | 'en_cours' | 'termine' | 'annule';
  }
  // Valeur par défaut si le statut n'est pas reconnu
  return 'planifie';
};
