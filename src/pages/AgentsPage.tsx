
import React from "react";

const AgentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agents</h1>
      <p className="text-muted-foreground">
        This page will display agents fetched from Supabase.
      </p>
    </div>
  );
};

export default AgentsPage;
