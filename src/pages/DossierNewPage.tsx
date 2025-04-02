
import React from "react";
import { DossierProvider } from "@/contexts/DossierContext";
import DossierForm from "@/components/dossier/DossierForm";
import { useAuth } from "@/contexts/AuthContext";

const DossierNewPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <DossierProvider>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Nouveau Dossier</h1>
        <p className="text-muted-foreground">
          Créez un nouveau dossier en remplissant les informations ci-dessous.
        </p>
        
        <DossierForm userRole={user?.role} />
      </div>
    </DossierProvider>
  );
};

export default DossierNewPage;
