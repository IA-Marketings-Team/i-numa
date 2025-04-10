
export interface UserListItem {
  id: string;
  name: string;
}

export interface DossierListItem {
  id: string;
  client_name: string;
}

export interface Filters {
  search: string;
  userFilter: string;
  actionFilter: string;
  dateFilter: Date | undefined;
  dossierFilter: string;
}
