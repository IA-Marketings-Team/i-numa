
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Statistique } from "@/types";
import { AreaChart, BarChart, BarChart4 } from "lucide-react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformanceSectionProps {
  statistiques: Statistique[];
  showAllData?: boolean;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ 
  statistiques,
  showAllData = false 
}) => {
  // Transformer les statistiques pour les graphiques
  const prepareChartData = () => {
    return statistiques.map(stat => ({
      period: getFormattedDate(stat.dateDebut),
      appelsEmis: stat.appelsEmis,
      appelsDecroches: stat.appelsDecroches,
      appelsTransformes: stat.appelsTransformes,
      rendezVousHonores: stat.rendezVousHonores,
      rendezVousNonHonores: stat.rendezVousNonHonores,
      dossiersValides: stat.dossiersValides,
      dossiersSigne: stat.dossiersSigne,
      chiffreAffaires: stat.chiffreAffaires || 0,
    }));
  };

  // Formatter la date pour l'affichage
  const getFormattedDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  const chartData = prepareChartData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="bg-dark-card border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Performance d'appels</CardTitle>
          <BarChart4 className="h-5 w-5 text-slate-400" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis 
                dataKey="period" 
                stroke="#CBD5E0" 
                tick={{ fill: '#CBD5E0' }}
              />
              <YAxis stroke="#CBD5E0" tick={{ fill: '#CBD5E0' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1F2C', borderColor: '#2D3748', color: '#E2E8F0' }}
                labelStyle={{ color: '#E2E8F0' }}
              />
              <Legend />
              <Bar dataKey="appelsEmis" stackId="a" fill="#3B82F6" name="Appels émis" />
              <Bar dataKey="appelsDecroches" stackId="a" fill="#10B981" name="Appels décrochés" />
              <Bar dataKey="appelsTransformes" stackId="a" fill="#8B5CF6" name="Appels transformés" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-dark-card border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            {showAllData ? "Tendance du chiffre d'affaires" : "Tendance des rendez-vous"}
          </CardTitle>
          <AreaChart className="h-5 w-5 text-slate-400" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsAreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis 
                dataKey="period" 
                stroke="#CBD5E0" 
                tick={{ fill: '#CBD5E0' }}
              />
              <YAxis stroke="#CBD5E0" tick={{ fill: '#CBD5E0' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1F2C', borderColor: '#2D3748', color: '#E2E8F0' }}
                labelStyle={{ color: '#E2E8F0' }}
              />
              <Legend />
              
              {showAllData ? (
                <Area 
                  type="monotone" 
                  dataKey="chiffreAffaires" 
                  stroke="#F59E0B" 
                  fill="#F59E0B33" 
                  name="Chiffre d'affaires" 
                />
              ) : (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="rendezVousHonores" 
                    stroke="#10B981" 
                    fill="#10B98133" 
                    name="RDV honorés" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rendezVousNonHonores" 
                    stroke="#EF4444" 
                    fill="#EF444433" 
                    name="RDV non honorés" 
                  />
                </>
              )}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSection;
