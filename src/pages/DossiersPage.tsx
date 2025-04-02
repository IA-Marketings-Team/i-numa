
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DossierProvider } from "@/contexts/DossierContext";
import DossierListPage from "./DossierList";
import { useToast } from "@/hooks/use-toast";

const DossiersPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Log component initialization for debugging purposes
  useEffect(() => {
    console.log("[DossiersPage] Component initialized");
  }, []);

  const handleAddDossier = () => {
    console.log("[DossiersPage] Navigating to /dossiers/nouveau");
    navigate("/dossiers/nouveau");
  };
  
  return (
    <DossierProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dossiers</h1>
          <Button onClick={handleAddDossier}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un dossier
          </Button>
        </div>
        
        <DossierListPage />
      </div>
    </DossierProvider>
  );
};

export default DossiersPage;
