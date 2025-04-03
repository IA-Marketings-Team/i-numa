
// Si ce fichier n'existe pas déjà, nous ajoutons la définition de l'interface AuthLog

export interface AuthLog {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}
