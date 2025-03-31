
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle2, ShoppingCart } from "lucide-react";

interface OfferCardProps {
  category: string;
  title: string;
  price: string;
  setupFee?: string;
  features: {
    title: string;
    items: string[];
  }[];
}

const OfferCard: React.FC<OfferCardProps> = ({
  category,
  title,
  price,
  setupFee,
  features,
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      category,
      title,
      price,
      setupFee,
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-lg font-semibold text-primary">
          {price}
        </CardDescription>
        {setupFee && (
          <CardDescription className="text-sm">
            {setupFee}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible className="w-full">
          {features.map((feature, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-sm font-medium">
                {feature.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 mt-2 text-sm">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          variant="default"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;
