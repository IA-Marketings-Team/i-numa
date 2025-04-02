
import React from "react";
import MarketCard from "./MarketCard";

interface OverviewSectionProps {
  statistiques: any;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ statistiques }) => {
  // Calcul des variations (simulé pour l'exemple)
  const appelsVariation = Math.random() * 10 - 5;
  const rdvVariation = Math.random() * 8 - 4;
  const conversionVariation = Math.random() * 6 - 3;
  const chiffreVariation = Math.random() * 15 - 7;

  const totalAppels = statistiques.reduce((sum: number, stat: any) => sum + stat.appelsEmis, 0);
  const totalRdv = statistiques.reduce((sum: number, stat: any) => sum + stat.rendezVousHonores, 0);
  const totalDossiers = statistiques.reduce((sum: number, stat: any) => sum + stat.dossiersSigne, 0);
  const conversion = totalAppels > 0 ? (totalDossiers / totalAppels) * 100 : 0;
  const chiffreAffaires = statistiques.reduce((sum: number, stat: any) => sum + (stat.chiffreAffaires || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MarketCard
        title="Appels émis"
        value={totalAppels}
        change={appelsVariation}
        currency=""
      />
      <MarketCard
        title="Rendez-vous honorés"
        value={totalRdv}
        change={rdvVariation}
        currency=""
      />
      <MarketCard
        title="Taux de conversion"
        value={conversion.toFixed(1)}
        change={conversionVariation}
        isPercentage={true}
      />
      <MarketCard
        title="Chiffre d'affaires"
        value={chiffreAffaires}
        change={chiffreVariation}
      />
    </div>
  );
};

export default OverviewSection;
