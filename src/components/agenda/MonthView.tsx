
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types/agenda";

interface MonthViewProps {
  selectedDate: Date | undefined;
  appointments: Appointment[];
  onAddClick: () => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  appointments,
  onAddClick
}) => {
  const filteredAppointments = appointments.filter(
    app => 
      selectedDate &&
      app.date.getDate() === selectedDate.getDate() && 
      app.date.getMonth() === selectedDate.getMonth() && 
      app.date.getFullYear() === selectedDate.getFullYear()
  );

  return (
    <div className="space-y-4">
      <h3 className="font-medium">
        Rendez-vous du {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: fr }) : "jour sélectionné"}
      </h3>
      
      {filteredAppointments.length > 0 ? (
        <div className="space-y-2">
          {filteredAppointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(appointment => (
              <div 
                key={appointment.id} 
                className={`p-3 rounded-lg ${
                  appointment.confirmed 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <div className="font-medium">
                  {appointment.time} - {appointment.type === "visio" ? "Visioconférence" : "Téléphone"}
                </div>
                {!appointment.confirmed && (
                  <div className="mt-1 text-sm text-yellow-700 italic">
                    En attente de confirmation par email
                  </div>
                )}
              </div>
            ))
          }
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {selectedDate ? (
            <>
              <p>Aucun rendez-vous pour cette date.</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={onAddClick}
              >
                Planifier un rendez-vous
              </Button>
            </>
          ) : (
            <p>Veuillez sélectionner une date dans le calendrier.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthView;
