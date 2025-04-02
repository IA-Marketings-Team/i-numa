import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dossier, DossierStatus, RendezVous } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DossierStatusBadge from "./DossierStatusBadge";
import RendezVousCard from "@/components/rendezVous/RendezVousCard";
import { 
  ChevronLeft, 
  FileEdit, 
  Calendar, 
  CheckSquare, 
  FileCheck, 
  Archive, 
  Users, 
  Mail, 
  Phone
} from "lucide-react";

interface DossierDetailProps {
  dossier: Dossier;
}

const DossierDetail: React.FC<DossierDetailProps> = ({ dossier }) => {
  const [activeTab, setActiveTab] = useState("informations");
  const [rendezVousList, setRendezVousList] = useState<RendezVous[]>([]);
  const { updateDossierStatus, getRendezVousByDossierId } = useDossier();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRendezVous = async () => {
      const rdvList = await getRendezVousByDossierId(dossier.id);
      setRendezVousList(rdvList);
    };
    
    loadRendezVous();
  }, [dossier.id, getRendezVousByDossierId]);

  const handleStatusChange = (newStatus: DossierStatus) => {
    if (window.confirm(`Êtes-vous sûr de vouloir changer le statut en "${newStatus}" ?`)) {
      updateDossierStatus(dossier.id, newStatus);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Non défini";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getAvailableActions = () => {
    if (!hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])) {
      return [];
    }
    
    const actions = [];
    
    switch (dossier.status) {
      case "prospect":
        actions.push({
          label: "Planifier RDV",
          icon: <Calendar className="w-4 h-4 mr-2" />,
          action: () => handleStatusChange("rdv_en_cours"),
          color: "bg-blue-500 hover:bg-blue-600"
        });
        break;
      case "rdv_en_cours":
        actions.push({
          label: "Valider",
          icon: <CheckSquare className="w-4 h-4 mr-2" />,
          action: () => handleStatusChange("valide"),
          color: "bg-teal-500 hover:bg-teal-600"
        });
        break;
      case "valide":
        actions.push({
          label: "Marquer comme signé",
          icon: <FileCheck className="w-4 h-4 mr-2" />,
          action: () => handleStatusChange("signe"),
          color: "bg-green-500 hover:bg-green-600"
        });
        break;
      case "signe":
        actions.push({
          label: "Archiver",
          icon: <Archive className="w-4 h-4 mr-2" />,
          action: () => handleStatusChange("archive"),
          color: "bg-gray-500 hover:bg-gray-600"
        });
        break;
    }
    
    return actions;
  };

  const canShowMontant = hasPermission(['superviseur', 'responsable']);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </Button>
        
        {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']) && (
          <Button 
            onClick={() => navigate(`/dossiers/${dossier.id}/edit`)}
            className="flex items-center gap-2"
          >
            <FileEdit className="w-4 h-4" />
            Modifier
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold">
            Dossier de {dossier.client.nom} {dossier.client.prenom}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <DossierStatusBadge status={dossier.status} />
            <span className="text-sm text-gray-600">
              Créé le {formatDate(dossier.dateCreation)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {getAvailableActions().map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              className={`flex items-center ${action.color}`}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="rendezVous">Rendez-vous</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="informations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Secteur d'activité:</strong> {dossier.client.secteurActivite}</p>
                <p><strong>Type d'entreprise:</strong> {dossier.client.typeEntreprise}</p>
                <p><strong>Besoins:</strong> {dossier.client.besoins}</p>
                {dossier.client.adresse && (
                  <p><strong>Adresse:</strong> {dossier.client.adresse}</p>
                )}
                {hasPermission(['responsable']) && dossier.client.iban && (
                  <p><strong>IBAN:</strong> {dossier.client.iban}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offres proposées</CardTitle>
              </CardHeader>
              <CardContent>
                {dossier.offres.length > 0 ? (
                  <ul className="space-y-2">
                    {dossier.offres.map((offre) => (
                      <li key={offre.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="font-medium">{offre.nom}</div>
                        <div className="text-sm text-gray-600">{offre.description}</div>
                        {canShowMontant && offre.prix !== undefined && (
                          <div className="text-right font-semibold">{offre.prix} €</div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Aucune offre associée à ce dossier</p>
                )}
                
                {canShowMontant && dossier.montant && (
                  <div className="mt-4 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Montant total:</span>
                      <span className="font-bold text-lg">{dossier.montant} €</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coordonnées client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>{dossier.client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>{dossier.client.telephone}</span>
              </div>
            </CardContent>
          </Card>

          {(dossier.agentPhonerId || dossier.agentVisioId) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agents assignés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dossier.agentPhonerId && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>Agent Phoner: {dossier.agentPhonerId}</span>
                  </div>
                )}
                {dossier.agentVisioId && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>Agent Visio: {dossier.agentVisioId}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="rendezVous" className="space-y-4">
          {rendezVousList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {rendezVousList.map((rdv) => (
                <RendezVousCard 
                  key={rdv.id} 
                  rendezVous={rdv} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-muted-foreground mb-4">
                  Aucun rendez-vous planifié pour ce dossier.
                </p>
                {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']) && (
                  <Button 
                    onClick={() => navigate(`/dossiers/${dossier.id}/rendez-vous/nouveau`)}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Planifier un rendez-vous
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique du dossier</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <div className="font-medium">Création du dossier</div>
                    <div className="text-sm text-gray-600">{formatDate(dossier.dateCreation)}</div>
                  </div>
                </li>
                
                {dossier.dateRdv && (
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <div className="font-medium">Rendez-vous planifié</div>
                      <div className="text-sm text-gray-600">{formatDate(dossier.dateRdv)}</div>
                    </div>
                  </li>
                )}
                
                {dossier.dateValidation && (
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2"></div>
                    <div>
                      <div className="font-medium">Dossier validé</div>
                      <div className="text-sm text-gray-600">{formatDate(dossier.dateValidation)}</div>
                    </div>
                  </li>
                )}
                
                {dossier.dateSignature && (
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <div className="font-medium">Contrat signé</div>
                      <div className="text-sm text-gray-600">{formatDate(dossier.dateSignature)}</div>
                    </div>
                  </li>
                )}
                
                {dossier.dateArchivage && (
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-gray-500 mt-2"></div>
                    <div>
                      <div className="font-medium">Dossier archivé</div>
                      <div className="text-sm text-gray-600">{formatDate(dossier.dateArchivage)}</div>
                    </div>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DossierDetail;
