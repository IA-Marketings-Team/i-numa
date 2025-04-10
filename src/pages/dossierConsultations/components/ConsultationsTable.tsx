
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DossierConsultation } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatAction } from "../utils/formatAction";
import { Skeleton } from "@/components/ui/skeleton";

interface ConsultationsTableProps {
  consultations: DossierConsultation[];
  isLoading: boolean;
}

const ConsultationsTable: React.FC<ConsultationsTableProps> = ({ consultations, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune consultation trouvée avec les filtres actuels.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Dossier ID</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.map((consultation) => (
            <TableRow key={consultation.id}>
              <TableCell>
                {format(new Date(consultation.timestamp), "dd/MM/yyyy HH:mm", { locale: fr })}
              </TableCell>
              <TableCell>{consultation.userName}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {consultation.userRole.replace('_', ' ')}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs">
                  {consultation.dossierId.substring(0, 8)}...
                </span>
              </TableCell>
              <TableCell>{formatAction(consultation.action || 'view')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ConsultationsTable;
