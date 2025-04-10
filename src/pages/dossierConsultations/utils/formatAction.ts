
export const formatAction = (action: string): string => {
  const actionMap: Record<string, string> = {
    'view': 'Consultation',
    'edit': 'Modification',
    'create': 'Création',
    'delete': 'Suppression',
    'export': 'Export',
    'import': 'Import',
    'comment': 'Commentaire',
    'call': 'Appel',
    'meeting': 'Rendez-vous'
  };
  
  return actionMap[action] || action;
};
