
import { Statistique } from "@/types";

// Statistiques
export const statistiques: Statistique[] = [
  {
    periode: "mois",
    dateDebut: new Date("2023-01-01"),
    dateFin: new Date("2023-01-31"),
    appelsEmis: 350,
    appelsDecroches: 210,
    appelsTransformes: 70,
    rendezVousHonores: 55,
    rendezVousNonHonores: 15,
    dossiersValides: 45,
    dossiersSigne: 35,
    chiffreAffaires: 25000
  },
  {
    periode: "mois",
    dateDebut: new Date("2023-02-01"),
    dateFin: new Date("2023-02-28"),
    appelsEmis: 380,
    appelsDecroches: 240,
    appelsTransformes: 85,
    rendezVousHonores: 70,
    rendezVousNonHonores: 15,
    dossiersValides: 60,
    dossiersSigne: 50,
    chiffreAffaires: 32000
  },
  {
    periode: "mois",
    dateDebut: new Date("2023-03-01"),
    dateFin: new Date("2023-03-31"),
    appelsEmis: 420,
    appelsDecroches: 290,
    appelsTransformes: 95,
    rendezVousHonores: 80,
    rendezVousNonHonores: 15,
    dossiersValides: 70,
    dossiersSigne: 60,
    chiffreAffaires: 45000
  }
];
