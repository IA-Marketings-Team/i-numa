
import { User, Dossier, UserRole } from "@/types";

/**
 * Masque les informations sensibles d'un dossier en fonction du rôle de l'utilisateur
 * @param dossier - Le dossier à transformer
 * @param userRole - Le rôle de l'utilisateur qui accède aux données
 * @returns Le dossier avec les informations sensibles masquées si nécessaire
 */
export const sanitizeDossierData = (dossier: Dossier, userRole: UserRole): Dossier => {
  const sanitizedDossier = { ...dossier };

  // Masquer les montants pour les rôles non autorisés
  if (!['responsable', 'superviseur'].includes(userRole)) {
    sanitizedDossier.montant = undefined;
  }

  // Masquer les notes internes pour les clients
  if (userRole === 'client') {
    sanitizedDossier.notes = undefined;
  }

  // Pour les agents visio, limiter certaines informations après signature
  if (userRole === 'agent_visio' && dossier.status === 'signe') {
    sanitizedDossier.notes = undefined;
    // Masquer d'autres informations sensibles si nécessaire
  }

  return sanitizedDossier;
};

/**
 * Masque les informations sensibles d'un utilisateur en fonction du rôle
 * @param userData - Les données utilisateur à transformer
 * @param viewerRole - Le rôle de l'utilisateur qui consulte les données
 * @returns Les données utilisateur avec les informations sensibles masquées si nécessaire
 */
export const sanitizeUserData = (userData: User, viewerRole: UserRole): Partial<User> => {
  // Créer une copie pour éviter de modifier l'original
  const sanitized: Partial<User> = { ...userData };

  // Les clients ne voient que des informations limitées sur les autres utilisateurs
  if (viewerRole === 'client') {
    // Garder uniquement les informations de base
    return {
      id: userData.id,
      nom: userData.nom,
      prenom: userData.prenom,
      role: userData.role
    };
  }

  // Les agents phoner et visio ne voient pas les informations bancaires
  if (['agent_phoner', 'agent_visio'].includes(viewerRole)) {
    delete sanitized.iban;
    delete sanitized.bic;
    delete sanitized.nomBanque;
  }

  // Si l'utilisateur est un superviseur ou responsable, il voit tout
  return sanitized;
};
