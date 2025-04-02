
export type TaskStatus = 'to_do' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

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

export interface Team {
  id: string;
  nom: string;
  fonction: 'phoning' | 'visio' | 'developpement' | 'marketing' | 'mixte';
  description?: string;
  dateCreation: Date;
}
