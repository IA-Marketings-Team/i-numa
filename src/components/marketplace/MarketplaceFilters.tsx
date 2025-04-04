
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

interface MarketplaceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  disabled?: boolean;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  disabled = false
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      <h3 className="text-lg font-medium mb-3 flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        <Filter className="mr-2 h-4 w-4 text-indigo-500" />
        Filtres
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Recherche</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-8 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Trier par</label>
          <Select value={sortOrder} onValueChange={setSortOrder} disabled={disabled}>
            <SelectTrigger className="w-full bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Nom (A-Z)</SelectItem>
              <SelectItem value="desc">Nom (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
