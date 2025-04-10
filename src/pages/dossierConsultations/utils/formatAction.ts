
export const formatAction = (action: string): string => {
  switch (action) {
    case "view":
      return "Consultation";
    case "comment":
      return "Commentaire";
    case "call_note":
      return "Note d'appel";
    case "edit":
      return "Modification";
    case "status_change":
      return "Changement de statut";
    default:
      return action;
  }
};
