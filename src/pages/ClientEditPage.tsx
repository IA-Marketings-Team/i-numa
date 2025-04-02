
import React from "react";
import { useParams } from "react-router-dom";

const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Client</h1>
      <p>Editing client ID: {id}</p>
      <p className="text-muted-foreground">
        Client data will be fetched from and saved to Supabase.
      </p>
    </div>
  );
};

export default ClientEditPage;
