
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatisticsCardProps {
  title: string;
  current: number;
  max: number;
  progressColor?: string;
  isPercentage?: boolean;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  current,
  max,
  progressColor = "bg-blue-600",
  isPercentage = false,
}) => {
  // Évite la division par zéro
  const percentage = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  
  // Formats d'affichage
  const displayValue = isPercentage ? `${current}%` : current;
  const displayMax = isPercentage ? "100%" : max;
  
  return (
    <Card className="bg-dark-card border-slate-800 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end mb-2">
          <div className="text-2xl font-bold">{displayValue}</div>
          <div className="text-sm text-slate-400">/ {displayMax}</div>
        </div>
        
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full", progressColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
