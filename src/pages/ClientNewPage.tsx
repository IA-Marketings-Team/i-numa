
import React from "react";

const ClientNewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Client</h1>
      <p className="text-muted-foreground">
        New client data will be saved to Supabase.
      </p>
    </div>
  );
};

export default ClientNewPage;
