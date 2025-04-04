
import React, { useState } from "react";
import { format, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { AppointmentDialog, AppointmentData } from "@/components/agenda/AppointmentDialog";
import WeekView from "@/components/agenda/WeekView";
import MonthView from "@/components/agenda/MonthView";
import CalendarSidebar from "@/components/agenda/CalendarSidebar";
import { Appointment } from "@/types/agenda";
import { useToast } from "@/hooks/use-toast";

const AgendaPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateAppointment = (appointmentData: AppointmentData) => {
    if (!appointmentData.date || !appointmentData.time) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une date et une heure pour le rendez-vous.",
      });
      return;
    }

    const appointmentDate = new Date(appointmentData.date);
    const [hours, minutes] = appointmentData.time.split(":").map(Number);
    appointmentDate.setHours(hours, minutes);

    const newAppointmentData: Appointment = {
      id: Math.random().toString(36).substring(2, 11),
      date: appointmentDate,
      time: appointmentData.time,
      type: appointmentData.type,
      confirmed: false
    };

    setAppointments(prev => [...prev, newAppointmentData]);
    setIsDialogOpen(false);
    
    toast({
      title: "Rendez-vous créé",
      description: "Un email de confirmation a été envoyé. Veuillez cliquer sur le lien dans l'email pour confirmer votre rendez-vous.",
    });
  };

  const handlePreviousWeek = () => {
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(addWeeks(selectedWeek, 1));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agenda</h1>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>
            Prendre un rendez-vous
          </Button>
        </DialogTrigger>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CalendarSidebar 
            calendarView={calendarView}
            setCalendarView={setCalendarView}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            hasAppointments={appointments.length > 0}
          />
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {calendarView === "month" 
                  ? format(selectedDate || new Date(), "MMMM yyyy", { locale: fr })
                  : "Vue de la semaine"
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto" style={{ maxHeight: "60vh" }}>
              {calendarView === "week" ? (
                <WeekView
                  selectedWeek={selectedWeek}
                  onPreviousWeek={handlePreviousWeek}
                  onNextWeek={handleNextWeek}
                  appointments={appointments}
                />
              ) : (
                <MonthView 
                  selectedDate={selectedDate}
                  appointments={appointments}
                  onAddClick={() => setIsDialogOpen(true)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AppointmentDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateAppointment={handleCreateAppointment}
      />
    </div>
  );
};

export default AgendaPage;
