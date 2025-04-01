
import { User, UserRole } from "@/types";
import { useLoginMethod } from "./useLoginMethod";
import { useLogoutMethod } from "./useLogoutMethod";
import { usePermissions } from "./usePermissions";

export const useAuthMethods = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setSession: (session: any) => void
) => {
  // Use the extracted login method
  const { login } = useLoginMethod(setUser, setIsAuthenticated, setSession);
  
  // Use the extracted logout method
  const { logout } = useLogoutMethod(setUser, setIsAuthenticated, setSession);
  
  // Use the extracted permission handler
  const { hasPermission } = usePermissions(user);

  return { login, logout, hasPermission };
};
