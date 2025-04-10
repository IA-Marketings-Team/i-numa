
import { supabase } from "@/integrations/supabase/client";
import { DossierComment } from "@/types";

/**
 * Récupère les commentaires d'un dossier
 */
export const fetchDossierComments = async (dossierId: string): Promise<DossierComment[]> => {
  try {
    // Use Supabase query builder to fetch comments
    const { data, error } = await supabase
      .from('dossier_commentaires')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des commentaires:", error);
      return [];
    }

    // Map the database response to our DossierComment type
    return data.map(comment => ({
      id: comment.id,
      dossierId: comment.dossier_id,
      userId: comment.user_id,
      userName: comment.user_name,
      userRole: comment.user_role,
      content: comment.content,
      createdAt: new Date(comment.created_at),
      isCallNote: comment.is_call_note || false,
      callDuration: comment.call_duration
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des commentaires:", error);
    return [];
  }
};

/**
 * Ajoute un commentaire à un dossier
 */
export const addDossierComment = async (
  dossierId: string,
  userId: string,
  userName: string,
  userRole: string,
  content: string,
  isCallNote: boolean = false,
  callDuration?: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('dossier_commentaires')
      .insert({
        dossier_id: dossierId,
        user_id: userId,
        user_name: userName,
        user_role: userRole,
        content: content,
        is_call_note: isCallNote,
        call_duration: callDuration
      });

    if (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur inattendue lors de l'ajout du commentaire:", error);
    return false;
  }
};

// Export du service pour l'utiliser dans d'autres fichiers
export const commentService = {
  fetchDossierComments,
  addDossierComment
};
