
import React from 'react';
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  onExport: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
  return (
    <Button onClick={onExport} className="flex items-center">
      <Download className="mr-2 h-4 w-4" />
      Exporter en CSV
    </Button>
  );
};
