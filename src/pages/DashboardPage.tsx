
import React from "react";
import Dashboard from "./Dashboard";
import { DossierProvider } from "@/contexts/DossierContext";
import { StatistiqueProvider } from "@/contexts/StatistiqueContext";

const DashboardPage: React.FC = () => {
  return (
    <DossierProvider>
      <StatistiqueProvider>
        <Dashboard />
      </StatistiqueProvider>
    </DossierProvider>
  );
};

export default DashboardPage;
