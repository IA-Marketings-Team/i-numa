
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { RendezVous, Dossier } from "@/types";

interface RendezVousAgendaProps {
  prochainRdvs: RendezVous[];
  dossiers: Dossier[];
  onAddClick: () => void;
  onEditClick: (rdvId: string) => void;
  onDeleteClick: (rdvId: string) => void;
}

const RendezVousAgenda: React.FC<RendezVousAgendaProps> = ({
  prochainRdvs,
  dossiers,
  onAddClick,
  onEditClick,
  onDeleteClick
}) => {
  const formatDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agenda des rendez-vous</CardTitle>
        <DialogTrigger asChild>
          <Button size="sm" className="flex items-center gap-1" onClick={onAddClick}>
            <Plus className="h-4 w-4" />
            Ajouter un RDV
          </Button>
        </DialogTrigger>
      </CardHeader>
      <CardContent>
        {prochainRdvs.length > 0 ? (
          <div className="space-y-4">
            {prochainRdvs.map((rdv) => {
              const dossier = dossiers.find(d => d.id === rdv.dossierId);
              const rdvDate = new Date(rdv.date);
              return (
                <div key={rdv.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <div>
                    <p className="font-medium">{dossier?.client.secteurActivite}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(rdvDate)} à {format(rdvDate, "HH:mm")}
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
          <p className="text-center text-muted-foreground py-6">Aucun rendez-vous à venir</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RendezVousAgenda;
