
import { Team } from "@/types";

export const teams: Team[] = [
  {
    id: "team1",
    nom: "Équipe Phoning",
    fonction: "phoning",
    description: "Équipe dédiée aux appels téléphoniques et à la prospection",
    dateCreation: new Date("2023-01-15")
  },
  {
    id: "team2",
    nom: "Équipe Visio",
    fonction: "visio",
    description: "Équipe spécialisée dans les rendez-vous en visioconférence",
    dateCreation: new Date("2023-02-10")
  },
  {
    id: "team3",
    nom: "Équipe Dev",
    fonction: "developpement",
    description: "Équipe de développement de solutions numériques",
    dateCreation: new Date("2023-03-05")
  },
  {
    id: "team4",
    nom: "Équipe Marketing",
    fonction: "marketing",
    description: "Équipe en charge des campagnes marketing et communication",
    dateCreation: new Date("2023-04-20")
  }
];
