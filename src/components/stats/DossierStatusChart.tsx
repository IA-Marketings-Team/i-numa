
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { DossierStatusStats } from "@/services/dynamicStatService";

interface DossierStatusChartProps {
  data: DossierStatusStats[];
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    "prospect_chaud": "#ef4444",
    "prospect_froid": "#3b82f6",
    "rdv_honore": "#22c55e",
    "rdv_non_honore": "#f59e0b",
    "rdv_planifie": "#8b5cf6",
    "valide": "#06b6d4",
    "signe": "#8b5cf6",
    "archive": "#6b7280"
  };
  
  return colors[status] || "#6b7280";
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    "prospect_chaud": "Prospect à chaud",
    "prospect_froid": "Prospect à froid",
    "rdv_honore": "RDV honoré",
    "rdv_non_honore": "RDV non honoré",
    "rdv_planifie": "RDV planifié",
    "valide": "Validé",
    "signe": "Signé",
    "archive": "Archivé"
  };
  
  return labels[status] || status;
};

export const DossierStatusChart: React.FC<DossierStatusChartProps> = ({ data }) => {
  // Transform data for the chart
  const chartData = data.map(item => ({
    ...item,
    statusLabel: getStatusLabel(item.status)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des dossiers par statut</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Aucune donnée disponible</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="statusLabel" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} dossier${value !== 1 ? 's' : ''}`, "Nombre"]}
                  labelFormatter={(label) => `Statut: ${label}`}
                />
                <Legend />
                <Bar dataKey="count" name="Nombre de dossiers">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DossierStatusChart;
