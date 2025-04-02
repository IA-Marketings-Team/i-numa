
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateOffre, fetchSecteurs } from "@/services/offreService";
import { Offre, SecteurActivite } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface EditOffreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offre: Offre;
}

const EditOffreDialog: React.FC<EditOffreDialogProps> = ({
  open,
  onOpenChange,
  offre,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secteurs, setSecteurs] = useState<SecteurActivite[]>([]);
  const [loading, setLoading] = useState(false);
  
  // État local pour stocker les valeurs du formulaire
  const [formData, setFormData] = useState({
    nom: offre.nom,
    description: offre.description,
    type: offre.type,
    prix: offre.prix || 0,
    selectedSecteurs: [] as string[] // IDs des secteurs sélectionnés
  });

  // Mettre à jour le formulaire lorsque l'offre change
  useEffect(() => {
    setFormData({
      nom: offre.nom,
      description: offre.description,
      type: offre.type,
      prix: offre.prix || 0,
      selectedSecteurs: offre.secteurs?.map(s => s.id) || []
    });
  }, [offre]);

  // Fetch sectors when the dialog opens
  useEffect(() => {
    if (open) {
      const loadSecteurs = async () => {
        setLoading(true);
        try {
          const data = await fetchSecteurs();
          setSecteurs(data);
        } catch (error) {
          console.error("Erreur lors du chargement des secteurs:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les secteurs d'activité."
          });
        } finally {
          setLoading(false);
        }
      };
      
      loadSecteurs();
    }
  }, [open, toast]);

  // Gérer les changements dans les champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "prix" ? Number(value) : value,
    });
  };

  // Gérer le changement du type d'offre
  const handleTypeChange = (value: "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis") => {
    setFormData({
      ...formData,
      type: value,
    });
  };

  // Gérer la sélection/désélection d'un secteur
  const handleSecteurChange = (secteurId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedSecteurs.includes(secteurId);
      
      if (isSelected) {
        // Désélectionner le secteur
        return {
          ...prev,
          selectedSecteurs: prev.selectedSecteurs.filter(id => id !== secteurId)
        };
      } else {
        // Sélectionner le secteur
        return {
          ...prev,
          selectedSecteurs: [...prev.selectedSecteurs, secteurId]
        };
      }
    });
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de l'offre est requis."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Préparer les secteurs pour l'offre
      const offreSecteurs = secteurs
        .map(secteur => ({
          id: secteur.id,
          nom: secteur.nom,
          description: secteur.description,
          disponible: formData.selectedSecteurs.includes(secteur.id)
        }));
      
      const success = await updateOffre(offre.id, {
        nom: formData.nom,
        description: formData.description,
        type: formData.type,
        prix: formData.prix,
        secteurs: offreSecteurs
      });
      
      if (success) {
        onOpenChange(false);
        
        toast({
          title: "Succès",
          description: "L'offre a été mise à jour avec succès.",
        });
        
        // Recharger la page pour afficher les modifications
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'offre:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'offre. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l'offre</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nom" className="text-right">
                Nom
              </Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleTypeChange(value as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEO">SEO</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="Email X">Email X</SelectItem>
                  <SelectItem value="Foner">Foner</SelectItem>
                  <SelectItem value="Devis">Devis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prix" className="text-right">
                Prix (€)
              </Label>
              <Input
                id="prix"
                name="prix"
                type="number"
                min="0"
                value={formData.prix}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Secteurs d'activité
              </Label>
              <div className="col-span-3">
                {loading ? (
                  <div className="text-center p-4">Chargement des secteurs...</div>
                ) : secteurs.length > 0 ? (
                  <ScrollArea className="h-[200px] border rounded-md p-4">
                    <div className="space-y-2">
                      {secteurs.map((secteur) => (
                        <div key={secteur.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={`secteur-${secteur.id}`}
                            checked={formData.selectedSecteurs.includes(secteur.id)}
                            onCheckedChange={() => handleSecteurChange(secteur.id)}
                          />
                          <div>
                            <label
                              htmlFor={`secteur-${secteur.id}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {secteur.nom}
                            </label>
                            {secteur.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {secteur.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center p-4 border rounded-md">
                    Aucun secteur d'activité disponible
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour en cours..." : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOffreDialog;
