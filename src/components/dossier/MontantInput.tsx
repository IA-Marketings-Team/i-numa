
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MontantInputProps {
  montant: number | undefined;
  onMontantChange: (value: number | undefined) => void;
}

const MontantInput: React.FC<MontantInputProps> = ({ montant, onMontantChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="montant">Montant total (€)</Label>
      <Input
        id="montant"
        type="number"
        value={montant || ""}
        onChange={(e) => onMontantChange(Number(e.target.value) || undefined)}
      />
    </div>
  );
};

export default MontantInput;
