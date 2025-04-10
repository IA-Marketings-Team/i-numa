
import React from "react";
import { Badge } from "@/components/ui/badge";
import { DossierStatus } from "@/types";

interface DossierStatusBadgeProps {
  status: DossierStatus;
}

const DossierStatusBadge: React.FC<DossierStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "prospect_chaud":
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          Prospect à chaud
        </Badge>
      );
    case "prospect_froid":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Prospect à froid
        </Badge>
      );
    case "rdv_en_cours":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          RDV en cours
        </Badge>
      );
    case "valide":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Validé
        </Badge>
      );
    case "signe":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          Signé
        </Badge>
      );
    case "archive":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Archivé
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          {status}
        </Badge>
      );
  }
};

export default DossierStatusBadge;
