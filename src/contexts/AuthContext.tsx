
import React, { createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";
import { useAuthState } from "@/hooks/useAuthState";
import { loginWithEmail, registerWithEmail, signOut, hasPermission as checkPermission } from "@/utils/authUtils";
import { createAuthLog } from "@/services/authLogService";

export interface AuthContextType {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  register: (userData: Partial<User>, password: string) => Promise<{ success: boolean; error: Error | null }>;
  logout: () => Promise<void>;
  hasPermission: (requiredRoles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    user,
    session,
    isAuthenticated,
    isLoading,
    setUser,
  } = useAuthState();

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error: Error | null }> => {
    try {
      const result = await loginWithEmail(email, password);
      if (result.success && user?.id) {
        // Log the login action
        await createAuthLog({
          userId: user.id,
          action: 'login',
          timestamp: new Date(),
          userAgent: navigator.userAgent,
        });
      }
      return result;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error as Error };
    }
  };

  // Register function
  const register = async (userData: Partial<User>, password: string): Promise<{ success: boolean; error: Error | null }> => {
    try {
      return await registerWithEmail(userData.email || '', password, userData);
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: error as Error };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    if (user?.id) {
      // Log the logout action
      try {
        await createAuthLog({
          userId: user.id,
          action: 'logout',
          timestamp: new Date(),
          userAgent: navigator.userAgent,
        });
      } catch (error) {
        console.error("Error logging logout:", error);
      }
    }
    
    await signOut();
    setUser(null);
  };

  // Check if user has permission
  const hasPermission = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    // Convert single role to array
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    return checkPermission(user, roles);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
