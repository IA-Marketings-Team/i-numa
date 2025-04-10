
import React from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CalendarIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserListItem, DossierListItem, Filters } from "../models/FilterTypes";

interface ConsultationsFilterProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  users: UserListItem[];
  dossiers: DossierListItem[];
  isLoading: boolean;
}

const ConsultationsFilter: React.FC<ConsultationsFilterProps> = ({
  filters,
  setFilters,
  users,
  dossiers,
  isLoading
}) => {
  const handleClearFilters = () => {
    setFilters({
      search: "",
      userFilter: "",
      actionFilter: "",
      dateFilter: undefined,
      dossierFilter: ""
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            disabled={isLoading}
          />
        </div>

        {/* User filter */}
        <Select 
          value={filters.userFilter}
          onValueChange={(value) => setFilters({ ...filters, userFilter: value })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Utilisateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les utilisateurs</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name} ({user.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Action filter */}
        <Select 
          value={filters.actionFilter}
          onValueChange={(value) => setFilters({ ...filters, actionFilter: value })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les actions</SelectItem>
            <SelectItem value="view">Consultation</SelectItem>
            <SelectItem value="edit">Modification</SelectItem>
            <SelectItem value="create">Création</SelectItem>
            <SelectItem value="delete">Suppression</SelectItem>
            <SelectItem value="export">Export</SelectItem>
            <SelectItem value="import">Import</SelectItem>
            <SelectItem value="comment">Commentaire</SelectItem>
            <SelectItem value="call">Appel</SelectItem>
          </SelectContent>
        </Select>

        {/* Dossier filter */}
        <Select 
          value={filters.dossierFilter}
          onValueChange={(value) => setFilters({ ...filters, dossierFilter: value })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Dossier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les dossiers</SelectItem>
            {dossiers.map((dossier) => (
              <SelectItem key={dossier.id} value={dossier.id}>
                {dossier.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        {/* Date filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-[240px] justify-start text-left font-normal ${
                filters.dateFilter ? "text-foreground" : "text-muted-foreground"
              }`}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFilter ? (
                format(filters.dateFilter, "PPP", { locale: fr })
              ) : (
                "Sélectionner une date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateFilter}
              onSelect={(date) => setFilters({ ...filters, dateFilter: date || undefined })}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>

        {/* Clear filters button */}
        <Button
          variant="ghost"
          onClick={handleClearFilters}
          disabled={isLoading || (
            !filters.search && 
            !filters.userFilter && 
            !filters.actionFilter &&
            !filters.dateFilter &&
            !filters.dossierFilter
          )}
          className="flex items-center"
        >
          <X className="h-4 w-4 mr-2" />
          Effacer les filtres
        </Button>
      </div>
    </div>
  );
};

export default ConsultationsFilter;
