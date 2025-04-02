
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createOffre } from "@/services/offreService";
import { Offre } from "@/types";

interface CreateOffreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOffreCreated: (offre: Offre) => void;
}

const CreateOffreDialog: React.FC<CreateOffreDialogProps> = ({
  open,
  onOpenChange,
  onOffreCreated
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    type: "",
    prix: ""
  });
  
  const offreTypes = ["SEO", "Google Ads", "Email X", "Foner", "Devis"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nom || !formData.type) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Le nom et le type d'offre sont obligatoires."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Préparer les données avec le prix en nombre si présent
      const offreData = {
        nom: formData.nom,
        description: formData.description,
        type: formData.type,
        prix: formData.prix ? parseInt(formData.prix, 10) : undefined
      };
      
      // Créer l'offre
      const newOffre = await createOffre(offreData);
      
      if (newOffre) {
        toast({
          title: "Offre créée",
          description: "L'offre a été créée avec succès."
        });
        onOffreCreated(newOffre);
        onOpenChange(false);
        // Réinitialiser le formulaire
        setFormData({
          nom: "",
          description: "",
          type: "",
          prix: ""
        });
      }
    } catch (error) {
      console.error("Error creating offre:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer l'offre."
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'offre *</Label>
            <Input
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Pack SEO Premium"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type d'offre *</Label>
            <Select 
              value={formData.type} 
              onValueChange={handleTypeChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {offreTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description détaillée de l'offre..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prix">Prix (€)</Label>
            <Input
              id="prix"
              name="prix"
              type="number"
              min="0"
              value={formData.prix}
              onChange={handleChange}
              placeholder="499"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer l'offre"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOffreDialog;
