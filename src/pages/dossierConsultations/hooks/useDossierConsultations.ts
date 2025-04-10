
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DossierConsultation } from "@/types";
import { fetchFilterData } from "../utils/fetchFilterData";
import { ToastType } from "@/hooks/use-toast";

// Define interfaces for the filter items
export interface UserListItem {
  id: string;
  name: string;
}

export interface DossierListItem {
  id: string;
  client_name: string;
}

interface Filters {
  search: string;
  userFilter: string;
  actionFilter: string;
  dateFilter: Date | undefined;
  dossierFilter: string;
}

export const useDossierConsultations = (toast: ToastType) => {
  const [consultations, setConsultations] = useState<DossierConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [dossiers, setDossiers] = useState<DossierListItem[]>([]);
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
      let query = supabase
        .from("dossier_consultations")
        .select("*", { count: "exact" });

      if (filters.search) {
        query = query.or(`user_name.ilike.%${filters.search}%,action.ilike.%${filters.search}%`);
      }
      if (filters.userFilter) {
        query = query.eq("user_id", filters.userFilter);
      }
      if (filters.actionFilter) {
        query = query.eq("action", filters.actionFilter);
      }
      if (filters.dateFilter) {
        const dateString = format(filters.dateFilter, "yyyy-MM-dd");
        query = query.gte("timestamp", `${dateString}T00:00:00Z`).lte("timestamp", `${dateString}T23:59:59Z`);
      }
      if (filters.dossierFilter) {
        query = query.eq("dossier_id", filters.dossierFilter);
      }

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .order("timestamp", { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      if (data) {
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
