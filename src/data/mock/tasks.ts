
import { Task } from "@/types";

export const tasks: Task[] = [
  {
    id: "task1",
    title: "Contacter M. Dupont",
    description: "Rappeler pour finaliser le contrat",
    agent_id: "phoner1",
    status: "to_do",
    date_creation: new Date("2023-06-01"),
    date_echeance: new Date("2023-06-03"),
    priority: "high"
  },
  {
    id: "task2",
    title: "Présentation visio",
    description: "Préparer la présentation pour l'entreprise Martin",
    agent_id: "visio1",
    status: "in_progress",
    date_creation: new Date("2023-06-02"),
    date_echeance: new Date("2023-06-05"),
    priority: "medium"
  },
  {
    id: "task3",
    title: "Mise à jour site web",
    description: "Intégrer les nouvelles offres sur la page d'accueil",
    agent_id: "phoner1",
    status: "done",
    date_creation: new Date("2023-05-28"),
    date_echeance: new Date("2023-06-01"),
    priority: "medium"
  },
  {
    id: "task4",
    title: "Suivi client ABC",
    description: "Vérifier la satisfaction suite à l'installation",
    agent_id: "visio1",
    status: "to_do",
    date_creation: new Date("2023-06-02"),
    date_echeance: new Date("2023-06-07"),
    priority: "low"
  }
];
