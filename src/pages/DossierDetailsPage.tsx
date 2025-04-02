
import React from "react";
import { useParams } from "react-router-dom";

const DossierDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dossier Details</h1>
      <p>Viewing details for dossier ID: {id}</p>
      <p className="text-muted-foreground">
        Dossier details will be fetched from Supabase.
      </p>
    </div>
  );
};

export default DossierDetailsPage;
