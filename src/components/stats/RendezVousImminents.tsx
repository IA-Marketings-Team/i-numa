
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { RendezVous, Dossier } from "@/types";

interface RendezVousImminentsProps {
  rdvImminents: RendezVous[];
  dossiers: Dossier[];
  onEditClick: (rdvId: string) => void;
  onDeleteClick: (rdvId: string) => void;
}

const RendezVousImminents: React.FC<RendezVousImminentsProps> = ({
  rdvImminents,
  dossiers,
  onEditClick,
  onDeleteClick
}) => {
  const formatDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendez-vous imminents (48h)</CardTitle>
      </CardHeader>
      <CardContent>
        {rdvImminents.length > 0 ? (
          <div className="space-y-4">
            {rdvImminents.map((rdv) => {
              const dossier = dossiers.find(d => d.id === rdv.dossierId);
              const rdvDate = new Date(rdv.date);
              return (
                <div key={rdv.id} className="p-4 border rounded-md flex justify-between items-center bg-amber-50">
                  <div>
                    <p className="font-semibold">{dossier?.client.secteurActivite}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(rdvDate)} à {format(rdvDate, "HH:mm")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Besoins: {dossier?.notes || "Non spécifiés"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditClick(rdv.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDeleteClick(rdv.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-6">Aucun rendez-vous imminent</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RendezVousImminents;
