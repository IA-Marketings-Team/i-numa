
import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DossierConsultation } from "@/types";
import { formatAction } from "../utils/formatAction";

interface ConsultationsTableProps {
  consultations: DossierConsultation[];
  isLoading: boolean;
}

const ConsultationsTable: React.FC<ConsultationsTableProps> = ({ consultations, isLoading }) => {
  const navigate = useNavigate();

  return (
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
              const formattedDate = format(item.timestamp, "dd/MM/yyyy HH:mm", { locale: fr });
              
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
  );
};

export default ConsultationsTable;
