export type UserRole = 'client' | 'agent_phoner' | 'agent_visio' | 'agent_developpeur' | 'agent_marketing' | 'superviseur' | 'responsable';

export type DossierStatus = 'prospect' | 'rdv_en_cours' | 'valide' | 'signe' | 'archive';

export type TaskStatus = 'to_do' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

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
  equipeId?: string;
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
  type: 'SEO' | 'Google Ads' | 'Email X' | 'Foner' | 'Devis' | 'E-réputation' | 'Deliver' | 'Facebook/Instagram Ads';
  prix?: number;
  prixMensuel?: string;
  fraisCreation?: string;
  secteurs?: SecteurActivite[];
  sections?: OffreSection[];
}

export interface SecteurActivite {
  id: string;
  nom: string;
  description?: string;
  disponible?: boolean;
}

export interface OffreSecteur {
  id: string;
  offreId: string;
  secteurId: string;
  disponible: boolean;
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
  montant?: number;
}

export interface RendezVous {
  id: string;
  dossierId: string;
  dossier: Dossier;
  date: Date;
  honore: boolean;
  notes?: string;
  meetingLink?: string;
  location?: string;
}

export interface Statistique {
  id?: string;
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
  chiffreAffaires?: number;
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

export interface Team {
  id: string;
  nom: string;
  fonction: 'phoning' | 'visio' | 'developpement' | 'marketing' | 'mixte';
  description?: string;
  dateCreation: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  agentId: string;
  status: TaskStatus;
  dateCreation: Date;
  dateEcheance?: Date;
  priority: TaskPriority;
}

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
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule';
  participants: string[];
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

export interface OffreSection {
  id: string;
  titre: string;
  offreId: string;
  estOuvertParDefaut?: boolean;
  items: string[];
}
