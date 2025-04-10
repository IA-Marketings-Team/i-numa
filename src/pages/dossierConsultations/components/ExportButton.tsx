
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  onExport: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
  return (
    <Button onClick={onExport} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Exporter en CSV
    </Button>
  );
};
