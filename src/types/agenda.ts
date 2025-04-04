
export type AppointmentType = "visio" | "phone";

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  type: AppointmentType;
  confirmed: boolean;
}
