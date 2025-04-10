
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useDossierConsultations } from "./dossierConsultations/hooks/useDossierConsultations";
import ConsultationsFilter from "./dossierConsultations/components/ConsultationsFilter";
import ConsultationsTable from "./dossierConsultations/components/ConsultationsTable";
import { ExportButton } from "./dossierConsultations/components/ExportButton";
import ConsultationsPagination from "./dossierConsultations/components/ConsultationsPagination";

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

  // Check if user has permission for this page
  const hasAccess = hasPermission(['superviseur', 'responsable']);

  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accès refusé</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Historique des consultations</h1>
        <ExportButton 
          onClick={handleExportCSV} 
          disabled={isLoading || consultations.length === 0} 
        />
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
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DossierConsultationsPage;
