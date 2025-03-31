
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
    statistiques: {
      appelsEmis: 0,
      appelsDecroches: 0,
      appelsTransformes: 0,
      rendezVousHonores: 22,
      rendezVousNonHonores: 3,
      dossiersValides: 20,
      dossiersSigne: 18
    }
  }
];
