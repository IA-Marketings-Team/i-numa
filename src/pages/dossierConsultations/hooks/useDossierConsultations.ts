
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DossierConsultation } from "@/types";
import { fetchFilterData } from "../utils/fetchFilterData";
import { useToast } from "@/hooks/use-toast";
import { Filters, UserListItem, DossierListItem } from "../models/FilterTypes";

export const useDossierConsultations = () => {
  const [consultations, setConsultations] = useState<DossierConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [dossiers, setDossiers] = useState<DossierListItem[]>([]);
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Consolidated filters into a single object to simplify state management
  const [filters, setFilters] = useState<Filters>({
    search: "",
    userFilter: "",
    actionFilter: "",
    dateFilter: undefined,
    dossierFilter: ""
  });

  useEffect(() => {
    fetchConsultations();
    fetchFilterData(setUsers, setDossiers);
  }, [page, filters]);

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      // Define query conditions based on filters
      const conditions: Record<string, any> = {};
      
      // Apply explicit filters using a simple object to avoid chain nesting
      if (filters.userFilter) {
        conditions.user_id = filters.userFilter;
      }
      
      if (filters.actionFilter) {
        conditions.action = filters.actionFilter;
      }
      
      if (filters.dossierFilter) {
        conditions.dossier_id = filters.dossierFilter;
      }
      
      // Calculate pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      // Build the base query
      let query = supabase
        .from("dossier_consultations")
        .select("*", { count: "exact" });
      
      // Apply simple equality filters first
      if (Object.keys(conditions).length > 0) {
        query = query.match(conditions);
      }
      
      // Apply complex filters separately
      if (filters.search) {
        query = query.or(`user_name.ilike.%${filters.search}%,action.ilike.%${filters.search}%`);
      }
      
      if (filters.dateFilter) {
        const dateString = format(filters.dateFilter, "yyyy-MM-dd");
        query = query
          .gte("timestamp", `${dateString}T00:00:00Z`)
          .lte("timestamp", `${dateString}T23:59:59Z`);
      }
      
      // Apply sorting and pagination
      const { data, error, count } = await query
        .order("timestamp", { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      if (data) {
        // Map the data to our model
        const formattedData: DossierConsultation[] = data.map((item: any) => ({
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

  const handleExportCSV = () => {
    const headers = ["ID", "Dossier", "Utilisateur", "Rôle", "Action", "Date"];
    const csvRows = [
      headers.join(","),
      ...consultations.map(item => {
        const date = item.timestamp;
        const formattedDate = format(date, "dd/MM/yyyy HH:mm");
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

  return {
    consultations,
    isLoading,
    page,
    setPage,
    totalPages,
    filters,
    setFilters,
    users,
    dossiers,
    handleExportCSV
  };
};
