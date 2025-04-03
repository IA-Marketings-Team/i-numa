
import React, { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type AppointmentType = "visio" | "phone";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  type: AppointmentType;
  confirmed: boolean;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const AgendaPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<{
    date: Date | undefined;
    time: string;
    type: AppointmentType;
  }>({
    date: undefined,
    time: "",
    type: "visio"
  });

  const handleCreateAppointment = () => {
    if (!newAppointment.date || !newAppointment.time) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une date et une heure pour le rendez-vous.",
      });
      return;
    }

    const appointmentDate = new Date(newAppointment.date);
    const [hours, minutes] = newAppointment.time.split(":").map(Number);
    appointmentDate.setHours(hours, minutes);

    const newAppointmentData: Appointment = {
      id: Math.random().toString(36).substring(2, 11),
      date: appointmentDate,
      time: newAppointment.time,
      type: newAppointment.type,
      confirmed: false
    };

    setAppointments(prev => [...prev, newAppointmentData]);
    setIsDialogOpen(false);
    
    toast({
      title: "Rendez-vous créé",
      description: "Un email de confirmation a été envoyé. Veuillez cliquer sur le lien dans l'email pour confirmer votre rendez-vous.",
    });

    // Reset form
    setNewAppointment({
      date: undefined,
      time: "",
      type: "visio"
    });
  };

  const handlePreviousWeek = () => {
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(addWeeks(selectedWeek, 1));
  };

  const renderWeekView = () => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(selectedWeek, i));
    
    return (
      <div className="mt-4">
        <div className="flex justify-between mb-4">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Semaine précédente
          </Button>
          <div className="font-medium">
            {format(days[0], "d MMMM", { locale: fr })} - {format(days[6], "d MMMM yyyy", { locale: fr })}
          </div>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agenda</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              Prendre un rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Planifier un rendez-vous</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Date du rendez-vous</label>
                </div>
                <Calendar
                  mode="single"
                  selected={newAppointment.date}
                  onSelect={date => setNewAppointment(prev => ({ ...prev, date }))}
                  disabled={(date) => {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    return date < now || date.getDay() === 0 || date.getDay() === 6;
                  }}
                  className="rounded-md border shadow p-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Heure du rendez-vous</label>
                </div>
                <Select
                  value={newAppointment.time}
                  onValueChange={time => setNewAppointment(prev => ({ ...prev, time }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de rendez-vous</label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="visio"
                      checked={newAppointment.type === "visio"}
                      onChange={() => setNewAppointment(prev => ({ ...prev, type: "visio" }))}
                      className="mr-2"
                    />
                    <label htmlFor="visio">Visioconférence</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="phone"
                      checked={newAppointment.type === "phone"}
                      onChange={() => setNewAppointment(prev => ({ ...prev, type: "phone" }))}
                      className="mr-2"
                    />
                    <label htmlFor="phone">Téléphone</label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateAppointment}>
                  Confirmer le rendez-vous
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Vue du Calendrier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Button 
                  variant={calendarView === "month" ? "default" : "outline"} 
                  onClick={() => setCalendarView("month")}
                  className="flex-1"
                >
                  Mois
                </Button>
                <Button 
                  variant={calendarView === "week" ? "default" : "outline"} 
                  onClick={() => setCalendarView("week")}
                  className="flex-1"
                >
                  Semaine
                </Button>
              </div>
              
              {calendarView === "month" && (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border shadow"
                />
              )}
              
              {appointments.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-medium">Légende:</h3>
                  <div className="flex items-center text-sm">
                    <div className="w-4 h-4 rounded bg-green-100 mr-2"></div>
                    <span>Rendez-vous confirmé</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-4 h-4 rounded bg-yellow-100 mr-2"></div>
                    <span>En attente de confirmation</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {calendarView === "month" 
                  ? format(selectedDate || new Date(), "MMMM yyyy", { locale: fr })
                  : "Vue de la semaine"
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calendarView === "week" ? (
                renderWeekView()
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium">
                    Rendez-vous du {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: fr }) : "jour sélectionné"}
                  </h3>
                  
                  {appointments
                    .filter(
                      app => 
                        selectedDate &&
                        app.date.getDate() === selectedDate.getDate() && 
                        app.date.getMonth() === selectedDate.getMonth() && 
                        app.date.getFullYear() === selectedDate.getFullYear()
                    )
                    .length > 0 ? (
                      <div className="space-y-2">
                        {appointments
                          .filter(
                            app => 
                              selectedDate &&
                              app.date.getDate() === selectedDate.getDate() && 
                              app.date.getMonth() === selectedDate.getMonth() && 
                              app.date.getFullYear() === selectedDate.getFullYear()
                          )
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
                              onClick={() => setIsDialogOpen(true)}
                            >
                              Planifier un rendez-vous
                            </Button>
                          </>
                        ) : (
                          <p>Veuillez sélectionner une date dans le calendrier.</p>
                        )}
                      </div>
                    )
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgendaPage;
