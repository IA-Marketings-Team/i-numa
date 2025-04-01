
import React from "react";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface PricingFeature {
  text: string;
}

interface PricingCardProps {
  title: string;
  icon: React.ReactNode;
  price: string;
  period: string;
  setupFee: string;
  features: PricingFeature[];
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  icon,
  price,
  period,
  setupFee,
  features
}) => {
  return (
    <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-primary/80">
            {icon}
          </div>
          <h3 className="text-xl font-medium text-primary">{title}</h3>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">À partir de</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-800">{price}€</span>
            <span className="text-gray-600">{period}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{setupFee} HT de Frais de création</p>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-700">
              <ChevronRight className="h-4 w-4 text-primary/60" />
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PricingCard;
