
export type UserRole = 'client' | 'agent_phoner' | 'agent_visio' | 'agent_developpeur' | 'agent_marketing' | 'superviseur' | 'responsable';

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
