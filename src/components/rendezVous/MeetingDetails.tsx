
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MeetingDetailsProps {
  location: string;
  onLocationChange: (value: string) => void;
  meetingLink: string;
  onMeetingLinkChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  honore: boolean;
  onHonoreChange: (value: boolean) => void;
  isEditing: boolean;
  statut?: string;
  onStatutChange?: (value: string) => void;
  solutionProposee?: string;
  onSolutionProposeeChange?: (value: string) => void;
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({
  location,
  onLocationChange,
  meetingLink,
  onMeetingLinkChange,
  notes,
  onNotesChange,
  honore,
  onHonoreChange,
  isEditing,
  statut = "planifie",
  onStatutChange,
  solutionProposee = "",
  onSolutionProposeeChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location">Lieu du rendez-vous</Label>
        <Input
          id="location"
          placeholder="Ex: Visioconférence (Google Meet)"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="meetingLink">Lien de réunion</Label>
        <Input
          id="meetingLink"
          placeholder="Lien vers la réunion en ligne"
          value={meetingLink}
          onChange={(e) => onMeetingLinkChange(e.target.value)}
        />
      </div>
      
      {onStatutChange && (
        <div>
          <Label htmlFor="status">Statut du rendez-vous</Label>
          <Select value={statut} onValueChange={onStatutChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planifie">Planifié</SelectItem>
              <SelectItem value="confirme">Confirmé</SelectItem>
              <SelectItem value="reporte">Reporté</SelectItem>
              <SelectItem value="annule">Annulé</SelectItem>
              <SelectItem value="termine">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {onSolutionProposeeChange && (
        <div>
          <Label htmlFor="solutionProposee">Solution proposée</Label>
          <Textarea
            id="solutionProposee"
            placeholder="Solutions proposées par l'agent"
            value={solutionProposee}
            onChange={(e) => onSolutionProposeeChange(e.target.value)}
            rows={3}
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Notes additionnelles..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
        />
      </div>
      
      {isEditing && (
        <div className="flex items-center space-x-2">
          <Switch
            id="honore"
            checked={honore}
            onCheckedChange={onHonoreChange}
          />
          <Label htmlFor="honore">Rendez-vous honoré</Label>
        </div>
      )}
    </div>
  );
};

export default MeetingDetails;
