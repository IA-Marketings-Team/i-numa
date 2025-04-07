
import { User, UserRole } from './user';

export interface AgentStatistics {
  appelsEmis: number;
  appelsDecroches: number;
  appelsTransformes: number;
  rendezVousHonores: number;
  rendezVousNonHonores: number;
  dossiersValides: number;
  dossiersSigne: number;
}

export interface Agent extends User {
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
  equipeId?: string;
  iban?: string;
  bic?: string;
  nomBanque?: string;
  statistiques: AgentStatistics;
}
