
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
        <p className="text-muted-foreground">Aucune statistique disponible pour les graphiques</p>
      </div>
    );
  }

  // Trier les statistiques par date (les plus anciennes en premier pour les graphiques)
  const sortedStats = [...statistiques].sort((a, b) => 
    new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
  );

  // Préparer les données pour les graphiques
  const chartData = sortedStats.map(stat => ({
    periode: formatDate(stat.dateDebut),
    appelsEmis: stat.appelsEmis || 0,
    appelsDecroches: stat.appelsDecroches || 0,
    appelsTransformes: stat.appelsTransformes || 0,
    rendezVousHonores: stat.rendezVousHonores || 0,
    dossiersValides: stat.dossiersValides || 0,
    dossiersSigne: stat.dossiersSigne || 0,
    chiffreAffaires: stat.chiffreAffaires || 0,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Activité téléphonique</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <h3 className="text-lg font-medium mb-2">Rendez-vous et dossiers</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periode" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rendezVousHonores" name="RDV honorés" stroke="#8884d8" />
            <Line type="monotone" dataKey="dossiersValides" name="Dossiers validés" stroke="#82ca9d" />
            <Line type="monotone" dataKey="dossiersSigne" name="Dossiers signés" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {showMonetaryStats && (
        <div>
          <h3 className="text-lg font-medium mb-2">Chiffre d'affaires</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periode" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} €`, "Chiffre d'affaires"]} />
              <Legend />
              <Bar dataKey="chiffreAffaires" name="Chiffre d'affaires" fill="#2e7d32" />
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
  return d.toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit' });
};

export default StatistiqueCharts;
