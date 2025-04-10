
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { fetchAllConsultations } from "@/services/consultationService";
import { DossierConsultation } from "@/types";
import { fetchUsers } from "@/services/userService";

const ConsultationsPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [consultations, setConsultations] = useState<DossierConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<{ id: string; fullName: string; role: string }[]>([]);

  // Fetch consultations with filters
  useEffect(() => {
    const loadConsultations = async () => {
      setIsLoading(true);
      
      const filters: {
        startDate?: Date;
        endDate?: Date;
        userId?: string;
      } = {};
      
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (selectedUserId) filters.userId = selectedUserId;
      
      // If not supervisor or responsable, only show own consultations
      if (!hasPermission(['superviseur', 'responsable']) && user) {
        filters.userId = user.id;
      }
      
      const data = await fetchAllConsultations(filters);
      setConsultations(data);
      setIsLoading(false);
    };
    
    loadConsultations();
  }, [startDate, endDate, selectedUserId, user, hasPermission]);

  // Load users for filtering (only for supervisors and responsables)
  useEffect(() => {
    const loadUsers = async () => {
      if (hasPermission(['superviseur', 'responsable'])) {
        const userData = await fetchUsers();
        const formattedUsers = userData.map(u => ({
          id: u.id,
          fullName: `${u.prenom} ${u.nom}`,
          role: u.role
        }));
        setUsers(formattedUsers);
      }
    };
    
    loadUsers();
  }, [hasPermission]);

  // Filter consultations by search term
  const filteredConsultations = consultations.filter(consultation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      consultation.userName.toLowerCase().includes(searchLower) ||
      consultation.dossierId.toLowerCase().includes(searchLower)
    );
  });

  // Reset all filters
  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedUserId(undefined);
    setSearchTerm("");
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Historique des consultations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Date filters */}
          <div className="flex flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2"
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
                  className="flex items-center justify-start gap-2"
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
            <select
              className="px-3 py-2 bg-background border border-input rounded-md"
              value={selectedUserId || ""}
              onChange={(e) => setSelectedUserId(e.target.value || undefined)}
            >
              <option value="">Tous les utilisateurs</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.role})
                </option>
              ))}
            </select>
          )}

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
              ) : filteredConsultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucune consultation trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredConsultations.map((consultation) => (
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
      </CardContent>
    </Card>
  );
};

export default ConsultationsPage;
