
import { useState } from "react";
import { User } from "@/types";
import { Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);

  return {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    session,
    setSession,
  };
};
