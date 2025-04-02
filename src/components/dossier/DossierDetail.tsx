
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Dossier, RendezVous } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, Calendar, PenSquare, FileCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useDossier } from "@/contexts/DossierContext";

// Fonction pour formater une date en français
const formatDate = (date?: Date) => {
  if (!date) return "Non définie";
  return format(new Date(date), "d MMMM yyyy", { locale: fr });
};

// Fonction pour formater une date et heure en français
const formatDateTime = (date?: Date) => {
  if (!date) return "Non définie";
  return format(new Date(date), "d MMMM yyyy à HH:mm", { locale: fr });
};

// Mapping des statuts pour l'affichage
const statusLabels: Record<string, { label: string; color: string }> = {
  prospect: { label: "Prospect", color: "bg-blue-100 text-blue-800" },
  rdv_en_cours: { label: "RDV en cours", color: "bg-yellow-100 text-yellow-800" },
  valide: { label: "Validé", color: "bg-green-100 text-green-800" },
  signe: { label: "Signé", color: "bg-purple-100 text-purple-800" },
  archive: { label: "Archivé", color: "bg-gray-100 text-gray-800" },
};

interface DossierDetailProps {
  dossier: Dossier;
}

const DossierDetail: React.FC<DossierDetailProps> = ({ dossier }) => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { getRendezVousByDossierId } = useDossier();
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les rendez-vous associés à ce dossier
  useEffect(() => {
    const loadRendezVous = async () => {
      try {
        setLoading(true);
        const rdvs = await getRendezVousByDossierId(dossier.id);
        setRendezVous(rdvs);
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRendezVous();
  }, [dossier.id, getRendezVousByDossierId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Détails du dossier</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/dossiers")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour à la liste
          </Button>
          {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']) && (
            <Button 
              onClick={() => navigate(`/dossiers/${dossier.id}/edit`)}
              className="flex items-center gap-2"
            >
              <PenSquare className="w-4 h-4" />
              Modifier
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations client */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Informations client</span>
              <Badge className={statusLabels[dossier.status]?.color || "bg-gray-100"}>
                {statusLabels[dossier.status]?.label || dossier.status}
              </Badge>
            </CardTitle>
            <CardDescription>Détails du client associé à ce dossier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Nom :</span> {dossier.client.nom}
            </div>
            <div>
              <span className="font-medium">Prénom :</span> {dossier.client.prenom}
            </div>
            <div>
              <span className="font-medium">Email :</span> {dossier.client.email}
            </div>
            <div>
              <span className="font-medium">Téléphone :</span> {dossier.client.telephone}
            </div>
            {dossier.client.adresse && (
              <div>
                <span className="font-medium">Adresse :</span> {dossier.client.adresse}
              </div>
            )}
            <div>
              <span className="font-medium">Secteur d'activité :</span> {dossier.client.secteurActivite}
            </div>
            <div>
              <span className="font-medium">Type d'entreprise :</span> {dossier.client.typeEntreprise}
            </div>
          </CardContent>
        </Card>

        {/* Détails du dossier */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi du dossier</CardTitle>
            <CardDescription>Étapes et dates clés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Date de création :</span> {formatDate(dossier.dateCreation)}
            </div>
            <div>
              <span className="font-medium">Dernière mise à jour :</span> {formatDate(dossier.dateMiseAJour)}
            </div>
            {dossier.dateRdv && (
              <div>
                <span className="font-medium">Date de rendez-vous :</span> {formatDate(dossier.dateRdv)}
              </div>
            )}
            {dossier.dateValidation && (
              <div>
                <span className="font-medium">Date de validation :</span> {formatDate(dossier.dateValidation)}
              </div>
            )}
            {dossier.dateSignature && (
              <div>
                <span className="font-medium">Date de signature :</span> {formatDate(dossier.dateSignature)}
              </div>
            )}
            {dossier.dateArchivage && (
              <div>
                <span className="font-medium">Date d'archivage :</span> {formatDate(dossier.dateArchivage)}
              </div>
            )}
          </CardContent>
          <CardFooter>
            {dossier.status === "rdv_en_cours" && hasPermission(['agent_phoner', 'agent_visio']) && (
              <Button 
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
                onClick={() => navigate(`/dossiers/${dossier.id}/rendez-vous/nouveau`)}
              >
                <Calendar className="w-4 h-4" />
                Planifier un rendez-vous
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Offres et montant */}
        <Card>
          <CardHeader>
            <CardTitle>Offres et détails financiers</CardTitle>
            <CardDescription>Services souscrits et montant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Offres souscrites :</span>
              {dossier.offres && dossier.offres.length > 0 ? (
                <ul className="list-disc pl-5 mt-2">
                  {dossier.offres.map((offre, index) => (
                    <li key={index}>{offre.nom} - {offre.type}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">Aucune offre sélectionnée</p>
              )}
            </div>
            
            <Separator className="my-2" />
            
            {hasPermission(['superviseur', 'responsable']) && (
              <div>
                <span className="font-medium">Montant total :</span>{" "}
                {dossier.montant ? `${dossier.montant.toLocaleString()} €` : "Non défini"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {dossier.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line">{dossier.notes}</div>
          </CardContent>
        </Card>
      )}

      {/* Rendez-vous associés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Rendez-vous</span>
            {hasPermission(['agent_phoner', 'agent_visio']) && (
              <Button 
                onClick={() => navigate(`/dossiers/${dossier.id}/rendez-vous/nouveau`)}
                className="flex items-center gap-2"
                size="sm"
              >
                <Calendar className="w-4 h-4" />
                Nouveau rendez-vous
              </Button>
            )}
          </CardTitle>
          <CardDescription>Historique des rendez-vous pour ce dossier</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Chargement des rendez-vous...</div>
          ) : rendezVous.length === 0 ? (
            <div className="text-center py-4 text-gray-500">Aucun rendez-vous planifié</div>
          ) : (
            <Table>
              <TableCaption>Liste des rendez-vous pour ce dossier.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date et heure</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rendezVous.map((rdv) => (
                  <TableRow key={rdv.id}>
                    <TableCell>{formatDateTime(rdv.date)}</TableCell>
                    <TableCell>
                      {rdv.honore ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Honoré
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Non honoré
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{rdv.notes || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/dossiers/${dossier.id}/rendez-vous/${rdv.id}`)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Agents assignés */}
      {hasPermission(['superviseur', 'responsable']) && (
        <Card>
          <CardHeader>
            <CardTitle>Agents assignés</CardTitle>
            <CardDescription>Agents assignés à ce dossier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Agent Phoner</h3>
                {dossier.agentPhonerId ? (
                  <div className="rounded-md border p-4">
                    {dossier.agentPhonerId}
                    {/* À compléter avec les informations de l'agent Phoner une fois disponibles */}
                  </div>
                ) : (
                  <div className="text-gray-500">Aucun agent Phoner assigné</div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Agent Visio</h3>
                {dossier.agentVisioId ? (
                  <div className="rounded-md border p-4">
                    {dossier.agentVisioId}
                    {/* À compléter avec les informations de l'agent Visio une fois disponibles */}
                  </div>
                ) : (
                  <div className="text-gray-500">Aucun agent Visio assigné</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {dossier.status !== 'archive' && hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']) && (
        <div className="flex justify-center mt-6">
          <Button 
            onClick={() => navigate(`/dossiers/${dossier.id}/edit`)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PenSquare className="w-4 h-4" />
            Modifier ce dossier
          </Button>
        </div>
      )}
      
      {dossier.status === 'valide' && hasPermission(['superviseur', 'responsable']) && (
        <div className="flex justify-center mt-6">
          <Button 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <FileCheck className="w-4 h-4" />
            Marquer comme signé
          </Button>
        </div>
      )}
    </div>
  );
};

export default DossierDetail;
