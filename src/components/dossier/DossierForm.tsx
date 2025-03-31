
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useDossier } from "@/contexts/DossierContext";
import { Client, Dossier, DossierStatus, Offre } from "@/types";
import { clients, agents, offres as mockOffres } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

interface DossierFormProps {
  dossier?: Dossier;
  isEditing?: boolean;
}

const DossierForm: React.FC<DossierFormProps> = ({ dossier, isEditing = false }) => {
  const navigate = useNavigate();
  const { addDossier, updateDossier } = useDossier();
  const { hasPermission } = useAuth();
  
  const [selectedClient, setSelectedClient] = useState<string>(dossier?.clientId || "");
  const [selectedAgentPhoner, setSelectedAgentPhoner] = useState<string>(dossier?.agentPhonerId || "");
  const [selectedAgentVisio, setSelectedAgentVisio] = useState<string>(dossier?.agentVisioId || "");
  const [status, setStatus] = useState<DossierStatus>(dossier?.status || "prospect");
  const [notes, setNotes] = useState<string>(dossier?.notes || "");
  const [selectedOffres, setSelectedOffres] = useState<string[]>(
    dossier?.offres.map(o => o.id) || []
  );
  const [montant, setMontant] = useState<number | undefined>(dossier?.montant);
  const [dateRdv, setDateRdv] = useState<string>("");

  // Filtrer les agents par rôle
  const phonerAgents = agents.filter(a => a.role === "agent_phoner");
  const visioAgents = agents.filter(a => a.role === "agent_visio");

  // Formater la date pour l'input
  useEffect(() => {
    if (dossier?.dateRdv) {
      const date = new Date(dossier.dateRdv);
      setDateRdv(date.toISOString().split('T')[0]);
    }
  }, [dossier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trouver le client sélectionné
    const client = clients.find(c => c.id === selectedClient);
    if (!client) return;

    // Trouver les offres sélectionnées
    const offresToAdd = mockOffres.filter(o => selectedOffres.includes(o.id));
    
    if (isEditing && dossier) {
      // Mise à jour d'un dossier existant
      updateDossier(dossier.id, {
        clientId: selectedClient,
        client: client as Client,
        agentPhonerId: selectedAgentPhoner || undefined,
        agentVisioId: selectedAgentVisio || undefined,
        status,
        offres: offresToAdd,
        dateRdv: dateRdv ? new Date(dateRdv) : undefined,
        notes,
        montant
      });
    } else {
      // Création d'un nouveau dossier
      addDossier({
        clientId: selectedClient,
        client: client as Client,
        agentPhonerId: selectedAgentPhoner || undefined,
        agentVisioId: selectedAgentVisio || undefined,
        status,
        offres: offresToAdd,
        dateRdv: dateRdv ? new Date(dateRdv) : undefined,
        notes,
        montant
      });
    }

    navigate("/dossiers");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Modifier le dossier" : "Créer un nouveau dossier"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sélection du client */}
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select
              value={selectedClient}
              onValueChange={setSelectedClient}
              disabled={isEditing}
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nom} {client.prenom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statut du dossier */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as DossierStatus)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="rdv_en_cours">RDV En Cours</SelectItem>
                <SelectItem value="valide">Validé</SelectItem>
                <SelectItem value="signe">Signé</SelectItem>
                <SelectItem value="archive">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date de rendez-vous (si statut est RDV en cours ou supérieur) */}
          {(status === "rdv_en_cours" || status === "valide" || status === "signe") && (
            <div className="space-y-2">
              <Label htmlFor="dateRdv">Date de rendez-vous</Label>
              <Input
                id="dateRdv"
                type="date"
                value={dateRdv}
                onChange={(e) => setDateRdv(e.target.value)}
              />
            </div>
          )}

          {/* Sélection des agents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agentPhoner">Agent Phoner</Label>
              <Select
                value={selectedAgentPhoner}
                onValueChange={setSelectedAgentPhoner}
              >
                <SelectTrigger id="agentPhoner">
                  <SelectValue placeholder="Sélectionner un agent phoner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {phonerAgents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.prenom} {agent.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agentVisio">Agent Visio</Label>
              <Select
                value={selectedAgentVisio}
                onValueChange={setSelectedAgentVisio}
              >
                <SelectTrigger id="agentVisio">
                  <SelectValue placeholder="Sélectionner un agent visio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {visioAgents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.prenom} {agent.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sélection des offres */}
          <div className="space-y-2">
            <Label>Offres</Label>
            <div className="border rounded-md p-4 space-y-2">
              {mockOffres.map((offre) => (
                <div key={offre.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`offre-${offre.id}`}
                    checked={selectedOffres.includes(offre.id)}
                    onCheckedChange={() => handleOffreChange(offre.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`offre-${offre.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {offre.nom} - {offre.type}
                      {hasPermission(['superviseur', 'responsable']) && offre.prix !== undefined && (
                        <span className="ml-2 text-gray-600">({offre.prix} €)</span>
                      )}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {offre.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Montant (visible uniquement pour superviseur et responsable) */}
          {hasPermission(['superviseur', 'responsable']) && (
            <div className="space-y-2">
              <Label htmlFor="montant">Montant total (€)</Label>
              <Input
                id="montant"
                type="number"
                value={montant || ""}
                onChange={(e) => setMontant(Number(e.target.value) || undefined)}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations supplémentaires..."
              rows={4}
            />
          </div>
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
