
export interface SecteurActivite {
  id: string;
  nom: string;
  description?: string;
  disponible?: boolean;
}

export interface OffreSection {
  id: string;
  titre: string;
  offreId: string;
  estOuvertParDefaut?: boolean;
  items: string[];
}

export interface Offre {
  id: string;
  nom: string;
  description: string;
  type: 'SEO' | 'Google Ads' | 'Email X' | 'Foner' | 'Devis' | 'E-réputation' | 'Deliver' | 'Facebook/Instagram Ads';
  prix?: number;
  prixMensuel?: string;
  fraisCreation?: string;
  secteurActivite?: string;
  secteurs?: SecteurActivite[];
  sections?: OffreSection[];
}

export interface OffreSecteur {
  id: string;
  offreId: string;
  secteurId: string;
  disponible: boolean;
}
