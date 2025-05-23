
import { RendezVous } from "@/types";
import { dossiers } from "./dossiers";

// Rendez-vous
export const rendezVous: RendezVous[] = [
  {
    id: "rdv1",
    dossierId: "dossier1",
    dossier: dossiers[0],
    date: new Date("2023-01-25T10:00:00"),
    honore: true,
    notes: "Client très intéressé par nos services SEO",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    location: "Visioconférence (Google Meet)"
  },
  {
    id: "rdv2",
    dossierId: "dossier2",
    dossier: dossiers[1],
    date: new Date("2023-03-05T14:00:00"),
    honore: false,
    notes: "Client absent, essayer de reprogrammer",
    meetingLink: "https://meet.google.com/jkl-mnop-qrs",
    location: "Visioconférence (Google Meet)"
  },
  {
    id: "rdv3",
    dossierId: "dossier3",
    dossier: dossiers[2],
    date: new Date("2023-03-20T11:30:00"),
    honore: true,
    notes: "Besoin d'une stratégie marketing complète",
    meetingLink: "https://zoom.us/j/123456789",
    location: "Visioconférence (Zoom)"
  }
];
