
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, Search, Calendar, User, FileText, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DossierConsultation } from "@/types";

// Define a simple interface for raw database consultations to avoid type recursion
interface RawDBConsultation {
  id: string;
  dossier_id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  action?: string;
}

const DossierConsultationsPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<DossierConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [dossierFilter, setDossierFilter] = useState("");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [dossiers, setDossiers] = useState<{ id: string; client_name: string }[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchConsultations();
    fetchFiltersData();
  }, [page, search, userFilter, actionFilter, dateFilter, dossierFilter]);

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("dossier_consultations")
        .select("*", { count: "exact" });

      // Appliquer les filtres
      if (search) {
        query = query.or(`user_name.ilike.%${search}%,action.ilike.%${search}%`);
      }
      if (userFilter) {
        query = query.eq("user_id", userFilter);
      }
      if (actionFilter) {
        query = query.eq("action", actionFilter);
      }
      if (dateFilter) {
        const dateString = format(dateFilter, "yyyy-MM-dd");
        query = query.gte("timestamp", `${dateString}T00:00:00Z`).lte("timestamp", `${dateString}T23:59:59Z`);
      }
      if (dossierFilter) {
        query = query.eq("dossier_id", dossierFilter);
      }

      // Pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .order("timestamp", { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      if (data) {
        const formattedData: DossierConsultation[] = data.map((item: RawDBConsultation) => ({
          id: item.id,
          userId: item.user_id,
          userName: item.user_name,
          userRole: item.user_role,
          dossierId: item.dossier_id,
          timestamp: new Date(item.timestamp),
          action: item.action || 'view'
        }));
        
        setConsultations(formattedData);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des consultations:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger l'historique des consultations"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFiltersData = async () => {
    try {
      // Récupérer la liste des utilisateurs pour le filtre
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, nom, prenom");
      
      if (userError) throw userError;
      
      if (userData) {
        setUsers(userData.map(user => ({
          id: user.id,
          name: `${user.prenom} ${user.nom}`
        })));
      }

      // Récupérer la liste des dossiers pour le filtre
      const { data: dossierData, error: dossierError } = await supabase
        .from("dossiers")
        .select("id, client_id");

      if (dossierError) throw dossierError;
      
      if (dossierData) {
        // Créer un tableau de promesses pour récupérer les informations client
        const dossierPromises = dossierData.map(async (dossier) => {
          if (!dossier.client_id) {
            return { id: dossier.id, client_name: `Dossier ${dossier.id.substring(0, 8)}` };
          }
          
          // Use a separate query to avoid join issues
          const { data: clientData } = await supabase
            .from("profiles")
            .select("nom, prenom")
            .eq("id", dossier.client_id)
            .single();
          
          if (!clientData) {
            return { id: dossier.id, client_name: `Dossier ${dossier.id.substring(0, 8)}` };
          }
          
          return {
            id: dossier.id,
            client_name: `${clientData.prenom} ${clientData.nom}`
          };
        });
        
        // Attendre que toutes les promesses soient résolues
        const dossierResults = await Promise.all(dossierPromises);
        setDossiers(dossierResults);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données pour les filtres:", error);
    }
  };

  const handleExportCSV = () => {
    // Fonction pour exporter les consultations en CSV
    const headers = ["ID", "Dossier", "Utilisateur", "Rôle", "Action", "Date"];
    const csvRows = [
      headers.join(","),
      ...consultations.map(item => {
        const date = item.timestamp;
        const formattedDate = format(date, "dd/MM/yyyy HH:mm", { locale: fr });
        return [
          item.id,
          item.dossierId,
          item.userName,
          item.userRole,
          item.action,
          formattedDate
        ].join(",");
      })
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `consultations_dossiers_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Formater l'action pour l'affichage
  const formatAction = (action: string): string => {
    switch (action) {
      case "view":
        return "Consultation";
      case "comment":
        return "Commentaire";
      case "call_note":
        return "Note d'appel";
      case "edit":
        return "Modification";
      case "status_change":
        return "Changement de statut";
      default:
        return action;
    }
  };

  // Vérifier si l'utilisateur a les droits d'accès à cette page
  const canAccessPage = user && ["superviseur", "responsable"].includes(user.role);

  if (!canAccessPage) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous n'avez pas les droits nécessaires pour accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle>Historique des consultations</CardTitle>
              <CardDescription>
                Consultez l'historique des accès et actions sur les dossiers
              </CardDescription>
            </div>
            <Button onClick={handleExportCSV} className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Exporter en CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6 flex flex-col lg:flex-row gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={userFilter} onValueChange={setUserFilter}>
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

              <Select value={dossierFilter} onValueChange={setDossierFilter}>
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

              <Select value={actionFilter} onValueChange={setActionFilter}>
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
                      {dateFilter ? format(dateFilter, "dd/MM/yyyy") : "Date"}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                  {dateFilter && (
                    <div className="p-2 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setDateFilter(undefined)}
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

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Dossier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Chargement des données...
                    </TableCell>
                  </TableRow>
                ) : consultations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Aucune consultation trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  consultations.map((item) => {
                    const date = item.timestamp;
                    const formattedDate = format(date, "dd/MM/yyyy HH:mm", { locale: fr });
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{formattedDate}</TableCell>
                        <TableCell>{item.userName}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {item.userRole.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1 text-gray-500" />
                            {formatAction(item.action)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto"
                            onClick={() => navigate(`/dossiers/${item.dossierId}`)}
                          >
                            Voir le dossier
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                    .map((p, i, arr) => {
                      // Ajouter des points de suspension pour les sauts de pages
                      if (i > 0 && p > arr[i - 1] + 1) {
                        return (
                          <React.Fragment key={`ellipsis-${p}`}>
                            <PaginationItem>
                              <span className="px-4">...</span>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setPage(p)}
                                isActive={page === p}
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        );
                      }
                      
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink
                            onClick={() => setPage(p)}
                            isActive={page === p}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DossierConsultationsPage;
