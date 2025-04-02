
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOffre } from "@/services/offreService";
import { Offre } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CreateOffreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOffreCreated: (offre: Offre) => void;
}

const CreateOffreDialog: React.FC<CreateOffreDialogProps> = ({
  open,
  onOpenChange,
  onOffreCreated,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État local pour stocker les valeurs du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    type: "SEO" as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
    prix: 0
  });

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
      const newOffre = await createOffre({
        nom: formData.nom,
        description: formData.description,
        type: formData.type,
        prix: formData.prix
      });
      
      if (newOffre) {
        onOffreCreated(newOffre);
        onOpenChange(false);
        
        // Réinitialiser le formulaire
        setFormData({
          nom: "",
          description: "",
          type: "SEO" as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
          prix: 0
        });
        
        toast({
          title: "Succès",
          description: "L'offre a été créée avec succès.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'offre:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer l'offre. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle offre</DialogTitle>
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
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer l'offre"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOffreDialog;
