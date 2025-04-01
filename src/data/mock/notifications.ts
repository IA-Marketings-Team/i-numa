
import { Notification } from "@/components/notifications/NotificationsList";

export const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouveau rendez-vous",
    description: "Un rendez-vous a été planifié avec Jean Dupont pour demain à 14h00",
    time: "Il y a 30 minutes",
    read: false,
    type: "info",
    link: "/dossiers/123",
    action: "Voir le dossier"
  },
  {
    id: "2",
    title: "Validation requise",
    description: "Le dossier #2458 requiert votre validation pour passer à l'étape suivante",
    time: "Il y a 2 heures",
    read: false,
    type: "warning",
    link: "/dossiers/2458",
    action: "Valider"
  },
  {
    id: "3",
    title: "Contrat signé",
    description: "Marie Martin a signé le contrat pour l'offre Premium",
    time: "Hier",
    read: true,
    type: "success",
    link: "/dossiers/987",
    action: "Consulter"
  },
  {
    id: "4",
    title: "Rappel de rendez-vous",
    description: "Vous avez un rendez-vous téléphonique avec Sophie Bernard demain à 10h00",
    time: "Hier",
    read: true,
    type: "info",
    link: "/dossiers/654",
    action: "Voir l'agenda"
  },
  {
    id: "5",
    title: "Mise à jour système",
    description: "Une mise à jour du système est prévue ce soir à 22h00. L'application sera indisponible pendant 30 minutes.",
    time: "Il y a 2 jours",
    read: true,
    type: "warning"
  },
  {
    id: "6",
    title: "Formation disponible",
    description: "Une nouvelle formation sur les techniques de vente est disponible dans votre espace de formation.",
    time: "Il y a 3 jours",
    read: true,
    type: "info",
    link: "/formations",
    action: "Accéder"
  },
  {
    id: "7",
    title: "Objectifs mensuels",
    description: "Vous avez atteint 85% de vos objectifs ce mois-ci. Continuez ainsi !",
    time: "Il y a 4 jours",
    read: true,
    type: "success",
    link: "/statistiques",
    action: "Voir détails"
  },
  {
    id: "8",
    title: "Nouveau client potentiel",
    description: "Un nouveau prospect a été ajouté à votre liste. Contactez-le dès que possible.",
    time: "Il y a 5 jours",
    read: true,
    type: "info",
    link: "/clients/456",
    action: "Voir profil"
  },
  {
    id: "9",
    title: "Réunion d'équipe",
    description: "Une réunion d'équipe est planifiée pour lundi prochain à 9h00.",
    time: "Il y a 1 semaine",
    read: true,
    type: "info"
  },
  {
    id: "10",
    title: "Nouveau document",
    description: "Un nouveau document a été ajouté à la bibliothèque de ressources.",
    time: "Il y a 1 semaine",
    read: true,
    type: "info",
    link: "/ressources",
    action: "Consulter"
  }
];
