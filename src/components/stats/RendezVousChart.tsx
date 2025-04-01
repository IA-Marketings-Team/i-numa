
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface RendezVousChartProps {
  data: ChartData[];
  title?: string;
}

const RendezVousChart: React.FC<RendezVousChartProps> = ({ 
  data, 
  title = "Rendez-vous par statut" 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Nombre" fill="#8884d8" getBarProps={(entry) => ({ fill: entry.fill || "#8884d8" })} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RendezVousChart;
