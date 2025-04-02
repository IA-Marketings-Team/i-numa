
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  register: (userData: Partial<User>, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    setUser, 
    setIsAuthenticated
  } = useAuthState();
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Unexpected login error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email!,
        password,
        options: {
          data: {
            nom: userData.nom,
            prenom: userData.prenom,
            role: userData.role || "client"
          }
        }
      });

      if (error) {
        console.error("Registration error:", error.message);
        return { success: false, error: error.message };
      }

      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account.",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Unexpected registration error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page after logout
      navigate("/login");
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "An error occurred during logout.",
        variant: "destructive"
      });
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return false;

    try {
      // Maps JavaScript camelCase properties to Supabase snake_case column names
      const mappedUpdates: Record<string, any> = {};
      
      if (updates.nom !== undefined) mappedUpdates.nom = updates.nom;
      if (updates.prenom !== undefined) mappedUpdates.prenom = updates.prenom;
      if (updates.telephone !== undefined) mappedUpdates.telephone = updates.telephone;
      if (updates.adresse !== undefined) mappedUpdates.adresse = updates.adresse;
      if (updates.ville !== undefined) mappedUpdates.ville = updates.ville;
      if (updates.codePostal !== undefined) mappedUpdates.code_postal = updates.codePostal;
      if (updates.iban !== undefined) mappedUpdates.iban = updates.iban;
      if (updates.bic !== undefined) mappedUpdates.bic = updates.bic;
      if (updates.nomBanque !== undefined) mappedUpdates.nom_banque = updates.nomBanque;
      
      const { error } = await supabase
        .from('profiles')
        .update(mappedUpdates)
        .eq('id', user.id);
      
      if (error) {
        console.error("Error updating user:", error);
        return false;
      }
      
      // Update local user state with changes
      setUser({ ...user, ...updates });
      
      return true;
    } catch (error) {
      console.error("Unexpected error updating user:", error);
      return false;
    }
  };

  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    
    // Responsable has access to everything
    if (user.role === "responsable") return true;
    
    return requiredRoles.includes(user.role);
  };

  // Value to be provided by the context
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
