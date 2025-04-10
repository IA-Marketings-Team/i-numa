
import { Client, UserRole } from './user';
import { Offre } from './offre';

export type DossierStatus = 
  | 'prospect_chaud' 
  | 'prospect_froid' 
  | 'rdv_en_cours'
  | 'rdv_honore' 
  | 'rdv_non_honore' 
  | 'valide' 
  | 'signe' 
  | 'archive';

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
  commentaires?: DossierComment[];
}

export interface DossierComment {
  id: string;
  dossierId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: Date;
  isCallNote?: boolean;
  callDuration?: number;
}

export interface RendezVous {
  id: string;
  dossierId: string;
  dossier: Dossier;
  date: Date;
  heure?: string;
  honore: boolean;
  notes?: string;
  meetingLink?: string;
  location?: string;
  statut?: string;
  solutionProposee?: string;
}

export interface DossierConsultation {
  id: string;
  dossierId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  timestamp: Date;
}
