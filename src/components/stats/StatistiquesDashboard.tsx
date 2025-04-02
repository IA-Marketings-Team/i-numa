
import React, { useEffect, useState } from "react";
import { Statistique } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAgentById } from "@/services/agentService";

interface StatistiquesDashboardProps {
  statistiques: Statistique[];
  periode: "jour" | "semaine" | "mois";
  showMonetaryStats?: boolean;
}

const StatistiquesDashboard: React.FC<StatistiquesDashboardProps> = ({
  statistiques,
  periode,
  showMonetaryStats = false
}) => {
  const [periodStats, setPeriodStats] = useState<Statistique | null>(null);
  const [agent, setAgent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trouver la statistique la plus récente pour cette période
    if (statistiques && statistiques.length > 0) {
      const latestStat = statistiques.reduce((prev, current) => {
        return new Date(prev.dateFin) > new Date(current.dateFin) ? prev : current;
      }, statistiques[0]);
      setPeriodStats(latestStat);
    } else {
      setPeriodStats(null);
    }
  }, [statistiques]);

  useEffect(() => {
    const loadAgentData = async () => {
      if (!periodStats) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const agentData = await fetchAgentById("agent1"); // Exemple d'ID
        setAgent(agentData);
      } catch (error) {
        console.error("Erreur lors du chargement des données de l'agent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentData();
  }, [periodStats]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Chargement des statistiques {getPeriodeLabel(periode)}...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!periodStats) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Aucune statistique {getPeriodeLabel(periode)} disponible
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Statistiques {getPeriodeLabel(periode)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <StatsItem
            label="Appels émis"
            value={periodStats.appelsEmis}
          />
          <StatsItem
            label="Appels décrochés"
            value={periodStats.appelsDecroches}
          />
          <StatsItem
            label="Appels transformés"
            value={periodStats.appelsTransformes}
          />
          <StatsItem
            label="Rendez-vous honorés"
            value={periodStats.rendezVousHonores}
          />
          <StatsItem
            label="Dossiers validés"
            value={periodStats.dossiersValides}
          />
          {showMonetaryStats && periodStats.chiffreAffaires !== undefined && (
            <StatsItem
              label="Chiffre d'affaires"
              value={`${periodStats.chiffreAffaires.toLocaleString()} €`}
              isMonetary
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface StatsItemProps {
  label: string;
  value: number | string;
  isMonetary?: boolean;
}

const StatsItem: React.FC<StatsItemProps> = ({ label, value, isMonetary = false }) => {
  return (
    <div className="flex items-center">
      <div className="text-sm font-medium flex-1">{label}</div>
      <div className={`text-sm font-medium ${isMonetary ? "text-green-600" : ""}`}>
        {value}
      </div>
    </div>
  );
};

const getPeriodeLabel = (periode: "jour" | "semaine" | "mois"): string => {
  switch (periode) {
    case "jour":
      return "journalières";
    case "semaine":
      return "hebdomadaires";
    case "mois":
      return "mensuelles";
    default:
      return "";
  }
};

export default StatistiquesDashboard;
