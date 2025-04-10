
import React from "react";
import { useDossierConsultations } from "./hooks/useDossierConsultations";
import ConsultationsTable from "./components/ConsultationsTable";
import ConsultationsFilter from "./components/ConsultationsFilter";
import ConsultationsPagination from "./components/ConsultationsPagination";
import ExportButton from "./components/ExportButton";
import AccessDeniedCard from "./components/AccessDeniedCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const DossierConsultationsPage = () => {
  const { hasPermission } = useAuth();
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
  } = useDossierConsultations();

  const hasAccess = hasPermission(['superviseur', 'responsable', 'admin']);

  if (!hasAccess) {
    return <AccessDeniedCard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Consultations des dossiers</h1>
        <ExportButton onClick={handleExportCSV} disabled={isLoading || consultations.length === 0} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationsFilter
            filters={filters}
            setFilters={setFilters}
            users={users}
            dossiers={dossiers}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Historique des consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationsTable
            consultations={consultations}
            isLoading={isLoading}
          />
          
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <ConsultationsPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DossierConsultationsPage;
