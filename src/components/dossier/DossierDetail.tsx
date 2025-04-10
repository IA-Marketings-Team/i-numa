
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Edit, Archive, Trash2, ShoppingCart, Calendar } from "lucide-react";
import { Dossier, DossierComment, DossierStatus } from "@/types";
import StatusSelector from "@/components/dossier/StatusSelector";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import DossierStatusBadge from "./DossierStatusBadge";
import { Badge } from "@/components/ui/badge";
import DossierComments from "./DossierComments";
import { CallData } from "./LogCallModal";
import DossierCommentSection from "./DossierCommentSection";

interface DossierDetailProps {
  dossier: Dossier;
  onStatusChange: (status: DossierStatus) => Promise<void>;
  onDelete: () => Promise<void>;
  onAddComment: (content: string) => Promise<void>;
  onAddCallNote: (callData: CallData) => Promise<void>;
  loading: boolean;
  userRole?: string;
}

const DossierDetail: React.FC<DossierDetailProps> = ({
  dossier,
  onStatusChange,
  onDelete,
  onAddComment,
  onAddCallNote,
  loading,
  userRole
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const canModify = userRole === "superviseur" || userRole === "responsable";
  const canCall = userRole === "agent_phoner" || userRole === "superviseur" || userRole === "responsable";
  const canScheduleMeeting = userRole === "agent_phoner" || userRole === "agent_visio" || userRole === "superviseur" || userRole === "responsable";
  
  const handleEditClick = () => {
    navigate(`/dossiers/${dossier.id}/modifier`);
  };
  
  const handleMeetingClick = () => {
    navigate(`/dossiers/${dossier.id}/rdv`);
  };
  
  const handleMarketplaceClick = () => {
    navigate(`/marketplace`);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Non définie";
    return format(new Date(date), "PPP à HH:mm", { locale: fr });
  };

  // Fonction pour gérer l'ajout de commentaire avec option de visibilité publique
  const handleAddComment = async (content: string, isPublic: boolean = false) => {
    if (!dossier) return;
    
    try {
      // Appel à la fonction modifiée dans le contexte DossierContext
      await onAddComment(content);
      
      toast({
        title: "Commentaire ajouté",
        description: `Le commentaire a été ajouté avec succès`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du commentaire"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Dossier : {dossier.client.prenom} {dossier.client.nom}
              </CardTitle>
              <CardDescription>
                Créé le {formatDate(dossier.dateCreation)}
              </CardDescription>
            </div>
            <DossierStatusBadge status={dossier.status} />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Informations client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium">{dossier.client.prenom} {dossier.client.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{dossier.client.telephone || "Non renseigné"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{dossier.client.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <p className="font-medium">{dossier.client.adresse || "Non renseignée"}</p>
              </div>
            </div>
          </div>
          
          {dossier.dateRdv && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Rendez-vous</h3>
              <div className="bg-gray-50 p-3 rounded-md border flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="font-medium">{formatDate(dossier.dateRdv)}</p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-3 flex justify-between items-center">
              <span>Offres sélectionnées</span>
              <Button variant="outline" size="sm" onClick={handleMarketplaceClick}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>Parcourir le catalogue</span>
              </Button>
            </h3>
            {dossier.offres.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dossier.offres.map(offre => (
                  <div key={offre.id} className="border p-3 rounded-md">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="outline">{offre.type}</Badge>
                      {canModify && offre.prix && <span className="font-semibold">{offre.prix} €</span>}
                    </div>
                    <h4 className="font-medium text-sm">{offre.nom}</h4>
                    <p className="text-xs text-gray-500 mt-1">{offre.description.substring(0, 60)}...</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm bg-gray-50 p-4 rounded-md">
                Aucune offre sélectionnée pour ce dossier
              </div>
            )}
          </div>
          
          {dossier.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-md border whitespace-pre-wrap">
                {dossier.notes}
              </div>
            </div>
          )}
          
          {/* Utilisation du nouveau composant DossierCommentSection */}
          {userRole && (
            <DossierCommentSection
              comments={dossier.commentaires || []}
              userRole={userRole as any}
              onAddComment={handleAddComment}
              loading={loading}
            />
          )}
          
          {canModify && (
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-3">Modifier le statut</h3>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto">
                  <StatusSelector 
                    status={dossier.status} 
                    onStatusChange={(status) => onStatusChange(status as DossierStatus)}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Statut actuel: <span className="font-medium">{dossier.status}</span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-3 justify-between border-t pt-6">
          <div className="flex flex-wrap gap-3">
            {canScheduleMeeting && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleMeetingClick}
              >
                <Video className="h-4 w-4" />
                Planifier un RDV
              </Button>
            )}
            {canModify && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleEditClick}
              >
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
            )}
          </div>
          
          {canModify && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={() => onStatusChange("archive")}
                disabled={loading || dossier.status === "archive"}
              >
                <Archive className="h-4 w-4" />
                Archiver
              </Button>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2" 
                onClick={onDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DossierDetail;
