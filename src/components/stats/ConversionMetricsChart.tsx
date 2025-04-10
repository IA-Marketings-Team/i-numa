
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ConversionMetricsStats } from "@/services/dynamicStatService";

interface ConversionMetricsChartProps {
  data: ConversionMetricsStats[];
}

export const ConversionMetricsChart: React.FC<ConversionMetricsChartProps> = ({ data }) => {
  // Transform data for the chart
  const chartData = data.map(item => ({
    name: item.etape,
    total: item.total,
    taux: item.taux_conversion
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métriques de conversion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Aucune donnée disponible</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-[300px]">
                <p className="text-sm font-medium mb-2">Volume par étape</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [value, "Nombre"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Volume"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-[300px]">
                <p className="text-sm font-medium mb-2">Taux de conversion par étape</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, "Taux"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="taux"
                      name="Taux de conversion"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionMetricsChart;
