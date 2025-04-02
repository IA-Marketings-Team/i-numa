
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateOffre } from "@/services/offreService";
import { Offre } from "@/types";

interface EditOffreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offre: Offre;
}

const EditOffreDialog: React.FC<EditOffreDialogProps> = ({
  open,
  onOpenChange,
  offre
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: offre.nom,
    description: offre.description || "",
    type: offre.type,
    prix: offre.prix !== undefined ? String(offre.prix) : ""
  });
  
  const offreTypes = ["SEO", "Google Ads", "Email X", "Foner", "Devis"];

  // Mettre à jour le formulaire si l'offre change
  useEffect(() => {
    setFormData({
      nom: offre.nom,
      description: offre.description || "",
      type: offre.type,
      prix: offre.prix !== undefined ? String(offre.prix) : ""
    });
  }, [offre]);

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
      
      // Mettre à jour l'offre
      const success = await updateOffre(offre.id, offreData);
      
      if (success) {
        toast({
          title: "Offre mise à jour",
          description: "L'offre a été mise à jour avec succès."
        });
        
        // Mettre à jour l'offre localement
        Object.assign(offre, offreData);
        
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating offre:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'offre."
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
              {isSubmitting ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOffreDialog;
