
import { useState, useEffect } from "react";
import { Dossier, DossierStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Agent {
  id: string;
  nom: string;
  prenom: string;
  role: string;
}

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
  const { user } = useAuth();
  const [selectedClient, setSelectedClient] = useState<string>(dossier?.clientId || "");
  const [selectedAgentPhoner, setSelectedAgentPhoner] = useState<string>(dossier?.agentPhonerId || "none");
  const [selectedAgentVisio, setSelectedAgentVisio] = useState<string>(dossier?.agentVisioId || "none");
  const [status, setStatus] = useState<DossierStatus>(dossier?.status || "prospect_chaud");
  const [notes, setNotes] = useState<string>(dossier?.notes || "");
  const [selectedOffres, setSelectedOffres] = useState<string[]>(
    dossier?.offres.map(o => o.id) || []
  );
  const [montant, setMontant] = useState<number | undefined>(dossier?.montant);
  const [dateRdv, setDateRdv] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [clientError, setClientError] = useState<string>("");
  const [phonerAgents, setPhonerAgents] = useState<Agent[]>([]);
  const [visioAgents, setVisioAgents] = useState<Agent[]>([]);

  // Log initial component state
  useEffect(() => {
    console.log("[DossierFormState] Initial state:", { 
      isEditing, 
      userRole, 
      dossierExists: !!dossier,
      dossierID: dossier?.id
    });
  }, [dossier, isEditing, userRole]);

  // Charger les agents depuis Supabase
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Récupérer les agents phoner
        const { data: phonerData, error: phonerError } = await supabase
          .from('profiles')
          .select('id, nom, prenom, role')
          .eq('role', 'agent_phoner');
        
        if (phonerError) throw phonerError;
        setPhonerAgents(phonerData || []);
        
        // Récupérer les agents visio
        const { data: visioData, error: visioError } = await supabase
          .from('profiles')
          .select('id, nom, prenom, role')
          .eq('role', 'agent_visio');
        
        if (visioError) throw visioError;
        setVisioAgents(visioData || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des agents:", error);
      }
    };
    
    fetchAgents();
  }, []);

  // Auto-assigner l'agent phoner si l'utilisateur est un agent phoner
  useEffect(() => {
    if (!isEditing && userRole === 'agent_phoner' && selectedAgentPhoner === "none" && user?.id) {
      console.log("[DossierFormState] Auto-assigning phoner agent:", user.id);
      setSelectedAgentPhoner(user.id);
    }
  }, [isEditing, userRole, selectedAgentPhoner, user?.id]);

  // Formater la date de RDV
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
