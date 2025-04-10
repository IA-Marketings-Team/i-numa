
import { supabase } from "@/integrations/supabase/client";
import { DossierComment, UserRole } from "@/types";

/**
 * Récupère les commentaires associés à un dossier
 */
export const fetchCommentsByDossierId = async (dossierId: string): Promise<DossierComment[]> => {
  try {
    const { data, error } = await supabase
      .from('dossier_commentaires')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des commentaires:", error);
      return [];
    }

    return data ? data.map(comment => ({
      id: comment.id,
      dossierId: comment.dossier_id,
      userId: comment.user_id,
      userName: comment.user_name,
      userRole: comment.user_role as UserRole,
      content: comment.content,
      createdAt: new Date(comment.created_at),
      isCallNote: comment.is_call_note || false,
      callDuration: comment.call_duration,
      isPublic: comment.is_public || false
    })) : [];
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des commentaires:", error);
    return [];
  }
};

/**
 * Ajoute un commentaire à un dossier
 */
export const addCommentToDossier = async (
  dossierId: string,
  userId: string,
  userName: string,
  userRole: UserRole,
  content: string,
  isPublic: boolean = false,
  callDuration?: number
): Promise<DossierComment | null> => {
  try {
    const isCallNote = callDuration !== undefined;
    
    const { data, error } = await supabase
      .rpc('add_dossier_comment', {
        p_dossier_id: dossierId,
        p_content: content,
        p_is_call_note: isCallNote,
        p_call_duration: callDuration,
        p_is_public: isPublic
      });
    
    if (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      return null;
    }
    
    // Record the consultation with the appropriate action
    await recordDossierConsultation(
      dossierId,
      userId,
      userName,
      userRole,
      isCallNote ? 'call_note' : 'comment'
    );
    
    // Retrieve the newly created comment
    const { data: commentData, error: commentError } = await supabase
      .from('dossier_commentaires')
      .select('*')
      .eq('id', data)
      .single();
    
    if (commentError || !commentData) {
      console.error("Erreur lors de la récupération du commentaire créé:", commentError);
      return null;
    }
    
    return {
      id: commentData.id,
      dossierId: commentData.dossier_id,
      userId: commentData.user_id,
      userName: commentData.user_name,
      userRole: commentData.user_role as UserRole,
      content: commentData.content,
      createdAt: new Date(commentData.created_at),
      isCallNote: commentData.is_call_note || false,
      callDuration: commentData.call_duration,
      isPublic: commentData.is_public || false
    };
  } catch (error) {
    console.error("Erreur inattendue lors de l'ajout du commentaire:", error);
    return null;
  }
};

/**
 * Function to record dossier consultation in the dossier_consultations table
 */
export const recordDossierConsultation = async (
  dossierId: string,
  userId: string,
  userName: string,
  userRole: UserRole,
  action: string = 'view'
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('dossier_consultations')
      .insert({
        dossier_id: dossierId,
        user_id: userId,
        user_name: userName,
        user_role: userRole,
        action: action,
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
