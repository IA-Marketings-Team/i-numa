
import React from 'react';
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface OffreDetailCardProps {
  offreId: string;
  nom: string;
  description: string;
  type: "E-réputation" | "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis" | "Deliver" | "Facebook/Instagram Ads";
  prix: number;
  prixMensuel: string;
  fraisCreation: string;
}

const OffreDetailCard: React.FC<OffreDetailCardProps> = ({
  offreId,
  nom,
  description,
  type,
  prix,
  prixMensuel,
  fraisCreation
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      offreId: offreId,
      title: nom,
      category: type,
      price: prix.toString(),
      quantity: 1
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{nom}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Type:</span>
            <span>{type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Prix:</span>
            <span>{prix} €</span>
          </div>
          {prixMensuel && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Prix mensuel:</span>
              <span>{prixMensuel}</span>
            </div>
          )}
          {fraisCreation && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Frais de création:</span>
              <span>{fraisCreation}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full" onClick={handleAddToCart}>
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OffreDetailCard;
