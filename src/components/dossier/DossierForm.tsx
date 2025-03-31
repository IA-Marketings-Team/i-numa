
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dossier, UserRole } from "@/types";
import { useDossierForm } from "@/hooks/useDossierForm";

// Import the smaller components
import ClientSelector from "./ClientSelector";
import StatusSelector from "./StatusSelector";
import DateRdvInput from "./DateRdvInput";
import AgentSelectors from "./AgentSelectors";
import OffresSelector from "./OffresSelector";
import MontantInput from "./MontantInput";
import NotesInput from "./NotesInput";

interface DossierFormProps {
  dossier?: Dossier;
  isEditing?: boolean;
  userRole?: UserRole;
}

const DossierForm: React.FC<DossierFormProps> = ({ dossier, isEditing = false, userRole }) => {
  const {
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
    montant,
    setMontant,
    dateRdv,
    setDateRdv,
    handleSubmit,
    handleOffreChange,
    phonerAgents,
    visioAgents,
    hasPermission,
    navigate
  } = useDossierForm({ dossier, isEditing, userRole });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Modifier le dossier" : "Créer un nouveau dossier"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sélection du client */}
          <ClientSelector 
            selectedClient={selectedClient} 
            onClientChange={setSelectedClient} 
            disabled={isEditing}
          />

          {/* Statut du dossier */}
          <StatusSelector 
            status={status} 
            onStatusChange={setStatus}
          />

          {/* Date de rendez-vous (si statut est RDV en cours ou supérieur) */}
          {(status === "rdv_en_cours" || status === "valide" || status === "signe") && (
            <DateRdvInput 
              dateRdv={dateRdv} 
              onDateRdvChange={setDateRdv}
            />
          )}

          {/* Sélection des agents */}
          <AgentSelectors 
            phonerAgents={phonerAgents}
            visioAgents={visioAgents}
            selectedAgentPhoner={selectedAgentPhoner}
            selectedAgentVisio={selectedAgentVisio}
            onPhonerChange={setSelectedAgentPhoner}
            onVisioChange={setSelectedAgentVisio}
            isPhonerDisabled={userRole === 'agent_phoner'}
          />

          {/* Sélection des offres */}
          <OffresSelector 
            selectedOffres={selectedOffres}
            onOffreChange={handleOffreChange}
            hasPermission={hasPermission}
          />

          {/* Montant (visible uniquement pour superviseur et responsable) */}
          {hasPermission(['superviseur', 'responsable']) && (
            <MontantInput 
              montant={montant} 
              onMontantChange={setMontant}
            />
          )}

          {/* Notes */}
          <NotesInput 
            notes={notes} 
            onNotesChange={setNotes}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button type="submit">
            {isEditing ? "Enregistrer les modifications" : "Créer le dossier"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default DossierForm;
