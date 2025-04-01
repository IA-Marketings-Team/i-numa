
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const isClient = user?.role === 'client';

  const handleAddToCart = () => {
    addToCart({
      category,
      title,
      price,
      setupFee,
    });
  };

  return (
    <Card className="h-full flex flex-col border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="pb-2 space-y-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-lg font-semibold text-primary">
          {price}
        </CardDescription>
        {setupFee && (
          <CardDescription className="text-xs">
            {setupFee}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow pt-2 pb-2">
        <Accordion type="single" collapsible className="w-full">
          {features.map((feature, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
              <AccordionTrigger className="text-xs font-medium py-1.5">
                {feature.title}
              </AccordionTrigger>
              <AccordionContent className="pt-0">
                <ul className="space-y-1 mt-1 text-xs">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      <CardFooter className="pt-0">
        {isClient && (
          <Button 
            className="w-full text-sm py-1.5" 
            onClick={handleAddToCart}
            variant="default"
            size="sm"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            Ajouter au panier
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OfferCard;
