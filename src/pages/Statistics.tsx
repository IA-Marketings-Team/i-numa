
import StatistiquesDashboard from "@/components/stats/StatistiquesDashboard";

const Statistics = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
        <p className="text-lg text-muted-foreground">
          Suivez vos performances et l'évolution de vos dossiers en temps réel
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <StatistiquesDashboard />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
