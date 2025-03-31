
import { DossierStatus } from "@/types";
import { cn } from "@/lib/utils";

interface DossierStatusBadgeProps {
  status: DossierStatus;
  className?: string;
}

const DossierStatusBadge: React.FC<DossierStatusBadgeProps> = ({ status, className }) => {
  const getStatusLabel = (status: DossierStatus): string => {
    switch (status) {
      case "prospect":
        return "Prospect";
      case "rdv_en_cours":
        return "RDV En Cours";
      case "valide":
        return "Validé";
      case "signe":
        return "Signé";
      case "archive":
        return "Archivé";
    }
  };

  const getStatusClass = (status: DossierStatus): string => {
    switch (status) {
      case "prospect":
        return "status-prospect";
      case "rdv_en_cours":
        return "status-rdv";
      case "valide":
        return "status-valide";
      case "signe":
        return "status-signe";
      case "archive":
        return "status-archive";
    }
  };

  return (
    <span className={cn(getStatusClass(status), className)}>
      {getStatusLabel(status)}
    </span>
  );
};

export default DossierStatusBadge;
