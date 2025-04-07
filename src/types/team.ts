
export interface Team {
  id: string;
  nom: string;
  fonction: 'phoning' | 'visio' | 'developpement' | 'marketing' | 'mixte';
  description?: string;
  dateCreation: Date;
}
