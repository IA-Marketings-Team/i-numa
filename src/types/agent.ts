
import { UserRole } from './user';

export interface AgentStats {
  appointmentsMade: number;
  appointmentsCompleted: number;
  conversionRate: number;
  averageDuration: number;
  clientSatisfaction: number;
}

// Define the statistics structure that's actually used in the code
export interface AgentStatistiques {
  appelsEmis: number;
  appelsDecroches: number;
  appelsTransformes: number;
  rendezVousHonores: number;
  rendezVousNonHonores: number;
  dossiersValides: number;
  dossiersSigne: number;
}

export interface Agent {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  dateCreation: Date;
  stats?: AgentStats;
  statistiques?: AgentStatistiques;  // Add the statistiques property
  adresse?: string;
  ville?: string;
  codePostal?: string;
  equipeId?: string;
}
