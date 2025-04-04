
import React from "react";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Appointment } from "@/types/agenda";

interface WeekViewProps {
  selectedWeek: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  appointments: Appointment[];
}

const WeekView: React.FC<WeekViewProps> = ({
  selectedWeek,
  onPreviousWeek,
  onNextWeek,
  appointments
}) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(selectedWeek, i));
  
  return (
    <div className="mt-4">
      <div className="flex justify-between mb-4">
        <Button variant="outline" size="sm" onClick={onPreviousWeek}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Semaine précédente
        </Button>
        <div className="font-medium">
          {format(days[0], "d MMMM", { locale: fr })} - {format(days[6], "d MMMM yyyy", { locale: fr })}
        </div>
        <Button variant="outline" size="sm" onClick={onNextWeek}>
          Semaine suivante
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="border text-center">
            <div className="py-2 bg-muted font-medium">
              {format(day, "EEEE", { locale: fr })}
              <div className="text-sm">{format(day, "d/MM")}</div>
            </div>
            <div className="p-2 min-h-[150px]">
              {appointments
                .filter(
                  app => 
                    app.date.getDate() === day.getDate() && 
                    app.date.getMonth() === day.getMonth() && 
                    app.date.getFullYear() === day.getFullYear()
                )
                .map(appointment => (
                  <div 
                    key={appointment.id} 
                    className={`mb-1 p-1 text-xs rounded ${
                      appointment.confirmed 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.time} - {appointment.type === "visio" ? "Visioconférence" : "Téléphone"}
                    {!appointment.confirmed && <div className="text-xs italic">En attente</div>}
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
