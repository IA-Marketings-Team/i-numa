
import { useState } from "react";
import { offerCategories } from "@/data/offerData";
import OfferCategoryCard from "@/components/offers/OfferCategoryCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import { useAuth } from "@/contexts/AuthContext";

const OfferList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { user } = useAuth();
  const isClient = user?.role === 'client';

  // Filtrer les catégories par terme de recherche et filtre de catégorie
  const filteredCategories = offerCategories.filter((category) => {
    // Filtre par catégorie
    if (categoryFilter !== "all" && category.label !== categoryFilter) {
      return false;
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        category.label.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower) ||
        category.offerings.some(
          (offering) =>
            offering.title.toLowerCase().includes(searchLower) ||
            offering.price.toLowerCase().includes(searchLower)
        )
      );
    }
    
    return true;
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h1 className="text-3xl font-bold">Nos offres</h1>
        {isClient && <CartDrawer />}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher une offre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {offerCategories.map((category) => (
                <SelectItem key={category.label} value={category.label}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-8">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <OfferCategoryCard key={category.label} category={category} />
          ))
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucune offre trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferList;
