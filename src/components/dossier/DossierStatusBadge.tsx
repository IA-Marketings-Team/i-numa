
import React from "react";
import { Badge } from "@/components/ui/badge";
import { DossierStatus } from "@/types";

interface DossierStatusBadgeProps {
  status: DossierStatus;
}

const DossierStatusBadge: React.FC<DossierStatusBadgeProps> = ({ status }) => {
  const getStatusInfo = (status: DossierStatus) => {
    switch (status) {
      case 'prospect_chaud':
        return { label: 'Prospect à chaud', className: 'bg-red-100 text-red-800 hover:bg-red-200' };
      case 'prospect_froid':
        return { label: 'Prospect à froid', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
      case 'rdv_honore':
        return { label: 'RDV honoré', className: 'bg-green-100 text-green-800 hover:bg-green-200' };
      case 'rdv_non_honore':
        return { label: 'RDV non honoré', className: 'bg-amber-100 text-amber-800 hover:bg-amber-200' };
      case 'valide':
        return { label: 'Validé', className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' };
      case 'signe':
        return { label: 'Signé', className: 'bg-purple-100 text-purple-800 hover:bg-purple-200' };
      case 'archive':
        return { label: 'Archivé', className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
    }
  };

  const { label, className } = getStatusInfo(status);

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

export default DossierStatusBadge;
