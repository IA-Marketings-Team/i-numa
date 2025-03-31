
import { User } from "@/types";

// Utilisateurs
export const users: User[] = [
  {
    id: "client1",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    telephone: "0123456789",
    role: "client",
    dateCreation: new Date("2023-01-15")
  },
  {
    id: "client2",
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@example.com",
    telephone: "0234567890",
    role: "client",
    dateCreation: new Date("2023-02-20")
  },
  {
    id: "phoner1",
    nom: "Leroy",
    prenom: "Thomas",
    email: "thomas.leroy@example.com",
    telephone: "0345678901",
    role: "agent_phoner",
    dateCreation: new Date("2022-11-05")
  },
  {
    id: "visio1",
    nom: "Moreau",
    prenom: "Claire",
    email: "claire.moreau@example.com",
    telephone: "0456789012",
    role: "agent_visio",
    dateCreation: new Date("2022-11-10")
  },
  {
    id: "superviseur1",
    nom: "Tayin",
    prenom: "Ahmed",
    email: "ahmed.tayin@example.com",
    telephone: "0567890123",
    role: "superviseur",
    dateCreation: new Date("2022-10-01")
  },
  {
    id: "responsable1",
    nom: "Andy",
    prenom: "Marie",
    email: "marie.andy@example.com",
    telephone: "0678901234",
    role: "responsable",
    dateCreation: new Date("2022-09-01")
  }
];
