import { Notification } from "@/components/notifications/NotificationsList";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère toutes les notifications d'un utilisateur
 */
export const fetchNotifications = async (userId?: string): Promise<Notification[]> => {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      return [];
    }

    return data.map(notif => ({
      id: notif.id,
      title: notif.title,
      description: notif.description,
      time: notif.time,
      read: notif.read,
      type: convertNotificationType(notif.type),
      link: notif.link,
      action: notif.action
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des notifications:", error);
    return [];
  }
};

/**
 * Récupère les notifications non lues d'un utilisateur
 */
export const fetchUnreadNotifications = async (userId?: string): Promise<Notification[]> => {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('read', false)
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des notifications non lues:", error);
      return [];
    }

    return data.map(notif => ({
      id: notif.id,
      title: notif.title,
      description: notif.description,
      time: notif.time,
      read: notif.read,
      type: convertNotificationType(notif.type),
      link: notif.link,
      action: notif.action
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des notifications non lues:", error);
    return [];
  }
};

/**
 * Crée une nouvelle notification
 */
export const createNotification = async (notification: Omit<Notification, 'id' | 'read'>, userId?: string): Promise<Notification | null> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        title: notification.title,
        description: notification.description,
        time: notification.time || "À l'instant",
        read: false,
        type: notification.type,
        link: notification.link,
        action: notification.action,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la notification:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      time: data.time,
      read: data.read,
      type: convertNotificationType(data.type),
      link: data.link,
      action: data.action
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création de la notification:", error);
    return null;
  }
};

/**
 * Marque une notification comme lue
 */
export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors du marquage de la notification ${id} comme lue:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors du marquage de la notification ${id} comme lue:`, error);
    return false;
  }
};

/**
 * Marque toutes les notifications comme lues
 */
export const markAllNotificationsAsRead = async (userId?: string): Promise<boolean> => {
  try {
    let query = supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);
    
    if (userId) {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    }
    
    const { error } = await query;

    if (error) {
      console.error("Erreur lors du marquage de toutes les notifications comme lues:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur inattendue lors du marquage de toutes les notifications comme lues:", error);
    return false;
  }
};

/**
 * Supprime une notification
 */
export const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression de la notification ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression de la notification ${id}:`, error);
    return false;
  }
};

// Fonction auxiliaire pour convertir le type de notification
const convertNotificationType = (type: string): "success" | "info" | "warning" => {
  if (type === "success" || type === "info" || type === "warning") {
    return type;
  }
  // Valeur par défaut si le type n'est pas reconnu
  return "info";
};
