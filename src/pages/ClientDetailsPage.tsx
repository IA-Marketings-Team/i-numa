
import React from "react";
import { useParams } from "react-router-dom";

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Client Details</h1>
      <p>Viewing details for client ID: {id}</p>
      <p className="text-muted-foreground">
        Client details will be fetched from Supabase.
      </p>
    </div>
  );
};

export default ClientDetailsPage;
