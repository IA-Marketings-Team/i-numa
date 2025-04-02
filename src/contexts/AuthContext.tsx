
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/types";
import { createAuthLog } from "@/services/authLogService";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  userDetails: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        setUser(session?.user ?? null);

        // Log login and logout events
        if (event === 'SIGNED_IN' && session?.user) {
          logAuthAction(session.user.id, 'login');
        } else if (event === 'SIGNED_OUT') {
          // User ID might not be available here, but it's handled in the logout function
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        fetchUserDetails(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user details from profiles table
  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error);
        return;
      }

      setUserDetails(data);
    } catch (error) {
      console.error("Unexpected error fetching user details:", error);
    }
  };

  const logAuthAction = async (userId: string, action: 'login' | 'logout') => {
    try {
      // Create auth log entry
      await createAuthLog({
        userId,
        action,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        // IP address would need to be captured from server-side
      });
    } catch (error) {
      console.error(`Error logging ${action} action:`, error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        console.error("Login error:", error);
      } else if (data.user) {
        fetchUserDetails(data.user.id);
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Unexpected login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: UserRole) => {
    try {
      setError(null);
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        console.error("Signup error:", error);
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Unexpected signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Log the logout action before signing out
      if (user) {
        await logAuthAction(user.id, 'logout');
      }
      
      setError(null);
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        console.error("Logout error:", error);
      }
      setUser(null);
      setSession(null);
      setUserDetails(null);
    } catch (error: any) {
      setError(error.message);
      console.error("Unexpected logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        login,
        signup,
        logout,
        error,
        userDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
