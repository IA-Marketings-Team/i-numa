
export interface UserListItem {
  id: string;
  name: string;
  role: string;
}

export interface DossierListItem {
  id: string;
  label: string;
}

export interface Filters {
  search: string;
  userFilter: string;
  actionFilter: string;
  dateFilter?: Date;
  dossierFilter: string;
}
