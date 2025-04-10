
import { UserRole } from "@/types";

/**
 * Vérifie si un utilisateur a les permissions nécessaires en fonction de son rôle
 * @param userRole - Le rôle de l'utilisateur actuel
 * @param requiredRoles - Les rôles autorisés pour accéder à la ressource
 * @returns true si l'utilisateur a accès, false sinon
 */
export const hasPermission = (userRole: UserRole | undefined, requiredRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  
  // Le responsable a accès à tout
  if (userRole === 'responsable') return true;
  
  // Vérifier si le rôle de l'utilisateur est dans la liste des rôles requis
  return requiredRoles.includes(userRole);
};

/**
 * Obtient la route de redirection par défaut pour un rôle spécifique
 * @param role - Le rôle de l'utilisateur
 * @returns Le chemin de redirection par défaut
 */
export const getDefaultRouteForRole = (role: UserRole): string => {
  switch (role) {
    case 'client':
      return '/mes-offres';
    case 'agent_phoner':
    case 'agent_visio':
    case 'superviseur':
    case 'responsable':
      return '/tableau-de-bord';
    default:
      return '/connexion';
  }
};

/**
 * Filtre les options de menu en fonction du rôle utilisateur
 * @param items - Les éléments de menu à filtrer
 * @param userRole - Le rôle de l'utilisateur
 * @returns Les éléments de menu filtrés selon les permissions
 */
export const filterMenuItemsByPermission = (items: any[], userRole: UserRole | undefined): any[] => {
  if (!userRole) return [];
  
  return items.filter(item => {
    if (!item.permissions) return true;
    return hasPermission(userRole, item.permissions);
  });
};

/**
 * Filtre les dossiers en fonction du rôle de l'utilisateur
 * @param userRole - Le rôle de l'utilisateur
 * @param userId - L'identifiant de l'utilisateur
 * @returns Un objet contenant les filtres à appliquer
 */
export const getDossierFiltersForRole = (userRole: UserRole | undefined, userId: string | undefined): { 
  statusFilter: string[], 
  agentFilter?: { field: string, value: string } 
} => {
  // Par défaut, aucun filtre spécifique
  const defaultFilter = {
    statusFilter: []
  };
  
  if (!userRole || !userId) return defaultFilter;
  
  switch (userRole) {
    case 'agent_phoner':
      // Les agents phoner ne voient que les prospects et leurs dossiers
      return {
        statusFilter: ['prospect_chaud', 'prospect_froid'],
        agentFilter: { field: 'agentPhonerId', value: userId }
      };
    
    case 'agent_visio':
      // Les agents visio ne voient que les RDV et leurs dossiers
      return {
        statusFilter: ['rdv_honore', 'rdv_non_honore'],
        agentFilter: { field: 'agentVisioId', value: userId }
      };
      
    case 'superviseur':
      // Les superviseurs voient tous les statuts mais pas les dossiers archivés
      return {
        statusFilter: ['prospect_chaud', 'prospect_froid', 'rdv_honore', 'rdv_non_honore', 'valide', 'signe']
      };
      
    case 'responsable':
      // Les responsables voient tout
      return {
        statusFilter: []
      };
      
    case 'client':
      // Les clients ne voient que leurs dossiers
      return {
        statusFilter: [],
        agentFilter: { field: 'clientId', value: userId }
      };
      
    default:
      return defaultFilter;
  }
};
