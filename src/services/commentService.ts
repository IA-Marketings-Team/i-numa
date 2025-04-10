
import { supabase } from "@/integrations/supabase/client";
import { DossierComment } from "@/types";

/**
 * Add a comment to a dossier
 */
export const addDossierComment = async (
  dossierId: string,
  content: string,
  userId: string,
  userName: string,
  userRole: string,
  isPublic: boolean = false
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('add_dossier_comment', {
      p_dossier_id: dossierId,
      p_content: content,
      p_is_public: isPublic
    });
    
    if (error) {
      console.error("Error adding comment:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Unexpected error adding comment:", error);
    return null;
  }
};

/**
 * Add a call note to a dossier
 */
export const addCallNote = async (
  dossierId: string,
  content: string,
  duration: number,
  userId: string,
  userName: string,
  userRole: string
): Promise<string | null> => {
  try {
    // Using the record_call_note RPC function
    const { data, error } = await supabase.rpc('record_call_note', {
      p_dossier_id: dossierId,
      p_content: content,
      p_duration: duration
    });
    
    if (error) {
      console.error("Error adding call note:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Unexpected error adding call note:", error);
    return null;
  }
};

/**
 * Fetch comments for a dossier
 */
export const fetchDossierComments = async (dossierId: string): Promise<DossierComment[]> => {
  try {
    const { data, error } = await supabase
      .from('dossier_commentaires')
      .select('*')
      .eq('dossier_id', dossierId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching comments for dossier ${dossierId}:`, error);
      return [];
    }
    
    return data.map((comment: any) => ({
      id: comment.id,
      dossierId: comment.dossier_id,
      userId: comment.user_id,
      userName: comment.user_name,
      userRole: comment.user_role,
      content: comment.content,
      createdAt: new Date(comment.created_at),
      isCallNote: comment.is_call_note || false,
      callDuration: comment.call_duration,
      isPublic: comment.is_public || false
    }));
  } catch (error) {
    console.error(`Unexpected error fetching comments for dossier ${dossierId}:`, error);
    return [];
  }
};
