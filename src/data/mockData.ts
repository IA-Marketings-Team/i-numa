
import { Agent, Client, Dossier, Offre, RendezVous, Statistique, User } from "@/types";

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

// Offres
export const offres: Offre[] = [
  {
    id: "offre1",
    nom: "Pack SEO Starter",
    description: "Optimisation de base pour le référencement naturel",
    type: "SEO",
    prix: 499
  },
  {
    id: "offre2",
    nom: "Google Ads Premium",
    description: "Campagne publicitaire Google Ads avec suivi personnalisé",
    type: "Google Ads",
    prix: 799
  },
  {
    id: "offre3",
    nom: "Email Marketing",
    description: "Campagne d'emailing ciblée et personnalisée",
    type: "Email X",
    prix: 349
  },
  {
    id: "offre4",
    nom: "Prospection téléphonique",
    description: "Service de démarchage téléphonique professionnel",
    type: "Foner",
    prix: 599
  },
  {
    id: "offre5",
    nom: "Devis personnalisé",
    description: "Analyse complète et proposition sur mesure",
    type: "Devis",
    prix: 0
  }
];

// Dossiers
export const dossiers: Dossier[] = [
  {
    id: "dossier1",
    clientId: "client1",
    client: clients[0],
    agentPhonerId: "phoner1",
    agentVisioId: "visio1",
    status: "signe",
    offres: [offres[0], offres[2]],
    dateCreation: new Date("2023-01-20"),
    dateMiseAJour: new Date("2023-02-15"),
    dateRdv: new Date("2023-01-25"),
    dateValidation: new Date("2023-02-01"),
    dateSignature: new Date("2023-02-10"),
    montant: 848
  },
  {
    id: "dossier2",
    clientId: "client2",
    client: clients[1],
    agentPhonerId: "phoner1",
    status: "rdv_en_cours",
    offres: [offres[1]],
    dateCreation: new Date("2023-02-25"),
    dateMiseAJour: new Date("2023-03-01"),
    dateRdv: new Date("2023-03-05")
  },
  {
    id: "dossier3",
    clientId: "client3",
    client: clients[2],
    agentPhonerId: "phoner1",
    agentVisioId: "visio1",
    status: "valide",
    offres: [offres[0], offres[1], offres[2]],
    dateCreation: new Date("2023-03-15"),
    dateMiseAJour: new Date("2023-03-25"),
    dateRdv: new Date("2023-03-20"),
    dateValidation: new Date("2023-03-25"),
    montant: 1647
  },
  {
    id: "dossier4",
    clientId: "client4",
    client: clients[3],
    status: "prospect",
    offres: [],
    dateCreation: new Date("2023-04-10"),
    dateMiseAJour: new Date("2023-04-10")
  },
  {
    id: "dossier5",
    clientId: "client5",
    client: clients[4],
    agentPhonerId: "phoner1",
    agentVisioId: "visio1",
    status: "archive",
    offres: [offres[3]],
    dateCreation: new Date("2023-05-15"),
    dateMiseAJour: new Date("2023-06-20"),
    dateRdv: new Date("2023-05-20"),
    dateValidation: new Date("2023-05-25"),
    dateSignature: new Date("2023-06-01"),
    dateArchivage: new Date("2023-06-15"),
    montant: 599
  }
];

// Rendez-vous
export const rendezVous: RendezVous[] = [
  {
    id: "rdv1",
    dossierId: "dossier1",
    dossier: dossiers[0],
    date: new Date("2023-01-25T10:00:00"),
    honore: true,
    notes: "Client très intéressé par nos services SEO"
  },
  {
    id: "rdv2",
    dossierId: "dossier2",
    dossier: dossiers[1],
    date: new Date("2023-03-05T14:00:00"),
    honore: false,
    notes: "Client absent, essayer de reprogrammer"
  },
  {
    id: "rdv3",
    dossierId: "dossier3",
    dossier: dossiers[2],
    date: new Date("2023-03-20T11:30:00"),
    honore: true,
    notes: "Besoin d'une stratégie marketing complète"
  }
];

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
