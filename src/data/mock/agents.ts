
import { Agent } from "@/types";

// Agents
export const agents: Agent[] = [
  {
    id: "phoner1",
    nom: "Leroy",
    prenom: "Thomas",
    email: "thomas.leroy@example.com",
    telephone: "0345678901",
    role: "agent_phoner",
    dateCreation: new Date("2022-11-05"),
    equipeId: "team1",
    statistiques: {
      appelsEmis: 120,
      appelsDecroches: 75,
      appelsTransformes: 25,
      rendezVousHonores: 18,
      rendezVousNonHonores: 7,
      dossiersValides: 15,
      dossiersSigne: 12
    }
  },
  {
    id: "visio1",
    nom: "Moreau",
    prenom: "Claire",
    email: "claire.moreau@example.com",
    telephone: "0456789012",
    role: "agent_visio",
    dateCreation: new Date("2022-11-10"),
    equipeId: "team2",
    statistiques: {
      appelsEmis: 0,
      appelsDecroches: 0,
      appelsTransformes: 0,
      rendezVousHonores: 22,
      rendezVousNonHonores: 3,
      dossiersValides: 20,
      dossiersSigne: 18
    }
  },
  {
    id: "dev1",
    nom: "Girard",
    prenom: "Lucas",
    email: "lucas.girard@example.com",
    telephone: "0567890123",
    role: "agent_developpeur",
    dateCreation: new Date("2022-12-15"),
    equipeId: "team3",
    statistiques: {
      appelsEmis: 0,
      appelsDecroches: 0,
      appelsTransformes: 0,
      rendezVousHonores: 0,
      rendezVousNonHonores: 0,
      dossiersValides: 12,
      dossiersSigne: 10
    }
  },
  {
    id: "mark1",
    nom: "Petit",
    prenom: "Emma",
    email: "emma.petit@example.com",
    telephone: "0678901234",
    role: "agent_marketing",
    dateCreation: new Date("2023-01-20"),
    equipeId: "team4",
    statistiques: {
      appelsEmis: 45,
      appelsDecroches: 30,
      appelsTransformes: 15,
      rendezVousHonores: 10,
      rendezVousNonHonores: 5,
      dossiersValides: 8,
      dossiersSigne: 6
    }
  }
];
