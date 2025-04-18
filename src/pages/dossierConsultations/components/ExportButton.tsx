
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={onClick}
      disabled={disabled}
    >
      <Download className="h-4 w-4" />
      Exporter en CSV
    </Button>
  );
};
