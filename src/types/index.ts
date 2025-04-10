// Reuse existing types for offers and secteurs
export interface OffreSectionItem {
  id: string;
  titre: string;
}

export interface OffreSection {
  id: string;
  offreId: string;
  titre: string;
  items: string[];
  estOuvertParDefaut: boolean;
}

export interface SecteurActivite {
  id: string;
  nom: string;
  description: string;
  disponible?: boolean;
}

export interface Offre {
  id: string;
  nom: string;
  description: string;
  type: 'SEO' | 'Google Ads' | 'Facebook/Instagram Ads' | 'E-réputation' | 'Deliver' | 'Email X' | 'Foner' | 'Devis' | string;
  prix?: number;
  prixMensuel?: string;
  fraisCreation?: string;
  sections?: OffreSection[];
  secteurs?: SecteurActivite[];
  secteurActivite?: string; // Comma-separated list of sector IDs
}

// Add or update the DossierConsultation type
export interface DossierConsultation {
  id: string;
  userId: string;
  userName: string;
  userRole: string; // Changed from UserRole to string to match the actual data
  dossierId: string;
  timestamp: Date;
  action?: string; // Added to fix the error in ConsultationsPage
}

// Import and re-export all types from separate files
export * from './user';
export * from './task';
export * from './dossier';
export * from './agenda';
export * from './auth';
export * from './communication';
export * from './marketplace';
export * from './offre';
export * from './statistique';
export * from './agent';
export * from './team';

// Add any missing types that are used but not defined in separate files

export interface OfferCategory {
  icon: any; // ElementType from React
  label: string;
  description: string;
  offerings: {
    title: string;
    price: string;
    setupFee?: string;
    features: {
      title: string;
      items: string[];
    }[];
  }[];
}
