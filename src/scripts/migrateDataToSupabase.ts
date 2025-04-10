
import { supabase } from "@/integrations/supabase/client";
import { teams } from "@/data/mock/teams";
import { offres } from "@/data/mock/offres";
import { users } from "@/data/mock/users";
import { agents } from "@/data/mock/agents";
import { clients } from "@/data/mock/clients";
import { dossiers } from "@/data/mock/dossiers";
import { rendezVous } from "@/data/mock/rendezVous";
import { statistiques } from "@/data/mock/statistiques";
import { tasks } from "@/data/mock/tasks";
import { initialNotifications } from "@/data/mock/notifications";

/**
 * Script pour migrer toutes les données mockées vers Supabase
 * À exécuter une seule fois pour initialiser la base de données
 */
export const migrateData = async () => {
  try {
    console.log("Début de la migration des données vers Supabase...");
    
    // 1. Migrer les équipes
    console.log("Migration des équipes...");
    for (const team of teams) {
      const { error } = await supabase
        .from('teams')
        .insert({
          id: team.id,
          nom: team.nom,
          fonction: team.fonction,
          description: team.description,
          date_creation: team.dateCreation.toISOString()
        });
      
      if (error) console.error(`Erreur lors de la migration de l'équipe ${team.id}:`, error);
    }
    
    // 2. Migrer les offres
    console.log("Migration des offres...");
    for (const offre of offres) {
      const { error } = await supabase
        .from('offres')
        .insert({
          id: offre.id,
          nom: offre.nom,
          description: offre.description,
          type: offre.type,
          prix: offre.prix
        });
      
      if (error) console.error(`Erreur lors de la migration de l'offre ${offre.id}:`, error);
    }
    
    // 3. Créer les utilisateurs
    console.log("Migration des utilisateurs...");
    
    // Combiner les utilisateurs, clients et agents pour éviter les doublons
    const allUsers = [...users];
    
    for (const user of allUsers) {
      // D'abord créer l'utilisateur dans auth.users via l'API d'authentification
      // Note: Dans une vraie migration, il faudrait gérer les mots de passe correctement
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: "password123", // Mot de passe temporaire
        options: {
          data: {
            nom: user.nom,
            prenom: user.prenom,
            role: user.role
          }
        }
      });
      
      if (authError) {
        console.error(`Erreur lors de la création de l'utilisateur ${user.email}:`, authError);
        continue;
      }
      
      // Mettre à jour le profil avec les données supplémentaires
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          role: user.role,
          adresse: user.adresse,
          ville: user.ville,
          code_postal: user.codePostal,
          iban: user.iban,
          bic: user.bic,
          nom_banque: user.nomBanque,
          date_creation: user.dateCreation.toISOString()
        })
        .eq('id', authData?.user?.id || '');
      
      if (profileError) console.error(`Erreur lors de la mise à jour du profil ${user.id}:`, profileError);
      
      // Si c'est un client, ajouter les champs spécifiques
      const client = clients.find(c => c.id === user.id);
      if (client) {
        const { error: clientError } = await supabase
          .from('profiles')
          .update({
            secteur_activite: client.secteurActivite,
            type_entreprise: client.typeEntreprise,
            besoins: client.besoins
          })
          .eq('id', authData?.user?.id || '');
        
        if (clientError) console.error(`Erreur lors de la mise à jour du client ${client.id}:`, clientError);
      }
      
      // Si c'est un agent, ajouter les champs spécifiques
      const agent = agents.find(a => a.id === user.id);
      if (agent) {
        const { error: agentError } = await supabase
          .from('profiles')
          .update({
            equipe_id: agent.equipeId,
            appels_emis: agent.statistiques.appelsEmis,
            appels_decroches: agent.statistiques.appelsDecroches,
            appels_transformes: agent.statistiques.appelsTransformes,
            rendez_vous_honores: agent.statistiques.rendezVousHonores,
            rendez_vous_non_honores: agent.statistiques.rendezVousNonHonores,
            dossiers_valides: agent.statistiques.dossiersValides,
            dossiers_signe: agent.statistiques.dossiersSigne
          })
          .eq('id', authData?.user?.id || '');
        
        if (agentError) console.error(`Erreur lors de la mise à jour de l'agent ${agent.id}:`, agentError);
      }
    }
    
    // Maintenant, ajoutons spécifiquement les 5 clients fournis
    console.log("Migration des 5 clients spécifiques...");
    const specialClients = [
      {
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
    
    for (const client of specialClients) {
      // Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: client.email,
        password: "password123", // Mot de passe temporaire
        options: {
          data: {
            nom: client.nom,
            prenom: client.prenom,
            role: client.role
          }
        }
      });
      
      if (authError) {
        console.error(`Erreur lors de la création du client ${client.email}:`, authError);
        continue;
      }
      
      if (authData?.user) {
        // Mettre à jour le profil avec les données supplémentaires
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            nom: client.nom,
            prenom: client.prenom,
            email: client.email,
            telephone: client.telephone,
            role: client.role,
            adresse: client.adresse,
            iban: client.iban,
            date_creation: client.dateCreation.toISOString(),
            secteur_activite: client.secteurActivite,
            type_entreprise: client.typeEntreprise,
            besoins: client.besoins
          })
          .eq('id', authData.user.id);
        
        if (profileError) {
          console.error(`Erreur lors de la mise à jour du profil client ${client.email}:`, profileError);
        } else {
          console.log(`Client ${client.prenom} ${client.nom} migré avec succès!`);
        }
      }
    }
    
    // 4. Migrer les dossiers
    console.log("Migration des dossiers...");
    
    // Récupérer tous les utilisateurs dans Supabase pour créer le mapping
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email');
    
    if (profilesError) {
      console.error("Erreur lors de la récupération des profils:", profilesError);
      return;
    }
    
    // Créer le mapping en utilisant l'email comme clé commune
    const userIdMap = new Map<string, string>();
    for (const user of [...users, ...clients, ...agents]) {
      const profile = profilesData.find(p => p.email === user.email);
      if (profile) {
        userIdMap.set(user.id, profile.id);
      }
    }
    
    // Migrer les dossiers avec les nouveaux IDs
    for (const dossier of dossiers) {
      const clientId = userIdMap.get(dossier.clientId);
      const agentPhonerId = dossier.agentPhonerId ? userIdMap.get(dossier.agentPhonerId) : null;
      const agentVisioId = dossier.agentVisioId ? userIdMap.get(dossier.agentVisioId) : null;
      
      if (!clientId) {
        console.error(`Client ID non trouvé pour le dossier ${dossier.id}`);
        continue;
      }
      
      const { data, error } = await supabase
        .from('dossiers')
        .insert({
          id: dossier.id,
          client_id: clientId,
          agent_phoner_id: agentPhonerId,
          agent_visio_id: agentVisioId,
          status: dossier.status,
          notes: dossier.notes,
          montant: dossier.montant,
          date_creation: dossier.dateCreation.toISOString(),
          date_mise_a_jour: dossier.dateMiseAJour.toISOString(),
          date_rdv: dossier.dateRdv?.toISOString(),
          date_validation: dossier.dateValidation?.toISOString(),
          date_signature: dossier.dateSignature?.toISOString(),
          date_archivage: dossier.dateArchivage?.toISOString()
        })
        .select();
      
      if (error) {
        console.error(`Erreur lors de la migration du dossier ${dossier.id}:`, error);
        continue;
      }
      
      // Ajouter les offres au dossier
      if (dossier.offres && dossier.offres.length > 0) {
        const dossierOffres = dossier.offres.map(offre => ({
          dossier_id: dossier.id,
          offre_id: offre.id
        }));
        
        const { error: offresError } = await supabase
          .from('dossier_offres')
          .insert(dossierOffres);
        
        if (offresError) console.error(`Erreur lors de l'ajout des offres au dossier ${dossier.id}:`, offresError);
      }
    }
    
    // 5. Migrer les rendez-vous
    console.log("Migration des rendez-vous...");
    for (const rdv of rendezVous) {
      const { error } = await supabase
        .from('rendez_vous')
        .insert({
          id: rdv.id,
          dossier_id: rdv.dossierId,
          date: rdv.date.toISOString(),
          honore: rdv.honore,
          notes: rdv.notes,
          meeting_link: rdv.meetingLink,
          location: rdv.location
        });
      
      if (error) console.error(`Erreur lors de la migration du rendez-vous ${rdv.id}:`, error);
    }
    
    // 6. Migrer les tâches
    console.log("Migration des tâches...");
    for (const task of tasks) {
      const agentId = userIdMap.get(task.agentId);
      
      if (!agentId) {
        console.error(`Agent ID non trouvé pour la tâche ${task.id}`);
        continue;
      }
      
      const { error } = await supabase
        .from('tasks')
        .insert({
          id: task.id,
          title: task.title,
          description: task.description,
          agent_id: agentId,
          status: task.status,
          date_creation: task.dateCreation.toISOString(),
          date_echeance: task.dateEcheance?.toISOString(),
          priority: task.priority
        });
      
      if (error) console.error(`Erreur lors de la migration de la tâche ${task.id}:`, error);
    }
    
    // 7. Migrer les statistiques
    console.log("Migration des statistiques...");
    for (const stat of statistiques) {
      const { error } = await supabase
        .from('statistiques_backup')
        .insert({
          periode: stat.periode,
          date_debut: stat.dateDebut.toISOString(),
          date_fin: stat.dateFin.toISOString(),
          appels_emis: stat.appelsEmis,
          appels_decroches: stat.appelsDecroches,
          appels_transformes: stat.appelsTransformes,
          rendez_vous_honores: stat.rendezVousHonores,
          rendez_vous_non_honores: stat.rendezVousNonHonores,
          dossiers_valides: stat.dossiersValides,
          dossiers_signe: stat.dossiersSigne,
          chiffre_affaires: stat.chiffreAffaires
        });
      
      if (error) console.error(`Erreur lors de la migration des statistiques:`, error);
    }
    
    // 8. Migrer les notifications
    console.log("Migration des notifications...");
    for (const notif of initialNotifications) {
      const { error } = await supabase
        .from('notifications')
        .insert({
          id: notif.id,
          title: notif.title,
          description: notif.description,
          time: notif.time,
          read: notif.read,
          type: notif.type,
          link: notif.link,
          action: notif.action
        });
      
      if (error) console.error(`Erreur lors de la migration de la notification ${notif.id}:`, error);
    }
    
    console.log("Migration des données terminée avec succès !");
    
  } catch (error) {
    console.error("Erreur lors de la migration des données:", error);
  }
};

// Fonction pour exécuter la migration
export const runMigration = async () => {
  const confirmed = window.confirm("Êtes-vous sûr de vouloir migrer toutes les données vers Supabase ? Cette opération est irréversible.");
  if (confirmed) {
    await migrateData();
  }
};
