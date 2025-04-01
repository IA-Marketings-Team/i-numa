import { useState, useEffect } from "react";
import { useDossier } from "@/contexts/DossierContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Client, Dossier, DossierStatus, UserRole, Offre } from "@/types";
import { clients, agents, offres as mockOffres } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface UseDossierFormProps {
  dossier?: Dossier;
  isEditing?: boolean;
  userRole?: UserRole;
}

export const useDossierForm = ({ dossier, isEditing = false, userRole }: UseDossierFormProps) => {
  const navigate = useNavigate();
  const { addDossier, updateDossier } = useDossier();
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  const [selectedClient, setSelectedClient] = useState<string>(dossier?.clientId || "");
  const [selectedAgentPhoner, setSelectedAgentPhoner] = useState<string>(dossier?.agentPhonerId || "none");
  const [selectedAgentVisio, setSelectedAgentVisio] = useState<string>(dossier?.agentVisioId || "none");
  const [status, setStatus] = useState<DossierStatus>(dossier?.status || "prospect");
  const [notes, setNotes] = useState<string>(dossier?.notes || "");
  const [selectedOffres, setSelectedOffres] = useState<string[]>(
    dossier?.offres.map(o => o.id) || []
  );
  const [montant, setMontant] = useState<number | undefined>(dossier?.montant);
  const [dateRdv, setDateRdv] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [clientError, setClientError] = useState<string>("");

  const phonerAgents = agents.filter(a => a.role === "agent_phoner");
  const visioAgents = agents.filter(a => a.role === "agent_visio");

  useEffect(() => {
    if (!isEditing && userRole === 'agent_phoner' && selectedAgentPhoner === "none") {
      const currentAgent = agents.find(a => a.role === 'agent_phoner');
      if (currentAgent) {
        setSelectedAgentPhoner(currentAgent.id);
      }
    }
  }, [isEditing, userRole, selectedAgentPhoner]);

  useEffect(() => {
    if (dossier?.dateRdv) {
      const date = new Date(dossier.dateRdv);
      setDateRdv(date.toISOString().split('T')[0]);
    }
  }, [dossier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setClientError("");

    console.log("Form submission started", { 
      selectedClient, 
      isEditing, 
      userRole,
      hasPermission: hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])
    });

    if (!hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour créer un dossier"
      });
      console.error("Permission denied for dossier creation");
      return;
    }

    if (!selectedClient) {
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
      setClientError("Client non trouvé");
      setFormError("Client non trouvé");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Client non trouvé"
      });
      return;
    }

    const offresToAdd = mockOffres.filter(o => selectedOffres.includes(o.id));
    
    const dossierData = {
      clientId: selectedClient,
      client: client as Client,
      agentPhonerId: selectedAgentPhoner !== "none" ? selectedAgentPhoner : undefined,
      agentVisioId: selectedAgentVisio !== "none" ? selectedAgentVisio : undefined,
      status,
      offres: offresToAdd,
      dateRdv: dateRdv ? new Date(dateRdv) : undefined,
      notes,
      montant
    };
    
    try {
      if (isEditing && dossier) {
        updateDossier(dossier.id, dossierData);
        toast({
          title: "Succès",
          description: "Le dossier a été mis à jour avec succès",
        });
      } else {
        addDossier(dossierData);
        toast({
          title: "Succès",
          description: "Le dossier a été créé avec succès",
        });
      }
      
      navigate("/dossiers");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du dossier:", error);
      setFormError("Une erreur est survenue lors de la sauvegarde du dossier");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du dossier",
      });
    }
  };

  const handleOffreChange = (offreId: string) => {
    setSelectedOffres(prev => 
      prev.includes(offreId)
        ? prev.filter(id => id !== offreId)
        : [...prev, offreId]
    );
  };

  useEffect(() => {
    if (hasPermission(['superviseur', 'responsable'])) {
      const total = mockOffres
        .filter(o => selectedOffres.includes(o.id))
        .reduce((sum, offre) => sum + (offre.prix || 0), 0);
      
      setMontant(total > 0 ? total : undefined);
    }
  }, [selectedOffres, hasPermission]);
  
  return {
    selectedClient,
    setSelectedClient,
    selectedAgentPhoner,
    setSelectedAgentPhoner,
    selectedAgentVisio,
    setSelectedAgentVisio,
    status,
    setStatus,
    notes,
    setNotes,
    selectedOffres,
    setSelectedOffres,
    montant,
    setMontant,
    dateRdv,
    setDateRdv,
    handleSubmit,
    handleOffreChange,
    phonerAgents,
    visioAgents,
    hasPermission,
    navigate,
    formError,
    clientError
  };
};
