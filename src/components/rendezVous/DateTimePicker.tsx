
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  hours: string;
  onHoursChange: (hours: string) => void;
  minutes: string;
  onMinutesChange: (minutes: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  onDateChange,
  hours,
  onHoursChange,
  minutes,
  onMinutesChange
}) => {
  // Générer des options pour les heures et les minutes
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesOptions = ["00", "15", "30", "45"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "EEEE d MMMM yyyy", { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              locale={fr}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Heure</Label>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="grid grid-cols-2 gap-2 flex-1">
            <Select value={hours || "00"} onValueChange={onHoursChange}>
              <SelectTrigger>
                <SelectValue placeholder="Heure" />
              </SelectTrigger>
              <SelectContent>
                {hoursOptions.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={minutes || "00"} onValueChange={onMinutesChange}>
              <SelectTrigger>
                <SelectValue placeholder="Minutes" />
              </SelectTrigger>
              <SelectContent>
                {minutesOptions.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
