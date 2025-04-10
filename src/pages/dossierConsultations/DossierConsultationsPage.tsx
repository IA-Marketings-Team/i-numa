
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AccessDeniedCard from "./components/AccessDeniedCard";
import ConsultationsFilter from "./components/ConsultationsFilter";
import ConsultationsTable from "./components/ConsultationsTable";
import ConsultationsPagination from "./components/ConsultationsPagination";
import { useDossierConsultations } from "./hooks/useDossierConsultations";
import { ExportButton } from "./components/ExportButton";

const DossierConsultationsPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const canAccessPage = user && ["superviseur", "responsable"].includes(user.role);
  
  const {
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
  } = useDossierConsultations(toast);

  if (!canAccessPage) {
    return <AccessDeniedCard />;
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
            <ExportButton onExport={handleExportCSV} />
          </div>
        </CardHeader>

        <CardContent>
          <ConsultationsFilter 
            filters={filters} 
            setFilters={setFilters} 
            users={users} 
            dossiers={dossiers}
          />

          <ConsultationsTable 
            consultations={consultations} 
            isLoading={isLoading} 
          />

          {totalPages > 1 && (
            <ConsultationsPagination 
              page={page} 
              setPage={setPage} 
              totalPages={totalPages} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DossierConsultationsPage;
