
import { useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import { Client, DossierStatus, Offre } from "@/types";
import { clients } from "@/data/mockData";
import { offres } from "@/data/mock/offres";
import { useToast } from "@/hooks/use-toast";

interface UseDossierFormSubmitProps {
  isEditing: boolean;
  dossierID?: string;
  formValues: {
    selectedClient: string;
    selectedAgentPhoner: string;
    selectedAgentVisio: string;
    status: string;
    notes: string;
    selectedOffres: string[];
    montant?: number;
    dateRdv: string;
  };
  formErrors: {
    setFormError: (error: string) => void;
    setClientError: (error: string) => void;
  };
}

export const useDossierFormSubmit = ({
  isEditing,
  dossierID,
  formValues,
  formErrors
}: UseDossierFormSubmitProps) => {
  const navigate = useNavigate();
  const { addDossier, updateDossier } = useDossier();
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  const { 
    selectedClient, 
    selectedAgentPhoner, 
    selectedAgentVisio, 
    status, 
    notes, 
    selectedOffres,
    montant,
    dateRdv 
  } = formValues;
  
  const { setFormError, setClientError } = formErrors;

  const handleOffreChange = (offreId: string) => {
    const newSelectedOffres = selectedOffres.includes(offreId)
      ? selectedOffres.filter(id => id !== offreId)
      : [...selectedOffres, offreId];
      
    return newSelectedOffres;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setClientError("");

    console.log("[DossierFormSubmit] Form submission started", { 
      selectedClient, 
      isEditing,
      hasPermission: hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])
    });

    if (!hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])) {
      console.error("[DossierFormSubmit] Permission denied for dossier creation");
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour créer un dossier"
      });
      return;
    }

    if (!selectedClient) {
      console.warn("[DossierFormSubmit] No client selected");
      setClientError("Veuillez sélectionner un client");
      setFormError("Des champs obligatoires n'ont pas été remplis");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un client"
      });
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    if (!client) {
      console.error("[DossierFormSubmit] Client not found for ID:", selectedClient);
      setClientError("Client non trouvé");
      setFormError("Client non trouvé");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Client non trouvé"
      });
      return;
    }

    const offresToAdd = offres.filter(o => selectedOffres.includes(o.id));
    console.log("[DossierFormSubmit] Selected offres:", offresToAdd.map(o => o.nom));
    
    const dossierData = {
      clientId: selectedClient,
      client: client as Client,
      agentPhonerId: selectedAgentPhoner !== "none" ? selectedAgentPhoner : undefined,
      agentVisioId: selectedAgentVisio !== "none" ? selectedAgentVisio : undefined,
      status: status as DossierStatus,
      offres: offresToAdd as Offre[],
      dateRdv: dateRdv ? new Date(dateRdv) : undefined,
      notes,
      montant
    };
    
    console.log("[DossierFormSubmit] Dossier data prepared:", dossierData);
    
    try {
      if (isEditing && dossierID) {
        console.log("[DossierFormSubmit] Updating existing dossier:", dossierID);
        updateDossier(dossierID, dossierData);
        toast({
          title: "Succès",
          description: "Le dossier a été mis à jour avec succès",
        });
      } else {
        console.log("[DossierFormSubmit] Creating new dossier");
        addDossier(dossierData);
        toast({
          title: "Succès",
          description: "Le dossier a été créé avec succès",
        });
      }
      
      console.log("[DossierFormSubmit] Navigating to /dossiers");
      navigate("/dossiers");
    } catch (error) {
      console.error("[DossierFormSubmit] Error saving dossier:", error);
      setFormError("Une erreur est survenue lors de la sauvegarde du dossier");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du dossier",
      });
    }
  };

  return {
    handleSubmit,
    handleOffreChange,
    navigate,
    hasPermission
  };
};
