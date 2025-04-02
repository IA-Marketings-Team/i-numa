
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Offre, OffreSection } from "@/types";
import { Badge } from "@/components/ui/badge";

interface OffreDetailCardProps {
  offre: Offre;
}

const OffreDetailCard: React.FC<OffreDetailCardProps> = ({ offre }) => {
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleAddToCart = () => {
    addToCart({
      offreId: offre.id,
      quantity: 1,
      nom: offre.nom,
      description: offre.description,
      type: offre.type,
      prix: offre.prix,
    });

    toast({
      title: "Ajouté au panier",
      description: `${offre.nom} a été ajouté à votre panier.`,
    });
  };

  // Déterminer l'icône en fonction du type d'offre
  const getIconClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "e-réputation":
        return "text-blue-500";
      case "deliver":
        return "text-green-500";
      case "facebook/instagram ads":
        return "text-purple-500";
      case "google ads":
        return "text-yellow-500";
      case "seo":
        return "text-red-500";
      case "email x":
        return "text-teal-500";
      default:
        return "text-indigo-500";
    }
  };

  return (
    <Card className="lnk-product-pricing-card h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <div className="flex flex-col space-y-1">
          <Badge variant="outline" className={`self-start ${getIconClass(offre.type)}`}>
            {offre.type}
          </Badge>
          <h3 className="text-xl font-bold">{offre.nom}</h3>
          <p className="text-sm">
            <em>À partir de</em> <strong>{offre.prixMensuel}</strong> HT/mois
          </p>
          {offre.fraisCreation && (
            <small className="text-xs text-gray-600 dark:text-gray-400">
              <strong>{offre.fraisCreation}</strong> HT de Frais de création
            </small>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {offre.sections?.map((section) => {
          const isOpen = openSections[section.id] ?? section.estOuvertParDefaut;
          return (
            <div key={section.id} className="border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 flex justify-between items-center text-left font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {section.titre}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900">
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
      <div className="p-4 border-t mt-auto">
        <Button
          variant={isInCart(offre.id) ? "outline" : "default"}
          size="sm"
          onClick={handleAddToCart}
          disabled={isInCart(offre.id)}
          className="w-full"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isInCart(offre.id) ? "Déjà dans le panier" : "Ajouter au panier"}
        </Button>
      </div>
    </Card>
  );
};

export default OffreDetailCard;
