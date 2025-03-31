
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { RendezVous } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Link } from "lucide-react";

interface RendezVousCardProps {
  rendezVous: RendezVous;
  onEdit?: (id: string) => void;
}

const RendezVousCard: React.FC<RendezVousCardProps> = ({ rendezVous, onEdit }) => {
  const { id, date, honore, notes, meetingLink, location } = rendezVous;
  
  const formatDate = (date: Date) => {
    return format(new Date(date), "EEEE d MMMM yyyy", { locale: fr });
  };
  
  const formatTime = (date: Date) => {
    return format(new Date(date), "HH:mm");
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            Rendez-vous {formatDate(date)}
          </CardTitle>
          <Badge variant={honore ? "default" : "destructive"} className={honore ? "bg-green-500 hover:bg-green-600" : ""}>
            {honore ? "Honoré" : "Non honoré"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">{formatDate(date)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{formatTime(date)}</span>
        </div>
        
        {location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}
        
        {meetingLink && (
          <div className="mt-3">
            <a 
              href={meetingLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors px-3 py-1.5 rounded-md text-sm font-medium gap-1.5"
            >
              <Link className="w-4 h-4" />
              Rejoindre la réunion
            </a>
          </div>
        )}
        
        {notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm">
              <span className="font-semibold">Notes:</span> {notes}
            </p>
          </div>
        )}
      </CardContent>
      {onEdit && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
            Modifier
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RendezVousCard;
