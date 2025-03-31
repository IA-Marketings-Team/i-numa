
import { OfferCategory } from "@/types";
import { Building2, Store, UtensilsCrossed, HeartPulse, Leaf, Briefcase, Home, Wrench, Package } from "lucide-react";

export const offerCategories: OfferCategory[] = [
  { 
    icon: Building2, 
    label: 'Professionnel du bâtiment',
    description: "Solutions adaptées aux professionnels du bâtiment pour gérer vos devis, factures et planning de chantier.",
    offerings: [
      {
        title: "Site Vitrine",
        price: "À partir de 60€ HT/mois",
        setupFee: "600€ HT de Frais de création",
        features: [
          {
            title: "Création d'un site web responsive design",
            items: [
              "Création graphique",
              "Accompagnement personnalisé par un chef de projet",
              "Jusqu'à 5 Pages de contenu rédigées pour vous",
              "Optimisation du site pour les moteurs de recherche",
              "Création et gestion d'une fiche Google My Business",
              "Création de pages Facebook"
            ]
          },
          {
            title: "Service et accompagnement",
            items: [
              "Suivi annuel par un conseiller dédié",
              "Accès au Service Clients du lundi au vendredi par téléphone et e-mail",
              "Hébergement + 2 noms de domaine + messagerie professionnelle cloud",
              "Interface administrateur : modification de contenus, accès aux statistiques de votre site",
              "Modifications du site incluses",
              "Accès aux statistiques de votre site en toute transparence",
              "Call tracking et Web call back pour analyser la performance du site"
            ]
          }
        ]
      },
      {
        title: "SEO",
        price: "À partir de 175€ HT/mois",
        setupFee: "1200€ HT de Frais de création",
        features: [
          {
            title: "Referencement naturel (SEO)",
            items: [
              "Rédaction de 30 Landing Pages",
              "Maillage interne Optimisé", 
              "Création de votre page GMB", 
              "Inscriptions annuaires", 
              "Rédaction d'articles de blog"
            ]
          },
          {
            title: "Service et accompagnement",
            items: [
              "Suivi et optmisation en continu",
              "Accès au Service Clients du lundi au vendredi par téléphone et e-mail"
            ]
          }
        ]
      }
    ]
  },
  { 
    icon: Store, 
    label: 'Commerçant',
    description: "Outils complets pour gérer votre commerce, de la caisse à la fidélisation client.",
    offerings: [
      {
        title: "Site E-commerce",
        price: "À partir de 75€ HT/mois",
        setupFee: "750€ HT de Frais de création",
        features: [
          {
            title: "Création boutique en ligne",
            items: [
              "Design responsive personnalisé",
              "Catalogue produits jusqu'à 100 références",
              "Module de paiement sécurisé",
              "Gestion des stocks intégrée",
              "Options de livraison configurables",
              "Module fidélité client"
            ]
          },
          {
            title: "Accompagnement et maintenance",
            items: [
              "Formation à l'utilisation de la plateforme",
              "Support technique prioritaire",
              "Mises à jour régulières",
              "Sauvegarde automatique des données",
              "Analyse des performances de vente",
              "Conseils d'optimisation trimestriels"
            ]
          }
        ]
      },
      {
        title: "Marketing Digital",
        price: "À partir de 65€ HT/mois",
        setupFee: "500€ HT de Frais initiaux",
        features: [
          {
            title: "Gestion réseaux sociaux",
            items: [
              "Publication hebdomadaire sur 2 réseaux sociaux",
              "Création de visuels adaptés",
              "Calendrier éditorial mensuel",
              "Animation de communauté",
              "Rapports de performance"
            ]
          },
          {
            title: "Campagnes marketing",
            items: [
              "E-mailing mensuel",
              "Retargeting publicitaire",
              "Promotions saisonnières",
              "Gestion des avis clients",
              "Analyse concurrentielle"
            ]
          }
        ]
      }
    ]
  },
  { 
    icon: UtensilsCrossed, 
    label: 'Restaurateur / Traiteur',
    description: "Solutions pour optimiser la gestion de votre restaurant ou service traiteur.",
    offerings: [
      {
        title: "Gestion Restaurant",
        price: "À partir de 55€ HT/mois",
        setupFee: "450€ HT de Frais de mise en place",
        features: [
          {
            title: "Système de commande en ligne",
            items: [
              "Prise de commandes simplifiée",
              "Gestion des réservations",
              "Personnalisation du menu digital",
              "Intégration avec les plateformes de livraison",
              "Suivi des commandes en temps réel"
            ]
          },
          {
            title: "Outils de fidélisation",
            items: [
              "Programme de fidélité intégré",
              "Envoi de promotions ciblées",
              "Collecte d'avis clients",
              "Analyse des préférences clients",
              "Gestion des événements spéciaux"
            ]
          }
        ]
      },
      {
        title: "Visibilité Web",
        price: "À partir de 70€ HT/mois",
        setupFee: "600€ HT de Frais initiaux",
        features: [
          {
            title: "Création de site web",
            items: [
              "Site web responsive design",
              "Optimisation pour le référencement local",
              "Intégration de photos et vidéos",
              "Mise en avant des spécialités",
              "Formulaire de contact et plan d'accès"
            ]
          },
          {
            title: "Marketing digital",
            items: [
              "Campagnes publicitaires ciblées",
              "Gestion des réseaux sociaux",
              "E-mailing promotionnel",
              "Partenariats influenceurs",
              "Analyse des performances web"
            ]
          }
        ]
      }
    ]
  },
  { 
    icon: HeartPulse, 
    label: 'Professionnel de la beauté / santé',
    description: "Applications dédiées aux professionnels de la beauté et de la santé pour gérer vos rendez-vous et clients.",
    offerings: [
      {
        title: "Gestion de Cabinet",
        price: "À partir de 45€ HT/mois",
        setupFee: "350€ HT de Frais de configuration",
        features: [
          {
            title: "Planification des rendez-vous",
            items: [
              "Prise de rendez-vous en ligne",
              "Gestion des disponibilités",
              "Rappels automatiques par SMS",
              "Synchronisation avec l'agenda personnel",
              "Gestion des absences et congés"
            ]
          },
          {
            title: "Suivi des patients/clients",
            items: [
              "Dossiers patients/clients digitalisés",
              "Historique des consultations",
              "Gestion des informations personnelles",
              "Suivi des traitements et prescriptions",
              "Facturation et encaissement"
            ]
          }
        ]
      },
      {
        title: "Communication digitale",
        price: "À partir de 60€ HT/mois",
        setupFee: "500€ HT de Frais de lancement",
        features: [
          {
            title: "Site web professionnel",
            items: [
              "Présentation des services et spécialités",
              "Témoignages de patients/clients",
              "Blog avec conseils et actualités",
              "Formulaire de contact et prise de RDV",
              "Optimisation pour le référencement local"
            ]
          },
          {
            title: "Marketing digital",
            items: [
              "Campagnes publicitaires ciblées",
              "Gestion des réseaux sociaux",
              "E-mailing d'information et de prévention",
              "Partenariats avec des influenceurs santé/beauté",
              "Analyse des performances web"
            ]
          }
        ]
      }
    ]
  },
  { 
    icon: Leaf, 
    label: 'Agriculteur',
    description: "Outils de gestion pour les exploitations agricoles, de la planification des cultures au suivi des stocks.",
    offerings: [
      {
        title: "Gestion Agricole",
        price: "À partir de 50€ HT/mois",
        setupFee: "400€ HT de Frais de démarrage",
        features: [
          {
            title: "Planification des cultures",
            items: [
              "Gestion des parcelles et rotations",
              "Suivi des semis et plantations",
              "Optimisation de l'irrigation",
              "Gestion des engrais et pesticides",
              "Analyse des sols et prévisions météo"
            ]
          },
          {
            title: "Suivi des stocks et ventes",
            items: [
              "Gestion des stocks de semences et récoltes",
              "Suivi des coûts de production",
              "Optimisation des ventes et contrats",
              "Facturation et encaissement",
              "Analyse des marges et rentabilité"
            ]
          }
        ]
      },
      {
        title: "Commercialisation directe",
        price: "À partir de 65€ HT/mois",
        setupFee: "550€ HT de Frais de création",
        features: [
          {
            title: "Boutique en ligne",
            items: [
              "Présentation des produits de la ferme",
              "Prise de commandes en ligne",
              "Paiement sécurisé",
              "Gestion des livraisons et expéditions",
              "Fidélisation de la clientèle"
            ]
          },
          {
            title: "Communication et marketing",
            items: [
              "Création de supports de communication",
              "Gestion des réseaux sociaux",
              "E-mailing promotionnel",
              "Participation à des événements locaux",
              "Analyse des ventes et satisfaction client"
            ]
          }
        ]
      }
    ]
  },
  { 
    icon: Briefcase, 
    label: 'Professionnel de services',
    description: "Solutions pour les professionnels de services : consultants, coaches, formateurs...",
    offerings: [
      {
        title: "Gestion de l'activité",
        price: "À partir de 40€ HT/mois",
        setupFee: "300€ HT de Frais de configuration",
        features: [
          {
            title: "Planification des interventions",
            items: [
              "Gestion des rendez-vous et disponibilités",
              "Suivi des missions et projets",
              "Facturation et encaissement",
              "Gestion des contrats et abonnements",
              "Analyse du temps passé et rentabilité"
            ]
          },
          {
            title: "Relation client",
            items: [
              "Gestion des contacts et prospects",
              "Suivi des échanges et demandes",
              "Envoi de devis et propositions",
              "Collecte d'avis et témoignages",
              "Fidélisation de la clientèle"
            ]
          }
        ]
      },
      {
        title: "Visibilité web",
        price: "À partir de 55€ HT/mois",
        setupFee: "450€ HT de Frais de création",
        features: [
          {
            title: "Site web professionnel",
            items: [
              "Présentation des services et expertises",
              "Blog avec articles et conseils",
              "Formulaire de contact et demande de devis",
              "Optimisation pour le référencement local",
              "Hébergement et maintenance inclus"
            ]
          },
          {
            title: "Marketing digital",
            items: [
              "Campagnes publicitaires ciblées",
              "Gestion des réseaux sociaux",
              "E-mailing d'information et de promotion",
              "Partenariats avec des influenceurs",
              "Analyse des performances web"
            ]
          }
        ]
      }
    ]
  },
  { 
    icon: Home, 
    label: 'Agent immobilier',
    description: "Applications pour agents immobiliers : gestion de biens, clients et visites.",
    offerings: [
      {
        title: "Gestion immobilière",
        price: "À partir de 60€ HT/mois",
        setupFee: "500€ HT de Frais de mise en place",
        features: [
          {
            title: "Gestion des biens",
            items: [
              "Création de fiches descriptives",
              "Mise en ligne sur les portails immobiliers",
              "Gestion des visites et prospects",
              "Suivi des mandats et contrats",
              "Facturation et encaissement"
            ]
          },
          {
            title: "Relation client",
            items: [
              "Gestion des contacts et demandes",
              "Envoi d'alertes et propositions",
              "Collecte d'avis et témoignages",
              "Fidélisation de la clientèle",
              "Analyse des besoins et préférences"
            ]
          }
        ]
      },
      {
        title: "Visibilité web",
        price: "À partir de 75€ HT/mois",
        setupFee: "600€ HT de Frais de création",
        features: [
          {
            title: "Site web professionnel",
            items: [
              "Présentation des biens et services",
              "Blog avec articles et conseils",
              "Formulaire de contact et demande de visite",
              "Optimisation pour le référencement local",
              "Hébergement et maintenance inclus"
            ]
          },
          {
            title: "Marketing digital",
            items: [
              "Campagnes publicitaires ciblées",
              "Gestion des réseaux sociaux",
              "E-mailing d'information et de promotion",
              "Partenariats avec des influenceurs",
              "Analyse des performances web"
            ]
          }
        ]
      }
    ]
  },
  { 
    icon: Wrench, 
    label: 'Garage automobile',
    description: "Outils spécialisés pour la gestion de garages et ateliers automobiles.",
    offerings: [
      {
        title: "Gestion d'atelier",
        price: "À partir de 55€ HT/mois",
        setupFee: "450€ HT de Frais de configuration",
        features: [
          {
            title: "Planification des interventions",
            items: [
              "Gestion des rendez-vous et disponibilités",
              "Suivi des réparations et entretiens",
              "Facturation et encaissement",
              "Gestion des stocks de pièces détachées",
              "Analyse du temps passé et rentabilité"
            ]
          },
          {
            title: "Relation client",
            items: [
              "Gestion des contacts et demandes",
              "Envoi de devis et confirmations",
              "Collecte d'avis et témoignages",
              "Fidélisation de la clientèle",
              "Suivi des véhicules et historique"
            ]
          }
        ]
      },
      {
        title: "Visibilité web",
        price: "À partir de 70€ HT/mois",
        setupFee: "550€ HT de Frais de création",
        features: [
          {
            title: "Site web professionnel",
            items: [
              "Présentation des services et expertises",
              "Blog avec articles et conseils",
              "Formulaire de contact et demande de devis",
              "Optimisation pour le référencement local",
              "Hébergement et maintenance inclus"
            ]
          },
          {
            title: "Marketing digital",
            items: [
              "Campagnes publicitaires ciblées",
              "Gestion des réseaux sociaux",
              "E-mailing d'information et de promotion",
              "Partenariats avec des influenceurs",
              "Analyse des performances web"
            ]
          }
        ]
      }
    ]
  },
  { 
    icon: Package, 
    label: 'Autres TPE / PME',
    description: "Solutions flexibles adaptables à tous types de TPE/PME.",
    offerings: [
      {
        title: "Gestion d'entreprise",
        price: "À partir de 35€ HT/mois",
        setupFee: "250€ HT de Frais de configuration",
        features: [
          {
            title: "Suivi de l'activité",
            items: [
              "Gestion des contacts et prospects",
              "Suivi des ventes et facturations",
              "Gestion des dépenses et budgets",
              "Analyse des performances et rentabilité",
              "Tableaux de bord personnalisés"
            ]
          },
          {
            title: "Relation client",
            items: [
              "Gestion des contacts et demandes",
              "Envoi de devis et propositions",
              "Collecte d'avis et témoignages",
              "Fidélisation de la clientèle",
              "Suivi des échanges et historique"
            ]
          }
        ]
      },
      {
        title: "Visibilité web",
        price: "À partir de 50€ HT/mois",
        setupFee: "400€ HT de Frais de création",
        features: [
          {
            title: "Site web professionnel",
            items: [
              "Présentation de l'entreprise et des services",
              "Blog avec articles et conseils",
              "Formulaire de contact et demande de devis",
              "Optimisation pour le référencement local",
              "Hébergement et maintenance inclus"
            ]
          },
          {
            title: "Marketing digital",
            items: [
              "Campagnes publicitaires ciblées",
              "Gestion des réseaux sociaux",
              "E-mailing d'information et de promotion",
              "Partenariats avec des influenceurs",
              "Analyse des performances web"
            ]
          }
        ]
      }
    ]
  },
];
