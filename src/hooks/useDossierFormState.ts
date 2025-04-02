
import { useState, useEffect } from "react";
import { Dossier, DossierStatus } from "@/types";
import { agents } from "@/data/mockData";

interface UseDossierFormStateProps {
  dossier?: Dossier;
  userRole?: string;
  isEditing?: boolean;
}

export const useDossierFormState = ({
  dossier,
  userRole,
  isEditing = false
}: UseDossierFormStateProps) => {
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

  // Log initial component state
  useEffect(() => {
    console.log("[DossierFormState] Initial state:", { 
      isEditing, 
      userRole, 
      dossierExists: !!dossier,
      dossierID: dossier?.id
    });
  }, [dossier, isEditing, userRole]);

  useEffect(() => {
    if (!isEditing && userRole === 'agent_phoner' && selectedAgentPhoner === "none") {
      const currentAgent = agents.find(a => a.role === 'agent_phoner');
      if (currentAgent) {
        console.log("[DossierFormState] Auto-assigning phoner agent:", currentAgent.id);
        setSelectedAgentPhoner(currentAgent.id);
      }
    }
  }, [isEditing, userRole, selectedAgentPhoner]);

  useEffect(() => {
    if (dossier?.dateRdv) {
      const date = new Date(dossier.dateRdv);
      setDateRdv(date.toISOString().split('T')[0]);
      console.log("[DossierFormState] Setting date:", date.toISOString().split('T')[0]);
    }
  }, [dossier]);

  return {
    formValues: {
      selectedClient,
      selectedAgentPhoner,
      selectedAgentVisio,
      status,
      notes,
      selectedOffres,
      montant,
      dateRdv,
    },
    formErrors: {
      formError,
      clientError,
      setFormError,
      setClientError,
    },
    formUpdaters: {
      setSelectedClient,
      setSelectedAgentPhoner,
      setSelectedAgentVisio,
      setStatus,
      setNotes,
      setSelectedOffres,
      setMontant,
      setDateRdv,
    },
    agents: {
      phonerAgents,
      visioAgents,
    }
  };
};
