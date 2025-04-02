
import React, { useEffect, useState } from "react";
import { Statistique } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAgentById } from "@/services/agentService";
import { useToast } from "@/hooks/use-toast";

export interface StatistiquesDashboardProps {
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
  const { toast } = useToast();

  useEffect(() => {
    // Trouver la statistique la plus récente pour cette période
    if (statistiques && statistiques.length > 0) {
      try {
        const latestStat = statistiques.reduce((prev, current) => {
          return new Date(prev.dateFin) > new Date(current.dateFin) ? prev : current;
        }, statistiques[0]);
        setPeriodStats(latestStat);
      } catch (error) {
        console.error("Erreur lors du traitement des statistiques:", error);
        toast({
          title: "Erreur",
          description: "Impossible de traiter les statistiques",
          variant: "destructive"
        });
      }
    } else {
      setPeriodStats(null);
    }
  }, [statistiques, toast]);

  useEffect(() => {
    const loadAgentData = async () => {
      if (!periodStats) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const agentData = await fetchAgentById("agent1"); // Exemple d'ID - idéalement utiliser un ID dynamique
        setAgent(agentData);
      } catch (error) {
        console.error("Erreur lors du chargement des données de l'agent:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'agent",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentData();
  }, [periodStats, toast]);

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
            value={periodStats.appelsEmis || 0}
          />
          <StatsItem
            label="Appels décrochés"
            value={periodStats.appelsDecroches || 0}
          />
          <StatsItem
            label="Appels transformés"
            value={periodStats.appelsTransformes || 0}
          />
          <StatsItem
            label="Rendez-vous honorés"
            value={periodStats.rendezVousHonores || 0}
          />
          <StatsItem
            label="Dossiers validés"
            value={periodStats.dossiersValides || 0}
          />
          {showMonetaryStats && periodStats.chiffreAffaires !== undefined && (
            <StatsItem
              label="Chiffre d'affaires"
              value={`${(periodStats.chiffreAffaires || 0).toLocaleString()} €`}
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
