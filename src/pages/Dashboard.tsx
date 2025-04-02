
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDossier } from "@/contexts/DossierContext";
import { Dossier, UserRole } from "@/types";

import OverviewSection from "@/components/dashboard/OverviewSection";
import PerformanceSection from "@/components/dashboard/PerformanceSection";
import { hasPermission } from "@/utils/accessControl";

export default function Dashboard() {
  const { user } = useAuth();
  const { dossiers, isLoading } = useDossier();
  const [recentDossiers, setRecentDossiers] = useState<Dossier[]>([]);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);

  useEffect(() => {
    if (user) {
      setUserRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    if (dossiers && !isLoading) {
      // Trier par date de création et prendre les 5 plus récents
      const sorted = [...dossiers].sort((a, b) => {
        return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
      }).slice(0, 5);
      
      setRecentDossiers(sorted);
    }
  }, [dossiers, isLoading]);

  // Si l'utilisateur a le rôle 'client', rediriger vers une autre page
  if (userRole === 'client') {
    return <div>Redirection vers la page client...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      {/* Updating to match OverviewSection's expected props */}
      <OverviewSection />
      
      {/* La section Performance est uniquement visible pour les superviseurs et responsables */}
      {userRole && hasPermission(userRole, ['superviseur', 'responsable']) && (
        <PerformanceSection statistiques={[]} />
      )}
    </div>
  );
}
