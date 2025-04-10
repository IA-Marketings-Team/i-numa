
import { supabase } from "@/integrations/supabase/client";
import { DossierComment } from "@/types";

/**
 * Fetch all comments for a specific dossier
 */
export const fetchCommentsByDossierId = async (dossierId: string): Promise<DossierComment[]> => {
  try {
    const { data, error } = await supabase
      .from('dossier_commentaires')
      .select(`
        id,
        dossier_id,
        user_id,
        user_name,
        user_role,
        content,
        created_at,
        is_call_note,
        call_duration
      `)
      .eq('dossier_id', dossierId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(`Erreur lors de la récupération des commentaires du dossier ${dossierId}:`, error);
      return [];
    }

    return data.map(comment => ({
      id: comment.id,
      dossierId: comment.dossier_id,
      userId: comment.user_id,
      userName: comment.user_name,
      userRole: comment.user_role,
      content: comment.content,
      createdAt: new Date(comment.created_at),
      isCallNote: comment.is_call_note,
      callDuration: comment.call_duration
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des commentaires du dossier ${dossierId}:`, error);
    return [];
  }
};

/**
 * Add a comment to a dossier
 */
export const addCommentToDossier = async (
  dossierId: string,
  userId: string,
  userName: string,
  userRole: string,
  content: string,
  isCallNote: boolean = false,
  callDuration?: number
): Promise<DossierComment | null> => {
  try {
    const { data, error } = await supabase
      .from('dossier_commentaires')
      .insert({
        dossier_id: dossierId,
        user_id: userId,
        user_name: userName,
        user_role: userRole,
        content: content,
        created_at: new Date().toISOString(),
        is_call_note: isCallNote,
        call_duration: callDuration
      })
      .select()
      .single();

    if (error) {
      console.error(`Erreur lors de l'ajout d'un commentaire au dossier ${dossierId}:`, error);
      return null;
    }

    return {
      id: data.id,
      dossierId: data.dossier_id,
      userId: data.user_id,
      userName: data.user_name,
      userRole: data.user_role,
      content: data.content,
      createdAt: new Date(data.created_at),
      isCallNote: data.is_call_note,
      callDuration: data.call_duration
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de l'ajout d'un commentaire au dossier ${dossierId}:`, error);
    return null;
  }
};

export const commentService = {
  fetchCommentsByDossierId,
  addCommentToDossier
};
