import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Info, ShoppingCart } from "lucide-react";
import { Offre } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface OffreDetailCardProps {
  offre: Offre;
}

const OffreDetailCard: React.FC<OffreDetailCardProps> = ({ offre }) => {
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Extraire les détails des sections de l'offre
  const sections = offre.sections || [];

  const handleAddToCart = () => {
    addToCart({
      offreId: offre.id,
      quantity: 1,
      nom: offre.nom,
      description: offre.description,
      type: offre.type,
      prix: offre.prix,
      prixMensuel: offre.prixMensuel,
      fraisCreation: offre.fraisCreation
    });
    
    toast({
      title: "Ajouté au panier",
      description: `${offre.nom} a été ajouté à votre panier.`
    });
  };

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
      case "e-réputation":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "deliver":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case "facebook/instagram ads":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <>
      <Card className="flex flex-col h-full transition-shadow hover:shadow-lg border border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge className={getBadgeColor(offre.type)}>
              {offre.type}
            </Badge>
            {offre.secteurActivite && (
              <Badge variant="outline" className="text-xs">
                {offre.secteurActivite}
              </Badge>
            )}
          </div>
          <CardTitle className="mt-2">{offre.nom}</CardTitle>
          <CardDescription className="mt-1 line-clamp-2">
            {offre.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow pt-2">
          <div className="flex items-baseline gap-2 mb-4">
            <div className="text-xl font-bold text-primary">
              {offre.prix ? `${offre.prix} €` : offre.prixMensuel || "Prix sur demande"}
            </div>
            {offre.prixMensuel && offre.prix && (
              <div className="text-sm text-muted-foreground">{offre.prixMensuel}</div>
            )}
          </div>
          
          {offre.fraisCreation && (
            <div className="text-sm text-muted-foreground mb-3">
              + {offre.fraisCreation} (frais d'installation)
            </div>
          )}
          
          {sections && sections.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-2">Fonctionnalités</h4>
              <ul className="space-y-1.5">
                {sections.map((section, idx) => (
                  section.items && section.items.length > 0 && 
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{section.titre}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setIsDialogOpen(true)}
          >
            <Info className="h-4 w-4 mr-1" />
            Détails
          </Button>
          
          {isClient && (
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={handleAddToCart}
              disabled={isInCart(offre.id)}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isInCart(offre.id) ? "Dans le panier" : "Ajouter"}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{offre.nom}</DialogTitle>
            <DialogDescription>
              <Badge className={`mt-2 ${getBadgeColor(offre.type)}`}>
                {offre.type}
              </Badge>
              {offre.secteurActivite && (
                <Badge variant="outline" className="ml-2 mt-2">
                  {offre.secteurActivite}
                </Badge>
              )}
              <p className="mt-3">{offre.description}</p>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-baseline gap-2 my-4">
            <div className="text-xl font-bold text-primary">
              {offre.prix ? `${offre.prix} €` : offre.prixMensuel || "Prix sur demande"}
            </div>
            {offre.prixMensuel && offre.prix && (
              <div className="text-sm text-muted-foreground">{offre.prixMensuel}</div>
            )}
          </div>
          
          {offre.fraisCreation && (
            <div className="text-sm text-muted-foreground mb-4">
              + {offre.fraisCreation} (frais d'installation)
            </div>
          )}
          
          {sections && sections.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {sections.map((section, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`section-${idx}`}
                  defaultChecked={section.estOuvertParDefaut}
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    {section.titre}
                  </AccordionTrigger>
                  <AccordionContent>
                    {section.items && section.items.length > 0 && (
                      <ul className="space-y-1.5 py-2">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-1.5">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun détail supplémentaire disponible pour cette offre.</p>
          )}
          
          <DialogFooter className="mt-4 gap-2">
            {isClient && (
              <Button
                variant="default"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={() => {
                  handleAddToCart();
                  setIsDialogOpen(false);
                }}
                disabled={isInCart(offre.id)}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {isInCart(offre.id) ? "Déjà dans le panier" : "Ajouter au panier"}
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OffreDetailCard;
