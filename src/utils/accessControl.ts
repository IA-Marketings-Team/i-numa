
import { UserRole, DossierStatus } from "@/types";

/**
 * Check if a user can access a specific dossier status based on their role
 */
export const canAccessDossierType = (userRole?: UserRole, status?: string): boolean => {
  if (!userRole || !status || status === 'all') return true;
  
  // Admin roles can access everything
  if (userRole === 'superviseur' || userRole === 'responsable') {
    return true;
  }
  
  switch (userRole) {
    case 'agent_phoner':
      // Phoners can only manage prospects and appointments
      return ['prospect_chaud', 'prospect_froid', 'rdv_honore', 'rdv_non_honore'].includes(status as DossierStatus);
      
    case 'agent_visio':
      // Visio agents can only manage appointments and validated dossiers
      return ['rdv_honore', 'rdv_non_honore', 'valide'].includes(status as DossierStatus);
      
    case 'client':
      // Clients can only view their own dossiers
      return ['valide', 'signe'].includes(status as DossierStatus);
      
    default:
      return false;
  }
};

/**
 * Check if a user can perform an action on a dossier based on their role
 */
export const canPerformDossierAction = (
  userRole?: UserRole, 
  action?: 'view' | 'edit' | 'delete' | 'add' | 'validate' | 'sign'
): boolean => {
  if (!userRole || !action) return false;
  
  // Admin roles can do everything
  if (userRole === 'superviseur' || userRole === 'responsable') {
    return true;
  }
  
  switch (userRole) {
    case 'agent_phoner':
      // Phoners can view, edit their assigned dossiers, and create new ones
      return ['view', 'edit', 'add'].includes(action);
      
    case 'agent_visio':
      // Visio agents can view, edit, and validate dossiers
      return ['view', 'edit', 'validate'].includes(action);
      
    case 'client':
      // Clients can only view and sign their dossiers
      return ['view', 'sign'].includes(action);
      
    default:
      return false;
  }
};

export default {
  canAccessDossierType,
  canPerformDossierAction
};
