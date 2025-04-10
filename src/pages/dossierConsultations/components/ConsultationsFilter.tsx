
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatAction } from "../utils/formatAction";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Filters, UserListItem, DossierListItem } from "../models/FilterTypes";

export interface ConsultationsFilterProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleFilterChange = (name: keyof Filters, value: string) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFilters({ ...filters, dateFilter: date });
  };

  const handleResetFilters = () => {
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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Recherche</Label>
          <Input
            id="search"
            placeholder="Rechercher par utilisateur ou action..."
            value={filters.search}
            onChange={handleSearchChange}
            disabled={isLoading}
          />
        </div>

        <div className="w-full md:w-64">
          <Label htmlFor="user-filter">Utilisateur</Label>
          <Select
            value={filters.userFilter}
            onValueChange={(value) => handleFilterChange("userFilter", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="user-filter">
              <SelectValue placeholder="Tous les utilisateurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les utilisateurs</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-64">
          <Label htmlFor="dossier-filter">Dossier</Label>
          <Select
            value={filters.dossierFilter}
            onValueChange={(value) => handleFilterChange("dossierFilter", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="dossier-filter">
              <SelectValue placeholder="Tous les dossiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les dossiers</SelectItem>
              {dossiers.map((dossier) => (
                <SelectItem key={dossier.id} value={dossier.id}>
                  {dossier.client_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64">
          <Label htmlFor="action-filter">Action</Label>
          <Select
            value={filters.actionFilter}
            onValueChange={(value) => handleFilterChange("actionFilter", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="action-filter">
              <SelectValue placeholder="Toutes les actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les actions</SelectItem>
              <SelectItem value="view">Consultation</SelectItem>
              <SelectItem value="edit">Modification</SelectItem>
              <SelectItem value="create">Création</SelectItem>
              <SelectItem value="validate">Validation</SelectItem>
              <SelectItem value="sign">Signature</SelectItem>
              <SelectItem value="archive">Archivage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-64">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFilter ? (
                  format(filters.dateFilter, "PPP", { locale: fr })
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.dateFilter}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full md:w-auto flex items-end">
          <Button variant="outline" onClick={handleResetFilters} disabled={isLoading}>
            Réinitialiser les filtres
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationsFilter;
