
export interface Appel {
  id: string;
  clientId: string;
  agentId: string;
  date: Date;
  duree: number;
  notes: string;
  statut: 'RDV' | 'Vente' | 'Répondeur' | 'Injoignable' | 'Refus argumentaire' | 'Refus intro' | 'Rappel' | 'Hors cible' | 'planifie' | 'effectue' | 'manque';
  entreprise?: string;
  gerant?: string;
  contact?: string;
  email?: string;
  codePostal?: string;
  dateRdv?: Date;
  heureRdv?: string;
}

export interface Meeting {
  id: string;
  titre: string;
  description: string;
  date: Date;
  duree: number;
  lien: string;
  type: 'visio' | 'presentiel' | 'telephonique';
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'effectue' | 'manque';
  participants: string[];
  heure?: string;
}

export interface Email {
  id: string;
  expediteurId: string;
  destinataireIds: string[];
  destinatairesCc?: string[];
  destinatairesBcc?: string[];
  sujet: string;
  contenu: string;
  dateEnvoi: Date;
  pieceJointes?: string[];
  lu: boolean;
  dossierLie?: string;
  clientLie?: string;
}
