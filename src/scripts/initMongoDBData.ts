
import { getCurrentUser } from "@/lib/realm";

/**
 * Script pour initialiser les données dans MongoDB
 */
export const initializeMongoDBData = async () => {
  try {
    const realmUser = getCurrentUser();
    if (!realmUser) {
      throw new Error("Utilisateur Realm non connecté");
    }
    
    const db = realmUser.mongoClient("mongodb-atlas").db("inuma");
    
    // Initialiser les utilisateurs
    await initializeUsers(db);
    
    // Initialiser les équipes
    await initializeTeams(db);
    
    // Initialiser les offres
    await initializeOffres(db);
    
    // Initialiser les dossiers
    await initializeDossiers(db);
    
    // Initialiser les statistiques
    await initializeStatistiques(db);
    
    console.log("Initialisation des données MongoDB terminée avec succès!");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données MongoDB:", error);
    return false;
  }
};

// Fonction pour initialiser les utilisateurs
async function initializeUsers(db: any) {
  const usersCollection = db.collection("users");
  
  // Vérifier si des utilisateurs existent déjà
  const count = await usersCollection.count({});
  if (count > 0) {
    console.log("Des utilisateurs existent déjà, initialisation ignorée.");
    return;
  }
  
  // Créer quelques utilisateurs de base
  const users = [
    {
      nom: "Admin",
      prenom: "Super",
      email: "admin@inuma.fr",
      telephone: "0123456789",
      role: "responsable",
      date_creation: new Date(),
      mot_de_passe_hash: "$2a$10$XYZ..." // Normalement hashé correctement
    },
    {
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@inuma.fr",
      telephone: "0123456780",
      role: "agent_phoner",
      date_creation: new Date(),
      equipe_id: "team1",
      appels_emis: 120,
      appels_decroches: 80,
      appels_transformes: 40,
      rendez_vous_honores: 30,
      rendez_vous_non_honores: 10,
      dossiers_valides: 20,
      dossiers_signe: 15,
      mot_de_passe_hash: "$2a$10$XYZ..."
    },
    // Ajoutez d'autres utilisateurs selon vos besoins
  ];
  
  await usersCollection.insertMany(users);
  console.log("Utilisateurs initialisés avec succès!");
}

// Fonction pour initialiser les équipes
async function initializeTeams(db: any) {
  const teamsCollection = db.collection("teams");
  
  // Vérifier si des équipes existent déjà
  const count = await teamsCollection.count({});
  if (count > 0) {
    console.log("Des équipes existent déjà, initialisation ignorée.");
    return;
  }
  
  // Créer quelques équipes de base
  const teams = [
    {
      _id: "team1",
      nom: "Équipe Phoning",
      fonction: "phoning",
      description: "Équipe spécialisée dans le démarchage téléphonique",
      date_creation: new Date()
    },
    {
      _id: "team2",
      nom: "Équipe Visio",
      fonction: "visio",
      description: "Équipe spécialisée dans les rendez-vous en visioconférence",
      date_creation: new Date()
    },
    // Ajoutez d'autres équipes selon vos besoins
  ];
  
  await teamsCollection.insertMany(teams);
  console.log("Équipes initialisées avec succès!");
}

// Fonction pour initialiser les offres
async function initializeOffres(db: any) {
  const offresCollection = db.collection("offres");
  
  // Vérifier si des offres existent déjà
  const count = await offresCollection.count({});
  if (count > 0) {
    console.log("Des offres existent déjà, initialisation ignorée.");
    return;
  }
  
  // Créer quelques offres de base
  const offres = [
    {
      nom: "SEO Pack Basic",
      description: "Pack de référencement de base pour les petites entreprises",
      type: "SEO",
      prix: 499
    },
    {
      nom: "Google Ads Premium",
      description: "Campagne Google Ads complète avec suivi personnalisé",
      type: "Google Ads",
      prix: 799
    },
    // Ajoutez d'autres offres selon vos besoins
  ];
  
  await offresCollection.insertMany(offres);
  console.log("Offres initialisées avec succès!");
}

// Fonction pour initialiser les dossiers
async function initializeDossiers(db: any) {
  const dossiersCollection = db.collection("dossiers");
  
  // Vérifier si des dossiers existent déjà
  const count = await dossiersCollection.count({});
  if (count > 0) {
    console.log("Des dossiers existent déjà, initialisation ignorée.");
    return;
  }
  
  // Créer quelques dossiers de base (vous devrez ajuster les IDs pour qu'ils correspondent à vos utilisateurs)
  const dossiers = [
    {
      client_id: "client1",
      agent_phoner_id: "agent1",
      agent_visio_id: null,
      status: "prospect",
      notes: "Client intéressé par nos services SEO",
      montant: null,
      date_creation: new Date(),
      date_mise_a_jour: new Date(),
      offres: ["offre1"]
    },
    // Ajoutez d'autres dossiers selon vos besoins
  ];
  
  await dossiersCollection.insertMany(dossiers);
  console.log("Dossiers initialisés avec succès!");
}

// Fonction pour initialiser les statistiques
async function initializeStatistiques(db: any) {
  const statistiquesCollection = db.collection("statistiques");
  
  // Vérifier si des statistiques existent déjà
  const count = await statistiquesCollection.count({});
  if (count > 0) {
    console.log("Des statistiques existent déjà, initialisation ignorée.");
    return;
  }
  
  // Créer quelques statistiques de base
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  const statistiques = [
    {
      periode: "mois",
      date_debut: oneMonthAgo,
      date_fin: now,
      appels_emis: 1200,
      appels_decroches: 800,
      appels_transformes: 400,
      rendez_vous_honores: 300,
      rendez_vous_non_honores: 100,
      dossiers_valides: 200,
      dossiers_signe: 150,
      chiffre_affaires: 75000
    },
    // Ajoutez d'autres statistiques selon vos besoins
  ];
  
  await statistiquesCollection.insertMany(statistiques);
  console.log("Statistiques initialisées avec succès!");
}
