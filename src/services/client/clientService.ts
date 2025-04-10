
import { fetchClients } from './fetchClients';
import { fetchClientById } from './fetchClientById';
import { createClient } from './createClient';
import { updateClient } from './updateClient';
import { deleteClient } from './deleteClient';
import { importClientsFromCSV } from './importClientsFromCSV';

// Export du service client pour l'utiliser dans d'autres fichiers
export const clientService = {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  importClientsFromCSV
};

// Réexporter les fonctions individuelles
export {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  importClientsFromCSV
};
