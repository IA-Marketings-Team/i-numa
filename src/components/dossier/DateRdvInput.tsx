
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateRdvInputProps {
  dateRdv: string;
  onDateRdvChange: (value: string) => void;
}

const DateRdvInput: React.FC<DateRdvInputProps> = ({ dateRdv, onDateRdvChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="dateRdv">Date de rendez-vous</Label>
      <Input
        id="dateRdv"
        type="date"
        value={dateRdv}
        onChange={(e) => onDateRdvChange(e.target.value)}
      />
    </div>
  );
};

export default DateRdvInput;
