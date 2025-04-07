
import React from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, Sparkles } from 'lucide-react';

const MarketplaceTopBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    handleSectorSelect,
  } = useMarketplace();

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-8 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Nom (A-Z)</SelectItem>
            <SelectItem value="desc">Nom (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={() => handleSectorSelect("all")}
        variant="default" 
        className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Offres spéciales
      </Button>
    </div>
  );
};

export default MarketplaceTopBar;
