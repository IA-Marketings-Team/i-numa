
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesInputProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

const NotesInput: React.FC<NotesInputProps> = ({ notes, onNotesChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Informations supplémentaires..."
        rows={4}
      />
    </div>
  );
};

export default NotesInput;
