
export interface Statistique {
  id?: string;
  periode: 'jour' | 'semaine' | 'mois';
  dateDebut: Date;
  dateFin: Date;
  appelsEmis: number;
  appelsDecroches: number;
  appelsTransformes: number;
  rendezVousHonores: number;
  rendezVousNonHonores: number;
  dossiersValides: number;
  dossiersSigne: number;
  chiffreAffaires?: number;
}
