
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

/**
 * Enregistre une consultation de dossier
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
      .rpc('record_dossier_consultation', {
        p_dossier_id: dossierId,
        p_user_id: userId,
        p_user_name: userName,
        p_user_role: userRole,
        p_action: action
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
