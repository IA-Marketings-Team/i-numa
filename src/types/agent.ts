
import { UserRole } from './user';

export interface AgentStats {
  appointmentsMade: number;
  appointmentsCompleted: number;
  conversionRate: number;
  averageDuration: number;
  clientSatisfaction: number;
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
  adresse?: string;
  ville?: string;
  codePostal?: string;
  equipeId?: string;
}
