
import React from 'react';
import { Calendar, Filter, FileText, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ConsultationFilters, UserListItem, DossierListItem } from "../hooks/useDossierConsultations";

interface ConsultationsFilterProps {
  filters: ConsultationFilters;
  setFilters: React.Dispatch<React.SetStateAction<ConsultationFilters>>;
  users: UserListItem[];
  dossiers: DossierListItem[];
}

const ConsultationsFilter: React.FC<ConsultationsFilterProps> = ({
  filters,
  setFilters,
  users,
  dossiers
}) => {
  return (
    <div className="mb-6 flex flex-col lg:flex-row gap-4">
      <div className="flex flex-1 items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="flex-1"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select 
          value={filters.userFilter} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, userFilter: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Utilisateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les utilisateurs</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.dossierFilter} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, dossierFilter: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <FileText className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Dossier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les dossiers</SelectItem>
            {dossiers.map(dossier => (
              <SelectItem key={dossier.id} value={dossier.id}>
                {dossier.client_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.actionFilter} 
          onValueChange={(value) => setFilters(prev => ({ ...prev, actionFilter: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les actions</SelectItem>
            <SelectItem value="view">Consultation</SelectItem>
            <SelectItem value="comment">Commentaire</SelectItem>
            <SelectItem value="call_note">Note d'appel</SelectItem>
            <SelectItem value="edit">Modification</SelectItem>
            <SelectItem value="status_change">Changement de statut</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                {filters.dateFilter ? format(filters.dateFilter, "dd/MM/yyyy") : "Date"}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={filters.dateFilter}
              onSelect={(date) => setFilters(prev => ({ ...prev, dateFilter: date }))}
              initialFocus
            />
            {filters.dateFilter && (
              <div className="p-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFilters(prev => ({ ...prev, dateFilter: undefined }))}
                  className="w-full"
                >
                  Effacer
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ConsultationsFilter;
