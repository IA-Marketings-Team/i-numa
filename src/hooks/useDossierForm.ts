
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

  // Filtrer les agents par rôle
  const phonerAgents = agents.filter(a => a.role === "agent_phoner");
  const visioAgents = agents.filter(a => a.role === "agent_visio");

  // Auto-assigner l'agent phoner si l'utilisateur est un agent_phoner et qu'on crée un nouveau dossier
  useEffect(() => {
    if (!isEditing && userRole === 'agent_phoner' && selectedAgentPhoner === "none") {
      const currentAgent = agents.find(a => a.role === 'agent_phoner');
      if (currentAgent) {
        setSelectedAgentPhoner(currentAgent.id);
      }
    }
  }, [isEditing, userRole, selectedAgentPhoner]);

  // Formater la date pour l'input
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

    // Vérifier qu'un client est sélectionné
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

    // Trouver le client sélectionné
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

    // Trouver les offres sélectionnées
    const offresToAdd = mockOffres.filter(o => selectedOffres.includes(o.id));
    
    // Préparer les données du dossier
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
        // Mise à jour d'un dossier existant
        updateDossier(dossier.id, dossierData);
        toast({
          title: "Succès",
          description: "Le dossier a été mis à jour avec succès",
        });
      } else {
        // Création d'un nouveau dossier
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

  // Calculer automatiquement le montant total des offres sélectionnées
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
