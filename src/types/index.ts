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
  type: 'SEO' | 'Google Ads' | 'Facebook/Instagram Ads' | 'E-réputation' | 'Deliver' | string;
  prix?: number;
  prixMensuel?: string;
  fraisCreation?: string;
  sections?: OffreSection[];
  secteurs?: SecteurActivite[];
  secteurActivite?: string; // Comma-separated list of sector IDs
}
