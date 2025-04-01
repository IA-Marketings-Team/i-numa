
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfferCategory } from "@/types";
import OfferCard from "./OfferCard";

interface OfferCategoryCardProps {
  category: OfferCategory;
}

const OfferCategoryCard: React.FC<OfferCategoryCardProps> = ({ category }) => {
  const [activeTab, setActiveTab] = useState<string>(category.offerings[0]?.title || "");
  const Icon = category.icon;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{category.label}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={category.offerings[0]?.title} 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4 w-full flex overflow-x-auto space-x-1 pb-px">
            {category.offerings.map((offering) => (
              <TabsTrigger
                key={offering.title}
                value={offering.title}
                className="text-sm"
              >
                {offering.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent key={activeTab} value={activeTab}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.offerings
                .filter(offering => offering.title === activeTab)
                .map((offering) => (
                  <OfferCard
                    key={offering.title}
                    category={category.label}
                    title={offering.title}
                    price={offering.price}
                    setupFee={offering.setupFee}
                    features={offering.features}
                  />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OfferCategoryCard;
