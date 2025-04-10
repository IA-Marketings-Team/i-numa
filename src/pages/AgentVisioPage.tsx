
import React from "react";
import { DossierProvider } from "@/contexts/DossierContext";
import { StatistiqueProvider } from "@/contexts/StatistiqueContext";
import AgentVisioStats from "@/components/stats/AgentVisioStats";

const AgentVisioPage: React.FC = () => {
  return (
    <DossierProvider>
      <StatistiqueProvider>
        <div className="container mx-auto py-6">
          <AgentVisioStats />
        </div>
      </StatistiqueProvider>
    </DossierProvider>
  );
};

export default AgentVisioPage;
