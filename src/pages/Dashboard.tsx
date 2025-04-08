
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDossier } from "@/contexts/DossierContext";
import { useStatistique } from "@/contexts/StatistiqueContext";
import { Dossier, UserRole, Statistique } from "@/types";
import RoleBasedDashboard from "@/components/dashboard/RoleBasedDashboard";
import { Navigate } from "react-router-dom";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const { dossiers, isLoading } = useDossier();
  const { statistiques, getStatistiquesByPeriodeType } = useStatistique();
  const [recentDossiers, setRecentDossiers] = useState<Dossier[]>([]);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [stats, setStats] = useState<Statistique[]>([]);

  useEffect(() => {
    if (user) {
      setUserRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Charger les statistiques pertinentes pour le tableau de bord
        const monthlyStats = await getStatistiquesByPeriodeType("mois");
        const weeklyStats = await getStatistiquesByPeriodeType("semaine");
        const dailyStats = await getStatistiquesByPeriodeType("jour");
        
        // Combiner toutes les statistiques
        setStats([...dailyStats, ...weeklyStats, ...monthlyStats]);
      } catch (error) {
        console.error("Error loading statistics:", error);
        setStats([]);
      }
    };
    
    loadStats();
  }, [getStatistiquesByPeriodeType]);

  useEffect(() => {
    if (dossiers && !isLoading) {
      // Trier par date de création et prendre les 5 plus récents
      const sorted = [...dossiers].sort((a, b) => {
        return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
      }).slice(0, 5);
      
      setRecentDossiers(sorted);
    }
  }, [dossiers, isLoading]);

  return (
    <OnboardingProvider>
      <div className="p-4 space-y-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        
        <RoleBasedDashboard 
          userRole={userRole}
          recentDossiers={recentDossiers}
          statistics={stats}
          isLoading={isLoading}
        />
      </div>
    </OnboardingProvider>
  );
}
