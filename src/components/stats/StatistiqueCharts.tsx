
import React from "react";
import { Statistique } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface StatistiqueChartsProps {
  statistiques: Statistique[];
  showMonetaryStats?: boolean;
}

const StatistiqueCharts: React.FC<StatistiqueChartsProps> = ({
  statistiques,
  showMonetaryStats = false,
}) => {
  if (!statistiques || statistiques.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Aucune statistique disponible pour générer des graphiques</p>
      </div>
    );
  }

  // Trier les statistiques par date
  const sortedStats = [...statistiques].sort(
    (a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
  );

  // Préparer les données pour les graphiques
  const chartData = sortedStats.map((stat) => ({
    periode: formatDate(stat.dateDebut),
    appelsEmis: stat.appelsEmis,
    appelsDecroches: stat.appelsDecroches,
    appelsTransformes: stat.appelsTransformes,
    rendezVousHonores: stat.rendezVousHonores,
    rendezVousNonHonores: stat.rendezVousNonHonores,
    dossiersValides: stat.dossiersValides,
    dossiersSigne: stat.dossiersSigne,
    chiffreAffaires: stat.chiffreAffaires,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Évolution des appels</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periode" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="appelsEmis" name="Appels émis" fill="#8884d8" />
            <Bar dataKey="appelsDecroches" name="Appels décrochés" fill="#82ca9d" />
            <Bar dataKey="appelsTransformes" name="Appels transformés" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Évolution des rendez-vous</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periode" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="rendezVousHonores"
              name="RDV honorés"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="rendezVousNonHonores"
              name="RDV manqués"
              stroke="#ff7300"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Évolution des dossiers</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periode" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="dossiersValides"
              name="Dossiers validés"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="dossiersSigne"
              name="Dossiers signés"
              stroke="#e35a0e"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {showMonetaryStats && (
        <div>
          <h3 className="text-lg font-medium mb-4">Évolution du chiffre d'affaires</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periode" />
              <YAxis />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} €`} />
              <Legend />
              <Bar
                dataKey="chiffreAffaires"
                name="Chiffre d'affaires"
                fill="#4caf50"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// Formater la date (jour/mois/année)
const formatDate = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

export default StatistiqueCharts;
