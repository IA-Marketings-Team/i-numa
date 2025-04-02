
import { Offre } from "@/types";

// Offres with new structure
export const offres: Offre[] = [
  {
    id: "offre1",
    nom: "E-réputation",
    description: "Améliorez votre réputation en ligne",
    type: "E-réputation",
    prix: 250,
    prixMensuel: "250€",
    fraisCreation: "300€",
    sections: [
      {
        id: "section1",
        titre: "Community Management",
        offreId: "offre1",
        estOuvertParDefaut: true,
        items: [
          "Audit de votre E-réputation",
          "Création de vos pages Google My Business, Facebook, Instagram",
          "Publication hebdomadaire sur vos réseaux",
          "Newsletter mensuelle",
          "Modération des avis négatifs",
          "Rapports de suivi mensuels",
          "Accès à un expert dédié"
        ]
      }
    ]
  },
  {
    id: "offre2",
    nom: "Deliver",
    description: "Solutions de livraison et réservation pour restaurants",
    type: "Deliver",
    prix: 60,
    prixMensuel: "60€",
    fraisCreation: "200€",
    sections: [
      {
        id: "section2",
        titre: "Réservation de tables",
        offreId: "offre2",
        estOuvertParDefaut: true,
        items: [
          "Système de réservation",
          "Gestion des clients",
          "Aucune limite de réservation",
          "Intégration à votre site internet et réseaux sociaux",
          "Statistiques de votre activité",
          "Formation à la solution",
          "Service client 5j/7"
        ]
      },
      {
        id: "section3",
        titre: "Click & Collect",
        offreId: "offre2",
        estOuvertParDefaut: true,
        items: [
          "E-boutique",
          "Aucune limite de commande",
          "Paiement en ligne",
          "Intégration à votre site internet et réseaux sociaux",
          "Statistiques de votre activité",
          "Formation à la solution",
          "Service client 5j/7"
        ]
      },
      {
        id: "section4",
        titre: "QR Code",
        offreId: "offre2",
        estOuvertParDefaut: false,
        items: [
          "E-boutique",
          "Aucune limite de commande",
          "Paiement en ligne",
          "Intégration à votre site internet et réseaux sociaux",
          "Statistiques de votre activité",
          "Formation à la solution",
          "Service client 5j/7"
        ]
      }
    ]
  },
  {
    id: "offre3",
    nom: "Facebook / Instagram Ads",
    description: "Campagnes publicitaires sur les réseaux sociaux",
    type: "Facebook/Instagram Ads",
    prix: 150,
    prixMensuel: "150€",
    fraisCreation: "200€",
    sections: [
      {
        id: "section5",
        titre: "Facebook / Instagram Ads",
        offreId: "offre3",
        estOuvertParDefaut: false,
        items: [
          "Sélection de l'audience et de la zone de chalandise",
          "Construction et rédaction des annonces",
          "Suivi des budgets et optimisation"
        ]
      },
      {
        id: "section6",
        titre: "Service et accompagnement",
        offreId: "offre3",
        estOuvertParDefaut: false,
        items: [
          "Rapports de performance mensuels",
          "Contacts privilégiés avec nos experts"
        ]
      }
    ]
  },
  {
    id: "offre4",
    nom: "SEO Premium",
    description: "Référencement naturel optimisé",
    type: "SEO",
    prix: 199,
    prixMensuel: "199€",
    fraisCreation: "400€",
    sections: [
      {
        id: "section7",
        titre: "Référencement naturel",
        offreId: "offre4",
        estOuvertParDefaut: true,
        items: [
          "Audit initial complet",
          "Optimisation on-page",
          "Optimisation technique",
          "Création de contenu optimisé",
          "Suivi des positions et de la visibilité",
          "Rapports mensuels détaillés"
        ]
      },
      {
        id: "section8",
        titre: "Support et accompagnement",
        offreId: "offre4",
        estOuvertParDefaut: false,
        items: [
          "Conseiller SEO dédié",
          "Réunions trimestrielles de suivi",
          "Formation aux bonnes pratiques SEO",
          "Support technique prioritaire"
        ]
      }
    ]
  },
  {
    id: "offre5",
    nom: "Google Ads Performance",
    description: "Campagnes Google Ads optimisées",
    type: "Google Ads",
    prix: 299,
    prixMensuel: "299€",
    fraisCreation: "350€",
    sections: [
      {
        id: "section9",
        titre: "Gestion de campagnes",
        offreId: "offre5",
        estOuvertParDefaut: true,
        items: [
          "Audit des campagnes existantes",
          "Création et configuration de nouvelles campagnes",
          "Sélection des mots-clés et enchères",
          "Création d'annonces optimisées",
          "Optimisation continue des campagnes",
          "Suivi et ajustement du budget"
        ]
      },
      {
        id: "section10",
        titre: "Reporting et expertise",
        offreId: "offre5",
        estOuvertParDefaut: false,
        items: [
          "Rapports de performance hebdomadaires",
          "Analyse de la concurrence",
          "Recommandations stratégiques mensuelles",
          "Expert Google Ads certifié dédié"
        ]
      }
    ]
  }
];
