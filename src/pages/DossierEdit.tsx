
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import DossierForm from "@/components/dossier/DossierForm";
import { Dossier } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const DossierEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchDossierById } = useDossier();
  const { hasPermission } = useAuth();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    // Vérifier les autorisations
    if (!hasPermission(["agent_phoner", "agent_visio", "superviseur", "responsable"])) {
      navigate("/dossiers");
      return;
    }

    // Charger le dossier existant en mode édition
    if (isEdit) {
      const loadDossier = async () => {
        setIsLoading(true);
        try {
          const result = await fetchDossierById(id);
          if (result) {
            setDossier(result);
          } else {
            navigate("/dossiers");
          }
        } catch (error) {
          console.error("Erreur lors du chargement du dossier:", error);
          navigate("/dossiers");
        } finally {
          setIsLoading(false);
        }
      };

      loadDossier();
    }
  }, [id, isEdit, navigate, hasPermission]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>
      
      <h1 className="text-3xl font-bold">
        {isEdit ? "Modifier le dossier" : "Nouveau dossier"}
      </h1>

      <DossierForm dossier={dossier} isEdit={isEdit} />
    </div>
  );
};

export default DossierEdit;
