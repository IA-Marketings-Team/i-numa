
import { supabase } from "@/integrations/supabase/client";
import { DossierComment, UserRole } from "@/types";

/**
 * Récupère tous les commentaires d'un dossier
 */
export const fetchCommentsByDossierId = async (dossierId: string): Promise<DossierComment[]> => {
  try {
    const { data, error } = await supabase
      .from('dossier_commentaires')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(comment => ({
      id: comment.id,
      dossierId: comment.dossier_id,
      userId: comment.user_id,
      userName: comment.user_name,
      userRole: comment.user_role as UserRole, // Cast to UserRole type
      content: comment.content,
      createdAt: new Date(comment.created_at),
      isCallNote: comment.is_call_note || false,
      callDuration: comment.call_duration,
      isPublic: comment.is_public || false
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
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
  userRole: string,
  content: string,
  isPublic: boolean = false,
  callDuration?: number
): Promise<DossierComment | null> => {
  try {
    const isCallNote = callDuration !== undefined;
    
    // Utilisation de la fonction RPC add_dossier_comment
    const { data, error } = await supabase
      .rpc('add_dossier_comment', {
        p_dossier_id: dossierId,
        p_content: content,
        p_is_call_note: isCallNote,
        p_call_duration: callDuration,
        p_is_public: isPublic
      });
    
    if (error) throw error;
    
    // Récupérer le commentaire créé
    const { data: commentData, error: commentError } = await supabase
      .from('dossier_commentaires')
      .select('*')
      .eq('id', data)
      .single();
    
    if (commentError) throw commentError;
    
    // Enregistrer la consultation du dossier
    await supabase
      .rpc('record_dossier_consultation', {
        p_dossier_id: dossierId,
        p_user_id: userId,
        p_user_name: userName,
        p_user_role: userRole,
        p_action: isCallNote ? 'call_note' : 'comment'
      });
    
    return {
      id: commentData.id,
      dossierId: commentData.dossier_id,
      userId: commentData.user_id,
      userName: commentData.user_name,
      userRole: commentData.user_role as UserRole, // Cast to UserRole type
      content: commentData.content,
      createdAt: new Date(commentData.created_at),
      isCallNote: commentData.is_call_note || false,
      callDuration: commentData.call_duration,
      isPublic: commentData.is_public || false
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
    return null;
  }
};
