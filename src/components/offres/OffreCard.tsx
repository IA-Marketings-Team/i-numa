
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Briefcase, ShoppingBag, Receipt } from 'lucide-react';
import { Offre } from '@/types';
import EditOffreDialog from './EditOffreDialog';

interface OffreCardProps {
  offre: Offre;
  onDelete: (id: string) => void;
  isEditable?: boolean;
}

const OffreCard: React.FC<OffreCardProps> = ({ offre, onDelete, isEditable = false }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(offre.id);
    setIsDeleteDialogOpen(false);
  };

  // Fonction pour générer une couleur de badge en fonction du type
  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'seo':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'google ads':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'email x':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'foner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'devis':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'e-réputation':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'deliver':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'facebook/instagram ads':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-bold text-lg">{offre.nom}</h3>
              <Badge className={`mt-1 ${getBadgeColor(offre.type)}`}>
                {offre.type}
              </Badge>
            </div>
            {offre.prix && (
              <div className="text-right">
                <span className="text-xl font-bold">{offre.prix} €</span>
                {offre.prixMensuel && (
                  <div className="text-xs text-muted-foreground">{offre.prixMensuel}</div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{offre.description}</p>
          
          {(offre.secteurs && offre.secteurs.length > 0) && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1 text-xs">
                {offre.secteurs.map(secteur => (
                  <div key={secteur.id} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {secteur.nom}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-3 flex gap-2 justify-between">
          <div className="space-x-2">
            {isEditable && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit2 className="h-4 w-4 mr-1" /> Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            {offre.fraisCreation && (
              <div className="flex items-center ml-3">
                <Receipt className="h-3 w-3 mr-1" />
                {offre.fraisCreation}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette offre ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement l'offre "{offre.nom}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de modification */}
      {isEditable && (
        <EditOffreDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          offre={offre}
        />
      )}
    </>
  );
};

export default OffreCard;
