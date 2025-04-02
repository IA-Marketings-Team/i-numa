
export interface AuthLog {
  id?: string;
  userId: string;
  action: 'login' | 'logout';
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}
