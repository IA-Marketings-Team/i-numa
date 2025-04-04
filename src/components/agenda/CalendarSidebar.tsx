
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface CalendarSidebarProps {
  calendarView: "month" | "week";
  setCalendarView: (view: "month" | "week") => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  hasAppointments: boolean;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  calendarView,
  setCalendarView,
  selectedDate,
  setSelectedDate,
  hasAppointments
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue du Calendrier</CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden">
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
          <div className="border rounded-md overflow-hidden">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border-none shadow-none"
            />
          </div>
        )}
        
        {hasAppointments && (
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
  );
};

export default CalendarSidebar;
