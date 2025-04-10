
import { useAuth } from "@/contexts/AuthContext";
import { navigationConfig } from "@/config/navigation";
import { filterMenuItemsByPermission } from "@/utils/accessControl";
import { useState, useEffect } from "react";

/**
 * Hook personnalisé pour gérer la navigation basée sur les rôles
 * @returns Les éléments de navigation filtrés selon le rôle de l'utilisateur
 */
export const useRoleBasedNavigation = () => {
  const { user } = useAuth();
  const [mainMenuItems, setMainMenuItems] = useState<any[]>([]);
  const [accountMenuItems, setAccountMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setMainMenuItems([]);
      setAccountMenuItems([]);
      return;
    }

    // Filtrer les éléments du menu principal
    const filteredMainItems = filterMenuItemsByPermission(
      navigationConfig.filter(item => 
        ['tableau-de-bord', 'dossiers', 'clients', 'mes-offres', 'agenda-global', 'agenda', 'taches', 'appels', 'communications', 'statistiques', 'consultations'].includes(item.id)
      ),
      user.role
    );

    // Filtrer les éléments du menu de compte
    const filteredAccountItems = filterMenuItemsByPermission(
      navigationConfig.filter(item => 
        ['profil', 'equipes'].includes(item.id)
      ),
      user.role
    );

    setMainMenuItems(filteredMainItems);
    setAccountMenuItems(filteredAccountItems);
  }, [user]);

  return {
    mainMenuItems,
    accountMenuItems
  };
};
