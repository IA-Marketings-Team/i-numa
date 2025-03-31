export type UserRole = 'client' | 'agent_phoner' | 'agent_visio' | 'superviseur' | 'responsable';

export type DossierStatus = 'prospect' | 'rdv_en_cours' | 'valide' | 'signe' | 'archive';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  dateCreation: Date;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  iban?: string;
  bic?: string;
  nomBanque?: string;
}

export interface Client extends User {
  adresse: string;
  iban?: string;
  secteurActivite: string;
  typeEntreprise: string;
  besoins: string;
}

export interface Agent extends User {
  statistiques: {
    appelsEmis: number;
    appelsDecroches: number;
    appelsTransformes: number;
    rendezVousHonores: number;
    rendezVousNonHonores: number;
    dossiersValides: number;
    dossiersSigne: number;
  };
}

export interface Offre {
  id: string;
  nom: string;
  description: string;
  type: 'SEO' | 'Google Ads' | 'Email X' | 'Foner' | 'Devis';
  prix?: number; // Accessible uniquement aux superviseurs et responsables
}

export interface Dossier {
  id: string;
  clientId: string;
  client: Client;
  agentPhonerId?: string;
  agentVisioId?: string;
  status: DossierStatus;
  offres: Offre[];
  dateCreation: Date;
  dateMiseAJour: Date;
  dateRdv?: Date;
  dateValidation?: Date;
  dateSignature?: Date;
  dateArchivage?: Date;
  notes?: string;
  montant?: number; // Accessible uniquement aux superviseurs et responsables
}

export interface RendezVous {
  id: string;
  dossierId: string;
  dossier: Dossier;
  date: Date;
  honore: boolean;
  notes?: string;
  meetingLink?: string; // Lien vers la réunion (Google Meet, Zoom, etc.)
  location?: string; // Emplacement physique ou virtuel
}

export interface Statistique {
  periode: 'jour' | 'semaine' | 'mois';
  dateDebut: Date;
  dateFin: Date;
  appelsEmis: number;
  appelsDecroches: number;
  appelsTransformes: number;
  rendezVousHonores: number;
  rendezVousNonHonores: number;
  dossiersValides: number;
  dossiersSigne: number;
  chiffreAffaires?: number; // Accessible uniquement aux superviseurs et responsables
}

export interface OfferCategory {
  icon: React.ElementType;
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

export interface CartItem {
  id: string;
  category: string;
  title: string;
  price: string;
  setupFee?: string;
  quantity: number;
}
