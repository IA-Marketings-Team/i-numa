
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send } from "lucide-react";
import { OfferCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface EmailOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: OfferCategory[];
}

const EmailOfferDialog: React.FC<EmailOfferDialogProps> = ({ 
  open, 
  onOpenChange,
  categories 
}) => {
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !selectedCategory) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simuler l'envoi d'un email (dans une application réelle, ce serait une requête API)
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      
      toast({
        title: "Email envoyé avec succès",
        description: `Les offres de ${selectedCategory} ont été envoyées à ${email}.`,
      });
      
      // Réinitialiser le formulaire
      setEmail("");
      setSelectedCategory("");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envoyer des offres par email
          </DialogTitle>
          <DialogDescription>
            Sélectionnez une catégorie d'offres et entrez l'adresse email du client.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie d'offres</Label>
            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.label} value={category.label}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email du client</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="ml-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  Envoi en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> Envoyer
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailOfferDialog;
