
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DossierProvider } from "@/contexts/DossierContext";
import DossierForm from "@/components/dossier/DossierForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const DossierEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/dossiers/${id}`);
  };
  
  return (
    <DossierProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Modifier le dossier</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du dossier</CardTitle>
          </CardHeader>
          <CardContent>
            <DossierForm 
              dossierId={id}
              onSuccess={() => {
                navigate(`/dossiers/${id}`);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </DossierProvider>
  );
};

export default DossierEditPage;
