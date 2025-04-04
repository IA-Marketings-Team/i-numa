
import React from "react";
import { UserRole } from "@/types";
import ClientDashboard from "./ClientDashboard";
import AgentPhonerDashboard from "./AgentPhonerDashboard";
import AgentVisioDashboard from "./AgentVisioDashboard";
import SuperviseurDashboard from "./SuperviseurDashboard";
import ResponsableDashboard from "./ResponsableDashboard";
import { Statistique } from "@/types";

interface RoleBasedDashboardProps {
  userRole: UserRole | undefined;
  recentDossiers: any[];
  statistics: Statistique[];
  isLoading: boolean;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({
  userRole,
  recentDossiers,
  statistics,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Chargement du tableau de bord...</p>
      </div>
    );
  }

  // Sélectionner le tableau de bord en fonction du rôle
  switch (userRole) {
    case "client":
      return <ClientDashboard />;
    
    case "agent_phoner":
      return <AgentPhonerDashboard recentDossiers={recentDossiers} statistics={statistics} />;
    
    case "agent_visio":
      return <AgentVisioDashboard recentDossiers={recentDossiers} statistics={statistics} />;
    
    case "agent_developpeur":
    case "agent_marketing":
      // Utilisez le même tableau de bord pour les agents développeurs et marketing
      return <AgentPhonerDashboard recentDossiers={recentDossiers} statistics={statistics} />;
    
    case "superviseur":
      return <SuperviseurDashboard recentDossiers={recentDossiers} statistics={statistics} />;
    
    case "responsable":
      return <ResponsableDashboard recentDossiers={recentDossiers} statistics={statistics} />;
    
    default:
      return (
        <div className="text-center p-8">
          <p className="text-red-500">Rôle non reconnu ou non défini.</p>
        </div>
      );
  }
};

export default RoleBasedDashboard;
