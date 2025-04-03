
export interface AuthLog {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
  user_id?: string; // For compatibility with DB column names
}
