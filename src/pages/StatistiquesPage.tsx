
import React from "react";
import Statistics from "./Statistics";
import { DossierProvider } from "@/contexts/DossierContext";
import { StatistiqueProvider } from "@/contexts/StatistiqueContext";

const StatistiquesPage: React.FC = () => {
  return (
    <DossierProvider>
      <StatistiqueProvider>
        <Statistics />
      </StatistiqueProvider>
    </DossierProvider>
  );
};

export default StatistiquesPage;
