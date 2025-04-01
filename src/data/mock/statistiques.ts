
import { Statistique } from "@/types";

// Statistiques mensuelles
export const statistiquesMensuelles: Statistique[] = [
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
  },
  {
    periode: "mois",
    dateDebut: new Date("2023-04-01"),
    dateFin: new Date("2023-04-30"),
    appelsEmis: 450,
    appelsDecroches: 315,
    appelsTransformes: 105,
    rendezVousHonores: 85,
    rendezVousNonHonores: 20,
    dossiersValides: 75,
    dossiersSigne: 65,
    chiffreAffaires: 52000
  },
  {
    periode: "mois",
    dateDebut: new Date("2023-05-01"),
    dateFin: new Date("2023-05-31"),
    appelsEmis: 480,
    appelsDecroches: 336,
    appelsTransformes: 120,
    rendezVousHonores: 95,
    rendezVousNonHonores: 25,
    dossiersValides: 80,
    dossiersSigne: 70,
    chiffreAffaires: 58000
  },
  {
    periode: "mois",
    dateDebut: new Date("2023-06-01"),
    dateFin: new Date("2023-06-30"),
    appelsEmis: 500,
    appelsDecroches: 350,
    appelsTransformes: 130,
    rendezVousHonores: 100,
    rendezVousNonHonores: 30,
    dossiersValides: 85,
    dossiersSigne: 75,
    chiffreAffaires: 65000
  }
];

// Statistiques hebdomadaires (dernières 4 semaines)
export const statistiquesHebdomadaires: Statistique[] = [
  {
    periode: "semaine",
    dateDebut: new Date("2023-06-01"),
    dateFin: new Date("2023-06-07"),
    appelsEmis: 125,
    appelsDecroches: 88,
    appelsTransformes: 32,
    rendezVousHonores: 25,
    rendezVousNonHonores: 7,
    dossiersValides: 21,
    dossiersSigne: 18,
    chiffreAffaires: 16250
  },
  {
    periode: "semaine",
    dateDebut: new Date("2023-06-08"),
    dateFin: new Date("2023-06-14"),
    appelsEmis: 130,
    appelsDecroches: 91,
    appelsTransformes: 33,
    rendezVousHonores: 26,
    rendezVousNonHonores: 7,
    dossiersValides: 22,
    dossiersSigne: 19,
    chiffreAffaires: 16900
  },
  {
    periode: "semaine",
    dateDebut: new Date("2023-06-15"),
    dateFin: new Date("2023-06-21"),
    appelsEmis: 120,
    appelsDecroches: 84,
    appelsTransformes: 31,
    rendezVousHonores: 24,
    rendezVousNonHonores: 7,
    dossiersValides: 20,
    dossiersSigne: 18,
    chiffreAffaires: 15600
  },
  {
    periode: "semaine",
    dateDebut: new Date("2023-06-22"),
    dateFin: new Date("2023-06-28"),
    appelsEmis: 125,
    appelsDecroches: 87,
    appelsTransformes: 34,
    rendezVousHonores: 25,
    rendezVousNonHonores: 9,
    dossiersValides: 22,
    dossiersSigne: 20,
    chiffreAffaires: 16250
  }
];

// Statistiques journalières (derniers 7 jours)
export const statistiquesJournalieres: Statistique[] = [
  {
    periode: "jour",
    dateDebut: new Date("2023-06-22"),
    dateFin: new Date("2023-06-22"),
    appelsEmis: 25,
    appelsDecroches: 18,
    appelsTransformes: 7,
    rendezVousHonores: 5,
    rendezVousNonHonores: 2,
    dossiersValides: 4,
    dossiersSigne: 4,
    chiffreAffaires: 3250
  },
  {
    periode: "jour",
    dateDebut: new Date("2023-06-23"),
    dateFin: new Date("2023-06-23"),
    appelsEmis: 24,
    appelsDecroches: 17,
    appelsTransformes: 6,
    rendezVousHonores: 5,
    rendezVousNonHonores: 1,
    dossiersValides: 4,
    dossiersSigne: 3,
    chiffreAffaires: 3120
  },
  {
    periode: "jour",
    dateDebut: new Date("2023-06-24"),
    dateFin: new Date("2023-06-24"),
    appelsEmis: 18,
    appelsDecroches: 12,
    appelsTransformes: 5,
    rendezVousHonores: 4,
    rendezVousNonHonores: 1,
    dossiersValides: 3,
    dossiersSigne: 3,
    chiffreAffaires: 2340
  },
  {
    periode: "jour",
    dateDebut: new Date("2023-06-25"),
    dateFin: new Date("2023-06-25"),
    appelsEmis: 15,
    appelsDecroches: 10,
    appelsTransformes: 4,
    rendezVousHonores: 3,
    rendezVousNonHonores: 1,
    dossiersValides: 2,
    dossiersSigne: 2,
    chiffreAffaires: 1950
  },
  {
    periode: "jour",
    dateDebut: new Date("2023-06-26"),
    dateFin: new Date("2023-06-26"),
    appelsEmis: 26,
    appelsDecroches: 18,
    appelsTransformes: 7,
    rendezVousHonores: 5,
    rendezVousNonHonores: 2,
    dossiersValides: 4,
    dossiersSigne: 4,
    chiffreAffaires: 3380
  },
  {
    periode: "jour",
    dateDebut: new Date("2023-06-27"),
    dateFin: new Date("2023-06-27"),
    appelsEmis: 27,
    appelsDecroches: 19,
    appelsTransformes: 7,
    rendezVousHonores: 6,
    rendezVousNonHonores: 1,
    dossiersValides: 5,
    dossiersSigne: 4,
    chiffreAffaires: 3510
  },
  {
    periode: "jour",
    dateDebut: new Date("2023-06-28"),
    dateFin: new Date("2023-06-28"),
    appelsEmis: 25,
    appelsDecroches: 17,
    appelsTransformes: 7,
    rendezVousHonores: 5,
    rendezVousNonHonores: 2,
    dossiersValides: 4,
    dossiersSigne: 4,
    chiffreAffaires: 3250
  },
];

// Exporter toutes les statistiques
export const statistiques: Statistique[] = [
  ...statistiquesMensuelles,
  ...statistiquesHebdomadaires,
  ...statistiquesJournalieres
];
