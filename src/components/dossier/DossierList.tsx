
import React, { useState } from "react";
import { Dossier } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DossierStatusBadge from "./DossierStatusBadge";
import { useDossier } from "@/contexts/DossierContext";
import { Eye, FileEdit, Trash2, Calendar, PhoneCall } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface DossierListProps {
  dossiers: Dossier[];
  showActions?: boolean;
}

const DossierList: React.FC<DossierListProps> = ({ dossiers, showActions = true }) => {
  const navigate = useNavigate();
  const { setCurrentDossier, deleteDossier, updateDossier } = useDossier();
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  
  const [deletingDossier, setDeletingDossier] = useState<Dossier | null>(null);
  const [callingDossier, setCallingDossier] = useState<Dossier | null>(null);
  const [callNotes, setCallNotes] = useState("");

  const handleView = (dossier: Dossier) => {
    setCurrentDossier(dossier);
    navigate(`/dossiers/${dossier.id}`);
  };

  const handleEdit = (dossier: Dossier) => {
    setCurrentDossier(dossier);
    navigate(`/dossiers/${dossier.id}/edit`);
  };

  const handleDelete = () => {
    if (deletingDossier) {
      deleteDossier(deletingDossier.id);
      toast({
        title: "Dossier supprimé",
        description: "Le dossier a été supprimé avec succès"
      });
      setDeletingDossier(null);
    }
  };

  const handleCallComplete = () => {
    if (callingDossier) {
      // Mise à jour des notes du dossier avec les notes d'appel
      updateDossier(callingDossier.id, {
        notes: callingDossier.notes 
          ? `${callingDossier.notes}\n\nAppel du ${new Date().toLocaleDateString()} : ${callNotes}` 
          : `Appel du ${new Date().toLocaleDateString()} : ${callNotes}`
      });
      
      toast({
        title: "Appel enregistré",
        description: "Les notes d'appel ont été ajoutées au dossier"
      });
      
      setCallingDossier(null);
      setCallNotes("");
    }
  };

  const handleNewRdv = (dossier: Dossier) => {
    navigate(`/dossiers/${dossier.id}/rendez-vous/nouveau`);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  // Déterminer la classe de carte en fonction du rôle de l'utilisateur
  const getCardClass = () => {
    if (!user) return "";
    
    switch (user.role) {
      case "client":
        return "card-client";
      case "agent_phoner":
        return "card-phoner";
      case "agent_visio":
        return "card-visio";
      case "superviseur":
        return "card-supervisor";
      case "responsable":
        return "card-manager";
      default:
        return "";
    }
  };

  if (dossiers.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Aucun dossier trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dossiers.map((dossier) => (
        <Card key={dossier.id} className={`shadow-sm hover:shadow transition-shadow ${getCardClass()}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h3 className="font-semibold text-lg">
                    {dossier.client.nom} {dossier.client.prenom}
                  </h3>
                  <DossierStatusBadge status={dossier.status} />
                </div>
                <p className="text-sm text-gray-600">
                  {dossier.client.secteurActivite} • {dossier.client.typeEntreprise}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p>Création: {formatDate(dossier.dateCreation)}</p>
                  {dossier.dateRdv && (
                    <p>RDV: {formatDate(dossier.dateRdv)}</p>
                  )}
                  {dossier.dateValidation && (
                    <p>Validation: {formatDate(dossier.dateValidation)}</p>
                  )}
                  {dossier.dateSignature && (
                    <p>Signature: {formatDate(dossier.dateSignature)}</p>
                  )}
                </div>
                {dossier.offres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dossier.offres.map((offre) => (
                      <span key={offre.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {offre.type}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {showActions && (
                <div className="flex flex-row sm:flex-row gap-2 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(dossier)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="sm:block hidden">Voir</span>
                  </Button>
                  
                  {hasPermission(['agent_phoner', 'agent_visio']) && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCallingDossier(dossier)}
                        className="flex items-center gap-1"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span className="sm:block hidden">Appeler</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNewRdv(dossier)}
                        className="flex items-center gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="sm:block hidden">RDV</span>
                      </Button>
                    </>
                  )}
                  
                  {hasPermission(['agent_phoner', 'agent_visio', 'superviseur', 'responsable']) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(dossier)}
                      className="flex items-center gap-1"
                    >
                      <FileEdit className="w-4 h-4" />
                      <span className="sm:block hidden">Modifier</span>
                    </Button>
                  )}
                  
                  {hasPermission(['superviseur', 'responsable']) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingDossier(dossier)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:block hidden">Supprimer</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Dialog de confirmation de suppression */}
      <Dialog open={!!deletingDossier} onOpenChange={(open) => !open && setDeletingDossier(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Êtes-vous sûr de vouloir supprimer le dossier de {deletingDossier?.client.prenom} {deletingDossier?.client.nom} ? 
            Cette action est irréversible et supprimera également tous les rendez-vous associés.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingDossier(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour l'appel téléphonique */}
      <Dialog open={!!callingDossier} onOpenChange={(open) => !open && setCallingDossier(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Appel à {callingDossier?.client.prenom} {callingDossier?.client.nom}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium text-sm">Numéro de téléphone</p>
              <p className="text-lg">{callingDossier?.client.telephone}</p>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-sm">Notes d'appel</p>
              <Textarea 
                placeholder="Entrez les détails de votre appel ici..."
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCallingDossier(null)}>Annuler</Button>
            <Button onClick={handleCallComplete}>Terminer l'appel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DossierList;
