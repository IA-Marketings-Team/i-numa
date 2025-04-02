
import { supabase } from "@/integrations/supabase/client";

export interface Email {
  id: string;
  expediteurId: string;
  destinataireIds: string[];
  destinatairesCc?: string[];
  destinatairesBcc?: string[];
  sujet: string;
  contenu: string;
  dateEnvoi: Date;
  pieceJointes?: string[]; // URLs des pièces jointes
  lu: boolean;
  dossierLie?: string; // ID du dossier lié
  clientLie?: string; // ID du client lié
}

/**
 * Récupère tous les emails depuis Supabase
 */
export const fetchEmails = async (): Promise<Email[]> => {
  try {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .order('date_envoi', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des emails:", error);
      return [];
    }

    return data.map(email => ({
      id: email.id,
      expediteurId: email.expediteur_id,
      destinataireIds: email.destinataire_ids || [],
      destinatairesCc: email.destinataires_cc || [],
      destinatairesBcc: email.destinataires_bcc || [],
      sujet: email.sujet || '',
      contenu: email.contenu || '',
      dateEnvoi: new Date(email.date_envoi),
      pieceJointes: email.piece_jointes || [],
      lu: email.lu || false,
      dossierLie: email.dossier_lie,
      clientLie: email.client_lie
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des emails:", error);
    return [];
  }
};

/**
 * Récupère les emails envoyés par un utilisateur spécifique
 */
export const fetchEmailsByExpediteur = async (expediteurId: string): Promise<Email[]> => {
  try {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('expediteur_id', expediteurId)
      .order('date_envoi', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des emails pour l'expéditeur ${expediteurId}:`, error);
      return [];
    }

    return data.map(email => ({
      id: email.id,
      expediteurId: email.expediteur_id,
      destinataireIds: email.destinataire_ids || [],
      destinatairesCc: email.destinataires_cc || [],
      destinatairesBcc: email.destinataires_bcc || [],
      sujet: email.sujet || '',
      contenu: email.contenu || '',
      dateEnvoi: new Date(email.date_envoi),
      pieceJointes: email.piece_jointes || [],
      lu: email.lu || false,
      dossierLie: email.dossier_lie,
      clientLie: email.client_lie
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des emails pour l'expéditeur ${expediteurId}:`, error);
    return [];
  }
};

/**
 * Récupère les emails reçus par un utilisateur spécifique
 */
export const fetchEmailsByDestinataire = async (destinataireId: string): Promise<Email[]> => {
  try {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .contains('destinataire_ids', [destinataireId])
      .order('date_envoi', { ascending: false });

    if (error) {
      console.error(`Erreur lors de la récupération des emails pour le destinataire ${destinataireId}:`, error);
      return [];
    }

    return data.map(email => ({
      id: email.id,
      expediteurId: email.expediteur_id,
      destinataireIds: email.destinataire_ids || [],
      destinatairesCc: email.destinataires_cc || [],
      destinatairesBcc: email.destinataires_bcc || [],
      sujet: email.sujet || '',
      contenu: email.contenu || '',
      dateEnvoi: new Date(email.date_envoi),
      pieceJointes: email.piece_jointes || [],
      lu: email.lu || false,
      dossierLie: email.dossier_lie,
      clientLie: email.client_lie
    }));
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération des emails pour le destinataire ${destinataireId}:`, error);
    return [];
  }
};

/**
 * Récupère un email par son ID
 */
export const fetchEmailById = async (id: string): Promise<Email | null> => {
  try {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'email ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      expediteurId: data.expediteur_id,
      destinataireIds: data.destinataire_ids || [],
      destinatairesCc: data.destinataires_cc || [],
      destinatairesBcc: data.destinataires_bcc || [],
      sujet: data.sujet || '',
      contenu: data.contenu || '',
      dateEnvoi: new Date(data.date_envoi),
      pieceJointes: data.piece_jointes || [],
      lu: data.lu || false,
      dossierLie: data.dossier_lie,
      clientLie: data.client_lie
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de l'email ${id}:`, error);
    return null;
  }
};

/**
 * Crée un nouvel email
 */
export const createEmail = async (email: Omit<Email, "id">): Promise<Email | null> => {
  try {
    const { data, error } = await supabase
      .from('emails')
      .insert({
        expediteur_id: email.expediteurId,
        destinataire_ids: email.destinataireIds,
        destinataires_cc: email.destinatairesCc || [],
        destinataires_bcc: email.destinatairesBcc || [],
        sujet: email.sujet,
        contenu: email.contenu,
        date_envoi: email.dateEnvoi.toISOString(),
        piece_jointes: email.pieceJointes || [],
        lu: email.lu || false,
        dossier_lie: email.dossierLie,
        client_lie: email.clientLie
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de l'email:", error);
      return null;
    }

    return {
      id: data.id,
      expediteurId: data.expediteur_id,
      destinataireIds: data.destinataire_ids || [],
      destinatairesCc: data.destinataires_cc || [],
      destinatairesBcc: data.destinataires_bcc || [],
      sujet: data.sujet || '',
      contenu: data.contenu || '',
      dateEnvoi: new Date(data.date_envoi),
      pieceJointes: data.piece_jointes || [],
      lu: data.lu || false,
      dossierLie: data.dossier_lie,
      clientLie: data.client_lie
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création de l'email:", error);
    return null;
  }
};

/**
 * Met à jour un email existant
 */
export const updateEmail = async (id: string, updates: Partial<Email>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.expediteurId !== undefined) updateData.expediteur_id = updates.expediteurId;
    if (updates.destinataireIds !== undefined) updateData.destinataire_ids = updates.destinataireIds;
    if (updates.destinatairesCc !== undefined) updateData.destinataires_cc = updates.destinatairesCc;
    if (updates.destinatairesBcc !== undefined) updateData.destinataires_bcc = updates.destinatairesBcc;
    if (updates.sujet !== undefined) updateData.sujet = updates.sujet;
    if (updates.contenu !== undefined) updateData.contenu = updates.contenu;
    if (updates.dateEnvoi !== undefined) updateData.date_envoi = updates.dateEnvoi.toISOString();
    if (updates.pieceJointes !== undefined) updateData.piece_jointes = updates.pieceJointes;
    if (updates.lu !== undefined) updateData.lu = updates.lu;
    if (updates.dossierLie !== undefined) updateData.dossier_lie = updates.dossierLie;
    if (updates.clientLie !== undefined) updateData.client_lie = updates.clientLie;
    
    const { error } = await supabase
      .from('emails')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de l'email ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour de l'email ${id}:`, error);
    return false;
  }
};

/**
 * Supprime un email
 */
export const deleteEmail = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('emails')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression de l'email ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression de l'email ${id}:`, error);
    return false;
  }
};

/**
 * Marquer un email comme lu
 */
export const markEmailAsRead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('emails')
      .update({ lu: true })
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors du marquage de l'email ${id} comme lu:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors du marquage de l'email ${id} comme lu:`, error);
    return false;
  }
};

/**
 * Marquer un email comme non lu
 */
export const markEmailAsUnread = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('emails')
      .update({ lu: false })
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors du marquage de l'email ${id} comme non lu:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors du marquage de l'email ${id} comme non lu:`, error);
    return false;
  }
};
