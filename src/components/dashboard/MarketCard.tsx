
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MarketCardProps {
  title: string;
  value: string | number;
  change?: number;
  currency?: string;
  isPercentage?: boolean;
}

const MarketCard: React.FC<MarketCardProps> = ({
  title,
  value,
  change,
  currency = "€",
  isPercentage = false,
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const changeAbs = change ? Math.abs(change) : 0;

  return (
    <Card className="overflow-hidden border-0 bg-card shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 pb-2 pt-4">
        <CardTitle className="text-sm font-medium text-slate-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">
            {isPercentage ? `${value}%` : `${currency}${value.toLocaleString()}`}
          </div>
          {change !== undefined && (
            <div
              className={`flex items-center text-sm ${
                isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-slate-500"
              }`}
            >
              {isPositive ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : isNegative ? (
                <ArrowDown className="mr-1 h-4 w-4" />
              ) : null}
              <span>{changeAbs}{isPercentage ? "%" : currency}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCard;
