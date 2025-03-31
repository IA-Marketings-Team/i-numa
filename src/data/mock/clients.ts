
import { Client } from "@/types";

// Clients
export const clients: Client[] = [
  {
    id: "client1",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    telephone: "0123456789",
    role: "client",
    dateCreation: new Date("2023-01-15"),
    adresse: "123 Rue de Paris, 75001 Paris",
    iban: "FR7630001007941234567890185",
    secteurActivite: "E-commerce",
    typeEntreprise: "PME",
    besoins: "Amélioration de la visibilité en ligne"
  },
  {
    id: "client2",
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@example.com",
    telephone: "0234567890",
    role: "client",
    dateCreation: new Date("2023-02-20"),
    adresse: "45 Avenue Victor Hugo, 69002 Lyon",
    iban: "FR7630004000031234567890143",
    secteurActivite: "Restauration",
    typeEntreprise: "TPE",
    besoins: "Acquisition de nouveaux clients locaux"
  },
  {
    id: "client3",
    nom: "Petit",
    prenom: "Robert",
    email: "robert.petit@example.com",
    telephone: "0345678901",
    role: "client",
    dateCreation: new Date("2023-03-10"),
    adresse: "8 Boulevard des Capucines, 13001 Marseille",
    secteurActivite: "Consulting",
    typeEntreprise: "Indépendant",
    besoins: "Développement de clientèle B2B"
  },
  {
    id: "client4",
    nom: "Dubois",
    prenom: "Émilie",
    email: "emilie.dubois@example.com",
    telephone: "0456789012",
    role: "client",
    dateCreation: new Date("2023-04-05"),
    adresse: "27 Rue du Commerce, 33000 Bordeaux",
    secteurActivite: "Immobilier",
    typeEntreprise: "PME",
    besoins: "Stratégie marketing digitale complète"
  },
  {
    id: "client5",
    nom: "Lefebvre",
    prenom: "Michel",
    email: "michel.lefebvre@example.com",
    telephone: "0567890123",
    role: "client",
    dateCreation: new Date("2023-05-12"),
    adresse: "56 Rue de la Liberté, 59000 Lille",
    secteurActivite: "Santé",
    typeEntreprise: "Profession libérale",
    besoins: "Visibilité locale et référencement"
  }
];
