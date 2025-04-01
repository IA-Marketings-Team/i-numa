
import { useEffect } from "react";
import { useDossierFormState } from "./useDossierFormState";
import { useDossierFormSubmit } from "./useDossierFormSubmit";
import { Dossier, UserRole } from "@/types";
import { mockOffres } from "@/data/mockData";

interface UseDossierFormProps {
  dossier?: Dossier;
  isEditing?: boolean;
  userRole?: UserRole;
}

export const useDossierForm = ({ dossier, isEditing = false, userRole }: UseDossierFormProps) => {
  const {
    formValues,
    formErrors,
    formUpdaters,
    agents
  } = useDossierFormState({ dossier, userRole, isEditing });

  const {
    handleSubmit,
    handleOffreChange: baseHandleOffreChange,
    navigate,
    hasPermission
  } = useDossierFormSubmit({
    isEditing,
    dossierID: dossier?.id,
    formValues,
    formErrors
  });

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

  const {
    setSelectedClient,
    setSelectedAgentPhoner,
    setSelectedAgentVisio,
    setStatus,
    setNotes,
    setSelectedOffres,
    setMontant,
    setDateRdv
  } = formUpdaters;

  const { formError, clientError } = formErrors;

  // Gérer le changement d'offre et mettre à jour le montant
  const handleOffreChange = (offreId: string) => {
    const newSelectedOffres = baseHandleOffreChange(offreId);
    setSelectedOffres(newSelectedOffres);
  };

  // Calculer le montant total en fonction des offres sélectionnées
  useEffect(() => {
    if (hasPermission(['superviseur', 'responsable'])) {
      const total = mockOffres
        .filter(o => selectedOffres.includes(o.id))
        .reduce((sum, offre) => sum + (offre.prix || 0), 0);
      
      setMontant(total > 0 ? total : undefined);
    }
  }, [selectedOffres, hasPermission, setMontant]);
  
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
    phonerAgents: agents.phonerAgents,
    visioAgents: agents.visioAgents,
    hasPermission,
    navigate,
    formError,
    clientError
  };
};
