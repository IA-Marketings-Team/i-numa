
import React from "react";
import { Statistique } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StatistiqueTableProps {
  statistiques: Statistique[];
  periode: "jour" | "semaine" | "mois";
  showMonetaryStats?: boolean;
}

const StatistiqueTable: React.FC<StatistiqueTableProps> = ({
  statistiques,
  periode,
  showMonetaryStats = false,
}) => {
  const periodeLabel = getPeriodeLabel(periode);

  if (!statistiques || statistiques.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Aucune statistique {periodeLabel} disponible</p>
      </div>
    );
  }

  // Trier les statistiques par date (les plus récentes en premier)
  const sortedStats = [...statistiques].sort((a, b) => 
    new Date(b.dateFin).getTime() - new Date(a.dateFin).getTime()
  );

  return (
    <Table>
      <TableCaption>Statistiques {periodeLabel}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Période</TableHead>
          <TableHead className="text-right">Appels émis</TableHead>
          <TableHead className="text-right">Décrochés</TableHead>
          <TableHead className="text-right">Transformés</TableHead>
          <TableHead className="text-right">RDV honorés</TableHead>
          <TableHead className="text-right">RDV manqués</TableHead>
          <TableHead className="text-right">Dossiers validés</TableHead>
          <TableHead className="text-right">Dossiers signés</TableHead>
          {showMonetaryStats && (
            <TableHead className="text-right">Chiffre d'affaires</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedStats.map((stat, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {formatDate(stat.dateDebut)} - {formatDate(stat.dateFin)}
            </TableCell>
            <TableCell className="text-right">{stat.appelsEmis}</TableCell>
            <TableCell className="text-right">{stat.appelsDecroches}</TableCell>
            <TableCell className="text-right">{stat.appelsTransformes}</TableCell>
            <TableCell className="text-right">{stat.rendezVousHonores}</TableCell>
            <TableCell className="text-right">{stat.rendezVousNonHonores}</TableCell>
            <TableCell className="text-right">{stat.dossiersValides}</TableCell>
            <TableCell className="text-right">{stat.dossiersSigne}</TableCell>
            {showMonetaryStats && (
              <TableCell className="text-right font-medium text-green-600">
                {stat.chiffreAffaires?.toLocaleString()} €
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Formater la date (jour/mois/année)
const formatDate = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR");
};

const getPeriodeLabel = (periode: "jour" | "semaine" | "mois"): string => {
  switch (periode) {
    case "jour":
      return "journalières";
    case "semaine":
      return "hebdomadaires";
    case "mois":
      return "mensuelles";
    default:
      return "";
  }
};

export default StatistiqueTable;
