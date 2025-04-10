
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
        ['tableau-de-bord', 'dossiers', 'clients', 'mes-offres', 'agenda-global', 
         'agenda', 'taches', 'appels', 'communications', 'statistiques', 'dossiers-consultations'].includes(item.id)
      ),
      user.role
    );

    // Pour les agents, filtrer encore plus les éléments
    let finalMainItems = filteredMainItems;
    
    if (user.role === 'agent_phoner' || user.role === 'agent_visio') {
      // Limiter l'accès aux dossiers selon le type d'agent
      finalMainItems = finalMainItems.map(item => {
        if (item.id === 'dossiers') {
          // Modifier le libellé pour indiquer les restrictions
          return {
            ...item,
            title: user.role === 'agent_phoner' ? 'Prospects' : 'Rendez-vous'
          };
        }
        return item;
      });
    }

    // Filtrer les éléments du menu de compte
    const filteredAccountItems = filterMenuItemsByPermission(
      navigationConfig.filter(item => 
        ['profil', 'equipes'].includes(item.id)
      ),
      user.role
    );

    setMainMenuItems(finalMainItems);
    setAccountMenuItems(filteredAccountItems);
  }, [user]);

  return {
    mainMenuItems,
    accountMenuItems
  };
};
