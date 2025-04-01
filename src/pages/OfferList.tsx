
import React from "react";
import { 
  Calendar, 
  MessageCircle, 
  Award, 
  Globe, 
  ThumbsUp, 
  Check, 
  Gift, 
  Database, 
  BarChart2, 
  Gauge, 
  TrendingDown,
  AtSign,
  Truck,
  Facebook
} from "lucide-react";
import FeatureButton from "@/components/offers/FeatureButton";
import PricingCard from "@/components/offers/PricingCard";
import { useTheme } from "@/contexts/ThemeContext";

const OfferList = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gray-50" : "bg-gray-950"} ${theme === "light" ? "text-gray-800" : "text-white"}`}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Top Feature Buttons - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <FeatureButton 
            icon={<Calendar className="h-5 w-5" />} 
            text="Générez des réservations"
            highlight="réservations"
          />
          <FeatureButton 
            icon={<MessageCircle className="h-5 w-5" />} 
            text="Animez/créez votre communauté"
            highlight="communauté"
          />
          <FeatureButton 
            icon={<Award className="h-5 w-5" />} 
            text="Valorisez votre expertise"
            highlight="expertise"
          />
          <FeatureButton 
            icon={<Globe className="h-5 w-5" />} 
            text="Augmentez votre visibilité / notoriété"
            highlight="visibilité / notoriété"
          />
          <FeatureButton 
            icon={<ThumbsUp className="h-5 w-5" />} 
            text="Générez des avis positifs"
            highlight="avis positifs"
          />
        </div>

        {/* Top Feature Buttons - Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <FeatureButton 
            icon={<Check className="h-5 w-5" />} 
            text="Gagnez en efficacité"
            highlight="efficacité"
          />
          <FeatureButton 
            icon={<Gift className="h-5 w-5" />} 
            text="Fidélisez vos clients"
            highlight="Fidélisez"
          />
          <FeatureButton 
            icon={<Database className="h-5 w-5" />} 
            text="Exploitez vos données clients"
            highlight="données clients"
          />
          <FeatureButton 
            icon={<BarChart2 className="h-5 w-5" />} 
            text="Développez votre activité"
            highlight="Développez"
          />
          <FeatureButton 
            icon={<Gauge className="h-5 w-5" />} 
            text="Pilotez votre activité"
            highlight="Pilotez"
          />
          <FeatureButton 
            icon={<TrendingDown className="h-5 w-5" />} 
            text="Diminuez vos coûts"
            highlight="Diminuez"
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <PricingCard 
            title="E-réputation"
            icon={<AtSign className="h-6 w-6" />}
            price="250"
            period="HT/mois"
            setupFee="300€ HT"
            features={[
              { text: "Community Management" }
            ]}
          />
          
          <PricingCard 
            title="Deliver"
            icon={<Truck className="h-6 w-6" />}
            price="60"
            period="HT/mois"
            setupFee="200€ HT"
            features={[
              { text: "Réservation de tables" },
              { text: "Click & Collect" },
              { text: "QR Code" }
            ]}
          />
          
          <PricingCard 
            title="Facebook / Instagram Ads"
            icon={<Facebook className="h-6 w-6" />}
            price="150"
            period="HT/mois"
            setupFee="200€ HT"
            features={[
              { text: "Facebook / Instagram Ads" },
              { text: "Service et accompagnement" }
            ]}
          />
        </div>

        {/* Trust Message */}
        <div className="text-center py-12">
          <p className={`text-xl ${theme === "light" ? "text-gray-700" : "text-gray-300"} max-w-4xl mx-auto`}>
            Partenaire de confiance de plus de 20 000 TPE/PME<br />
            depuis plus de 20 ans, nous valorisons les relations sur<br />
            le long terme.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferList;
