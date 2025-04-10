
// This file is no longer needed as the importClientsFromCSV function 
// has been moved directly into clientService.ts
</lov-delete>

<lov-write file_path="src/services/index.ts">
export * from './client/clientService';
export * from './dossierService';
export * from './offreService';
export * from './statistiqueService';
export * from './authLogService';
export * from './userService';
export { clientService } from './client/clientService';
export { userService } from './userService';
export { offreService } from './offreService';
