
import { Client, UserRole } from './user';
import { Offre } from './offre';

export type DossierStatus = 'prospect' | 'rdv_en_cours' | 'valide' | 'signe' | 'archive';

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
  heure?: string;
  honore: boolean;
  notes?: string;
  meetingLink?: string;
  location?: string;
  statut?: string;
  solutionProposee?: string;
}
