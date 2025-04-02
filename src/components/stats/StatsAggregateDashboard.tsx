
import React from "react";
import { Statistique } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface StatsAggregateDashboardProps {
  statistiques: Statistique[];
  showMonetaryStats?: boolean;
}

const StatsAggregateDashboard: React.FC<StatsAggregateDashboardProps> = ({
  statistiques,
  showMonetaryStats = false
}) => {
  if (!statistiques || statistiques.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Aucune statistique disponible</p>
      </div>
    );
  }

  // Calculer les statistiques globales en faisant la somme de toutes les statistiques
  const totalStats = statistiques.reduce(
    (total, stat) => {
      total.appelsEmis += stat.appelsEmis || 0;
      total.appelsDecroches += stat.appelsDecroches || 0;
      total.appelsTransformes += stat.appelsTransformes || 0;
      total.rendezVousHonores += stat.rendezVousHonores || 0;
      total.rendezVousNonHonores += stat.rendezVousNonHonores || 0;
      total.dossiersValides += stat.dossiersValides || 0;
      total.dossiersSigne += stat.dossiersSigne || 0;
      total.chiffreAffaires += stat.chiffreAffaires || 0;
      return total;
    },
    {
      appelsEmis: 0,
      appelsDecroches: 0,
      appelsTransformes: 0,
      rendezVousHonores: 0,
      rendezVousNonHonores: 0,
      dossiersValides: 0,
      dossiersSigne: 0,
      chiffreAffaires: 0
    }
  );

  // Calculer les taux de conversion
  const tauxDecroche = totalStats.appelsEmis > 0
    ? ((totalStats.appelsDecroches / totalStats.appelsEmis) * 100).toFixed(1)
    : "0";
  
  const tauxTransformation = totalStats.appelsDecroches > 0
    ? ((totalStats.appelsTransformes / totalStats.appelsDecroches) * 100).toFixed(1)
    : "0";
  
  const tauxRdvHonores = (totalStats.rendezVousHonores + totalStats.rendezVousNonHonores) > 0
    ? ((totalStats.rendezVousHonores / (totalStats.rendezVousHonores + totalStats.rendezVousNonHonores)) * 100).toFixed(1)
    : "0";
  
  const tauxDossiersSigne = totalStats.dossiersValides > 0
    ? ((totalStats.dossiersSigne / totalStats.dossiersValides) * 100).toFixed(1)
    : "0";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Appels émis" value={totalStats.appelsEmis} />
      <StatCard title="Taux de décrochés" value={`${tauxDecroche}%`} />
      <StatCard title="Taux de transformation" value={`${tauxTransformation}%`} />
      <StatCard title="RDV honorés" value={`${tauxRdvHonores}%`} />
      <StatCard title="Dossiers validés" value={totalStats.dossiersValides} />
      <StatCard title="Dossiers signés" value={totalStats.dossiersSigne} />
      <StatCard title="Taux de signature" value={`${tauxDossiersSigne}%`} />
      
      {showMonetaryStats && (
        <StatCard 
          title="Chiffre d'affaires" 
          value={`${totalStats.chiffreAffaires.toLocaleString()} €`} 
          highlight 
        />
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, highlight = false }) => {
  return (
    <Card className={highlight ? "border-green-500" : ""}>
      <CardContent className="p-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={`text-2xl font-bold mt-1 ${highlight ? "text-green-600" : ""}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsAggregateDashboard;
