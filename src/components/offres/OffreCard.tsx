
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Offre } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import EditOffreDialog from "./EditOffreDialog";

interface OffreCardProps {
  offre: Offre;
  onDelete: (id: string) => Promise<void>;
}

const OffreCard: React.FC<OffreCardProps> = ({ offre, onDelete }) => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Déterminer la couleur du badge en fonction du type d'offre
  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "seo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "google ads":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "email x":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "foner":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "devis":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const handleDelete = async () => {
    await onDelete(offre.id);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge className={`${getBadgeColor(offre.type)}`}>
              {offre.type}
            </Badge>
            {offre.prix !== undefined && (
              <span className="font-bold">{offre.prix} €</span>
            )}
          </div>
          <CardTitle>{offre.nom}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {offre.description.length > 120 
              ? `${offre.description.substring(0, 120)}...` 
              : offre.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" onClick={() => setIsViewOpen(true)}>
            <Eye className="mr-1 h-4 w-4" /> Voir
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
              <Edit className="mr-1 h-4 w-4" /> Modifier
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteConfirmOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Dialogue de visualisation */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{offre.nom}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Badge className={`${getBadgeColor(offre.type)}`}>
                {offre.type}
              </Badge>
              {offre.prix !== undefined && (
                <span className="font-bold ml-2">{offre.prix} €</span>
              )}
            </div>
            <p>{offre.description}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer l'offre "{offre.nom}" ? Cette action est irréversible.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de modification */}
      <EditOffreDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        offre={offre} 
      />
    </>
  );
};

export default OffreCard;
