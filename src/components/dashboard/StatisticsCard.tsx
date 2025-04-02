
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatisticsCardProps {
  title: string;
  description?: string;
  current: number;
  max: number;
  percentageText?: string;
  progressColor?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  description,
  current,
  max,
  percentageText,
  progressColor = "bg-blue-600",
}) => {
  const percentage = (current / max) * 100;
  
  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 pb-2 pt-4">
        <CardTitle className="text-sm font-medium text-slate-100">{title}</CardTitle>
        {description && <CardDescription className="text-slate-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-bold">{current}</div>
          <div className="text-sm text-muted-foreground">{percentageText || `${percentage.toFixed(0)}%`}</div>
        </div>
        <Progress 
          value={percentage} 
          className="h-2"
          indicatorClassName={progressColor}
        />
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
