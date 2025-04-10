
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Search, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllConsultations } from "@/services/consultationService";
import { fetchUsers } from "@/services/userService";
import { fetchDossiers } from "@/services/dossierService";
import { DossierConsultation } from "@/types";
import Papa from "papaparse";

const DossierConsultationsPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [consultations, setConsultations] = useState<DossierConsultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<DossierConsultation[]>([]);
  const [users, setUsers] = useState<{ id: string; fullName: string; role: string }[]>([]);
  const [dossiers, setDossiers] = useState<{ id: string; client: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [selectedDossierId, setSelectedDossierId] = useState<string | undefined>(undefined);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch all consultations data
  useEffect(() => {
    const loadConsultations = async () => {
      setIsLoading(true);
      
      const filters: {
        startDate?: Date;
        endDate?: Date;
        userId?: string;
        dossierId?: string;
      } = {};
      
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (selectedUserId) filters.userId = selectedUserId;
      if (selectedDossierId) filters.dossierId = selectedDossierId;
      
      // If not supervisor or responsable, only show own consultations
      if (!hasPermission(['superviseur', 'responsable']) && user) {
        filters.userId = user.id;
      }
      
      try {
        const data = await fetchAllConsultations(filters);
        setConsultations(data);
        setFilteredConsultations(data);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConsultations();
  }, [startDate, endDate, selectedUserId, selectedDossierId, user, hasPermission]);

  // Load users for filtering (only for supervisors and responsables)
  useEffect(() => {
    const loadUsers = async () => {
      if (hasPermission(['superviseur', 'responsable'])) {
        try {
          const userData = await fetchUsers();
          const formattedUsers = userData.map(u => ({
            id: u.id,
            fullName: `${u.prenom} ${u.nom}`,
            role: u.role
          }));
          setUsers(formattedUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };
    
    loadUsers();
  }, [hasPermission]);
  
  // Load dossiers for filtering
  useEffect(() => {
    const loadDossiers = async () => {
      try {
        const dossierData = await fetchDossiers();
        const formattedDossiers = dossierData.map(d => ({
          id: d.id,
          client: d.client ? `${d.client.prenom} ${d.client.nom}` : 'Client inconnu'
        }));
        setDossiers(formattedDossiers);
      } catch (error) {
        console.error("Error fetching dossiers:", error);
      }
    };
    
    loadDossiers();
  }, []);

  // Filter consultations by search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredConsultations(consultations);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = consultations.filter(consultation => {
      return (
        consultation.userName.toLowerCase().includes(searchLower) ||
        consultation.dossierId.toLowerCase().includes(searchLower) ||
        consultation.userRole.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredConsultations(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, consultations]);

  // Reset all filters
  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedUserId(undefined);
    setSelectedDossierId(undefined);
    setSearchTerm("");
  };
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConsultations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredConsultations.length / itemsPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Export to CSV
  const exportToCSV = () => {
    const exportData = filteredConsultations.map(consultation => ({
      Date: format(consultation.timestamp, "dd/MM/yyyy HH:mm", { locale: fr }),
      Utilisateur: consultation.userName,
      Role: consultation.userRole,
      "ID Dossier": consultation.dossierId,
      Action: consultation.action || 'view'
    }));
    
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `consultations_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Historique des consultations de dossiers</CardTitle>
        <Button 
          variant="outline" 
          onClick={exportToCSV}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {/* Date filters */}
          <div className="flex flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2 w-40"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Date début"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2 w-40"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : "Date fin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* User filter (only for supervisors and responsables) */}
          {hasPermission(['superviseur', 'responsable']) && (
            <Select
              value={selectedUserId || ""}
              onValueChange={(value) => setSelectedUserId(value || undefined)}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Tous les utilisateurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les utilisateurs</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Dossier filter */}
          <Select
            value={selectedDossierId || ""}
            onValueChange={(value) => setSelectedDossierId(value || undefined)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Tous les dossiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les dossiers</SelectItem>
              {dossiers.map(dossier => (
                <SelectItem key={dossier.id} value={dossier.id}>
                  {dossier.client} (ID: {dossier.id.substring(0, 8)}...)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search filter */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Reset filters */}
          <Button
            variant="outline"
            onClick={resetFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        </div>

        {/* Consultations table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>ID Dossier</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Chargement des consultations...
                  </TableCell>
                </TableRow>
              ) : currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucune consultation trouvée
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      {format(consultation.timestamp, "dd/MM/yyyy HH:mm", { locale: fr })}
                    </TableCell>
                    <TableCell>{consultation.userName}</TableCell>
                    <TableCell>{consultation.userRole}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() => window.location.href = `/dossiers/${consultation.dossierId}`}
                      >
                        {consultation.dossierId.substring(0, 8)}...
                      </Button>
                    </TableCell>
                    <TableCell>{consultation.action || 'view'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {filteredConsultations.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredConsultations.length)} sur {filteredConsultations.length} résultats
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                let pageNumber;
                
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
                
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    onClick={() => paginate(pageNumber)}
                    className="w-10 h-10 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              <Button 
                variant="outline" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DossierConsultationsPage;
