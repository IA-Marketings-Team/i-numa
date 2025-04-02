
import React from "react";
import { Statistique } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, Users, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewSectionProps {
  statistiques: Statistique[];
  showRevenueData?: boolean;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ 
  statistiques, 
  showRevenueData = false 
}) => {
  // Calcul des statistiques
  const totalAppels = statistiques.reduce((sum, stat) => sum + stat.appelsEmis, 0);
  const totalRdv = statistiques.reduce((sum, stat) => sum + stat.rendezVousHonores, 0);
  const totalDossiers = statistiques.reduce((sum, stat) => sum + stat.dossiersSigne, 0);
  const chiffreAffaires = statistiques.reduce((sum, stat) => sum + (stat.chiffreAffaires || 0), 0);

  // Format monétaire pour afficher le chiffre d'affaires
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Appels émis"
        value={totalAppels.toString()}
        icon={Activity}
        trend={{
          value: 12.5,
          positive: true,
        }}
        className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/20"
        iconClassName="bg-blue-500 text-white"
      />
      
      <StatsCard
        title="Rendez-vous honorés"
        value={totalRdv.toString()}
        icon={Users}
        trend={{
          value: 8.2,
          positive: true,
        }}
        className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/20"
        iconClassName="bg-green-500 text-white"
      />
      
      <StatsCard
        title="Dossiers signés"
        value={totalDossiers.toString()}
        icon={BarChart}
        trend={{
          value: 5.1,
          positive: false,
        }}
        className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/20"
        iconClassName="bg-purple-500 text-white"
      />
      
      {showRevenueData && (
        <StatsCard
          title="Chiffre d'affaires"
          value={formatCurrency(chiffreAffaires)}
          icon={CreditCard}
          trend={{
            value: 18.3,
            positive: true,
          }}
          className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border-amber-500/20"
          iconClassName="bg-amber-500 text-white"
        />
      )}
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: {
    value: number;
    positive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
}) => {
  return (
    <Card className={cn("border bg-dark-card/60 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", iconClassName)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <p className={cn(
          "text-xs flex items-center",
          trend.positive ? "text-green-500" : "text-red-500"
        )}>
          <span className={cn(
            "mr-1",
            trend.positive ? "text-green-500" : "text-red-500"
          )}>
            {trend.positive ? "↑" : "↓"}
          </span>
          {trend.positive ? "+" : ""}{trend.value}% 
          <span className="text-slate-400 ml-1">vs last period</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default OverviewSection;
