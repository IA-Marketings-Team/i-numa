
export interface AuthLog {
  id: string;
  user_id: string;  // database column name
  userId?: string;  // client-side normalized property 
  action: string;
  timestamp: Date | string;
  userAgent?: string;
  ipAddress?: string;
  user_agent?: string;  // database column name
  ip_address?: string;  // database column name
}
