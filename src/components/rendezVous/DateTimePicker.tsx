
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  hours: string;
  onHoursChange: (hours: string) => void;
  minutes: string;
  onMinutesChange: (minutes: string) => void;
  timeField?: string;
  onTimeFieldChange?: (time: string) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  onDateChange,
  hours,
  onHoursChange,
  minutes,
  onMinutesChange,
  timeField,
  onTimeFieldChange
}) => {
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="date">Date du rendez-vous</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {onTimeFieldChange ? (
        <div>
          <Label htmlFor="timeField">Heure du rendez-vous</Label>
          <Input
            id="timeField"
            placeholder="Ex: 15h00"
            value={timeField}
            onChange={(e) => onTimeFieldChange(e.target.value)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hours">Heures</Label>
            <Select value={hours} onValueChange={onHoursChange}>
              <SelectTrigger id="hours">
                <SelectValue placeholder="Heures" />
              </SelectTrigger>
              <SelectContent>
                {hoursOptions.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="minutes">Minutes</Label>
            <Select value={minutes} onValueChange={onMinutesChange}>
              <SelectTrigger id="minutes">
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
      )}
    </div>
  );
};

export default DateTimePicker;
