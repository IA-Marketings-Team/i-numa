
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MeetingDetailsProps {
  location: string;
  onLocationChange: (location: string) => void;
  meetingLink: string;
  onMeetingLinkChange: (meetingLink: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  honore?: boolean;
  onHonoreChange?: (honore: boolean) => void;
  isEditing?: boolean;
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
  isEditing = false
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="location">Lieu</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Ex: Visioconférence (Google Meet)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meetingLink">Lien de la réunion</Label>
        <Input
          id="meetingLink"
          value={meetingLink}
          onChange={(e) => onMeetingLinkChange(e.target.value)}
          placeholder="Ex: https://meet.google.com/abc-defg-hij"
        />
      </div>

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

      {isEditing && onHonoreChange && (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="honore" 
            checked={honore}
            onCheckedChange={(checked) => onHonoreChange(checked === true)}
          />
          <Label htmlFor="honore" className="cursor-pointer">Rendez-vous honoré</Label>
        </div>
      )}
    </>
  );
};

export default MeetingDetails;
