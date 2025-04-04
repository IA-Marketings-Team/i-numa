
import React from 'react';
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus } from "lucide-react";

interface OffreSection {
  title: string;
  items: string[];
}

interface OffreDetailCardProps {
  offreId: string;
  nom: string;
  description: string;
  type: "E-réputation" | "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis" | "Deliver" | "Facebook/Instagram Ads";
  prix: number;
  prixMensuel: string;
  fraisCreation: string;
  onAddToCart?: () => void;
}

const OffreDetailCard: React.FC<OffreDetailCardProps> = ({
  offreId,
  nom,
  description,
  type,
  prix,
  prixMensuel,
  fraisCreation,
  onAddToCart
}) => {
  const { addToCart } = useCart();
  
  // Parse the description to extract sections with titles and lists
  const parseSections = (desc: string): OffreSection[] => {
    if (!desc) return [];
    
    // Split by double line breaks to separate potential sections
    const blocks = desc.split('\n\n').filter(block => block.trim());
    
    const sections: OffreSection[] = [];
    let currentTitle = "Description";
    let currentItems: string[] = [];
    
    blocks.forEach(block => {
      // Check if this block looks like a title (short and doesn't start with a list marker)
      const isTitle = block.length < 60 && !block.trim().startsWith('-') && !block.trim().startsWith('•');
      
      if (isTitle) {
        // If we have items from previous title, save them
        if (currentItems.length > 0) {
          sections.push({ title: currentTitle, items: [...currentItems] });
          currentItems = [];
        }
        currentTitle = block.trim();
      } else {
        // This is content, split by lines and clean up list markers
        const items = block.split('\n')
          .map(line => line.trim().replace(/^[-•]\s*/, ''))
          .filter(line => line);
        
        currentItems.push(...items);
      }
    });
    
    // Add the last section if there are items
    if (currentItems.length > 0) {
      sections.push({ title: currentTitle, items: currentItems });
    }
    
    return sections;
  };
  
  const sections = parseSections(description);

  const handleAddToCart = () => {
    addToCart({
      offreId: offreId,
      title: nom,
      category: type,
      price: prix.toString(),
      quantity: 1
    });

    // If an onAddToCart callback was provided, call it
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between">
          <span>{nom}</span>
          <span className="text-primary font-bold">{prix} €</span>
        </CardTitle>
        <div className="text-sm text-muted-foreground space-y-1">
          {prixMensuel && (
            <div className="text-xs">Prix mensuel: <span className="font-medium">{prixMensuel}</span></div>
          )}
          {fraisCreation && (
            <div className="text-xs">Frais de création: <span className="font-medium">{fraisCreation}</span></div>
          )}
          <div className="text-xs">Type: <span className="font-medium">{type}</span></div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {sections.length > 0 ? (
          <div className="space-y-2">
            {sections.map((section, index) => (
              <Collapsible key={index} className="border rounded-md">
                <CollapsibleTrigger className="flex w-full justify-between items-center p-3 hover:bg-muted/50 font-medium text-sm">
                  {section.title}
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 ui-open:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 pt-0 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full" onClick={handleAddToCart}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OffreDetailCard;
