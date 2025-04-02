
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  ShoppingBag, 
  Home, 
  Utensils, 
  Car, 
  Briefcase, 
  Users,
  Bed,
  Heart,
  Sparkles
} from "lucide-react";

interface Sector {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface SectorsHorizontalNavProps {
  selectedSector: string;
  onSelectSector: (sector: string) => void;
}

const sectors: Sector[] = [
  { id: "all", name: "Tous les secteurs", icon: <Sparkles className="h-4 w-4" /> },
  { id: "restaurant", name: "Restaurants", icon: <Utensils className="h-4 w-4" /> },
  { id: "retail", name: "Commerce", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "real_estate", name: "Immobilier", icon: <Home className="h-4 w-4" /> },
  { id: "automotive", name: "Automobile", icon: <Car className="h-4 w-4" /> },
  { id: "business", name: "Services professionnels", icon: <Briefcase className="h-4 w-4" /> },
  { id: "health", name: "Santé", icon: <Heart className="h-4 w-4" /> },
  { id: "hospitality", name: "Hôtellerie", icon: <Bed className="h-4 w-4" /> },
  { id: "education", name: "Éducation", icon: <Users className="h-4 w-4" /> },
  { id: "other", name: "Autres", icon: <Building className="h-4 w-4" /> },
];

const SectorsHorizontalNav: React.FC<SectorsHorizontalNavProps> = ({ 
  selectedSector,
  onSelectSector 
}) => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 py-3 px-4 mb-6">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto pb-2 no-scrollbar gap-2">
          {sectors.map((sector) => (
            <Button
              key={sector.id}
              variant={selectedSector === sector.id ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap flex-shrink-0 ${
                selectedSector === sector.id 
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                  : ""
              }`}
              onClick={() => onSelectSector(sector.id)}
            >
              {sector.icon}
              <span className="ml-1.5">{sector.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorsHorizontalNav;

// Ajouter le CSS pour no-scrollbar si nécessaire
// Vous pouvez ajouter ceci dans votre CSS global
/*
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
