
import React from "react";
import { Statistique } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, ArrowUp, Percent, Target } from "lucide-react";

interface StatsAggregateDashboardProps {
  statistiques: Statistique[];
  showMonetaryStats?: boolean;
}

const StatsAggregateDashboard: React.FC<StatsAggregateDashboardProps> = ({
  statistiques,
  showMonetaryStats = false,
}) => {
  // Si aucune statistique, afficher un message
  if (!statistiques || statistiques.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Aucune statistique disponible</p>
      </div>
    );
  }

  // Trouver la statistique la plus récente
  const latestStat = statistiques.reduce((prev, current) => {
    return new Date(prev.dateFin) > new Date(current.dateFin) ? prev : current;
  }, statistiques[0]);

  // Calculer des taux
  const decrochageRate = Math.round(
    (latestStat.appelsDecroches / (latestStat.appelsEmis || 1)) * 100
  );
  const transformationRate = Math.round(
    (latestStat.appelsTransformes / (latestStat.appelsDecroches || 1)) * 100
  );
  const rdvHonoreRate = Math.round(
    (latestStat.rendezVousHonores /
      ((latestStat.rendezVousHonores + latestStat.rendezVousNonHonores) || 1)) *
      100
  );
  const validationRate = Math.round(
    (latestStat.dossiersValides / (latestStat.appelsTransformes || 1)) * 100
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <p className="text-muted-foreground text-sm">Taux de décrochage</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{decrochageRate}%</span>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </div>
              <Progress value={decrochageRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {latestStat.appelsDecroches} / {latestStat.appelsEmis} appels
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <p className="text-muted-foreground text-sm">Taux de transformation</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{transformationRate}%</span>
                <ArrowUp className={`h-4 w-4 ${transformationRate > 50 ? "text-green-500" : "text-orange-500"}`} />
              </div>
              <Progress value={transformationRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {latestStat.appelsTransformes} / {latestStat.appelsDecroches} appels
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <p className="text-muted-foreground text-sm">Taux de présence RDV</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{rdvHonoreRate}%</span>
                <Target className={`h-4 w-4 ${rdvHonoreRate > 70 ? "text-green-500" : "text-orange-500"}`} />
              </div>
              <Progress value={rdvHonoreRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {latestStat.rendezVousHonores} /{" "}
                {latestStat.rendezVousHonores + latestStat.rendezVousNonHonores} rendez-vous
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <p className="text-muted-foreground text-sm">Taux de validation</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{validationRate}%</span>
                <ArrowDown className={`h-4 w-4 ${validationRate > 60 ? "text-green-500" : "text-red-500"}`} />
              </div>
              <Progress value={validationRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {latestStat.dossiersValides} dossiers validés
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {showMonetaryStats && (
        <>
          <Separator />
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Chiffre d'affaires</span>
              <span className="font-bold text-xl">
                {latestStat.chiffreAffaires?.toLocaleString()} €
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Montant moyen par dossier</span>
              <span className="font-bold">
                {latestStat.dossiersValides
                  ? Math.round(
                      (latestStat.chiffreAffaires || 0) / latestStat.dossiersValides
                    ).toLocaleString()
                  : 0}{" "}
                €
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsAggregateDashboard;
