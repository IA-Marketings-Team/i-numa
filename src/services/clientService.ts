
import { supabase } from "@/integrations/supabase/client";
import { Client, UserRole } from "@/types";

/**
 * Récupère tous les clients
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client');

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      return [];
    }

    return data.map(client => ({
      id: client.id,
      nom: client.nom || '',
      prenom: client.prenom || '',
      email: client.email || '',
      telephone: client.telephone || '',
      role: 'client' as UserRole,
      dateCreation: new Date(client.date_creation),
      adresse: client.adresse || '',
      ville: client.ville || '',
      codePostal: client.code_postal || '',
      iban: client.iban,
      bic: client.bic,
      nomBanque: client.nom_banque,
      secteurActivite: client.secteur_activite || '',
      typeEntreprise: client.type_entreprise || '',
      besoins: client.besoins || '',
      statutJuridique: client.statut_juridique || '',
      activiteDetail: client.activite_detail || '',
      siteWeb: client.site_web || '',
      moyensCommunication: client.moyens_communication || [],
      commentaires: client.commentaires || ''
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des clients:", error);
    return [];
  }
};

/**
 * Récupère un client par son ID
 */
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'client')
      .single();

    if (error || !data) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error);
      return null;
    }

    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: 'client' as UserRole,
      dateCreation: new Date(data.date_creation),
      adresse: data.adresse || '',
      ville: data.ville || '',
      codePostal: data.code_postal || '',
      iban: data.iban,
      bic: data.bic,
      nomBanque: data.nom_banque,
      secteurActivite: data.secteur_activite || '',
      typeEntreprise: data.type_entreprise || '',
      besoins: data.besoins || '',
      statutJuridique: data.statut_juridique || '',
      activiteDetail: data.activite_detail || '',
      siteWeb: data.site_web || '',
      moyensCommunication: data.moyens_communication || [],
      commentaires: data.commentaires || ''
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération du client ${id}:`, error);
    return null;
  }
};

/**
 * Crée un nouveau client
 */
export const createClient = async (clientData: Omit<Client, 'id' | 'dateCreation' | 'role'>): Promise<Client | null> => {
  try {
    // Fix the data structure to match what Supabase expects
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        nom: clientData.nom,
        prenom: clientData.prenom,
        email: clientData.email,
        telephone: clientData.telephone,
        role: 'client',
        date_creation: new Date().toISOString(),
        adresse: clientData.adresse,
        ville: clientData.ville,
        code_postal: clientData.codePostal,
        iban: clientData.iban,
        bic: clientData.bic,
        nom_banque: clientData.nomBanque,
        secteur_activite: clientData.secteurActivite,
        type_entreprise: clientData.typeEntreprise,
        besoins: clientData.besoins,
        statut_juridique: clientData.statutJuridique,
        activite_detail: clientData.activiteDetail,
        site_web: clientData.siteWeb,
        moyens_communication: clientData.moyensCommunication,
        commentaires: clientData.commentaires
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Erreur lors de la création du client:", error);
      return null;
    }

    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: 'client' as UserRole,
      dateCreation: new Date(data.date_creation),
      adresse: data.adresse || '',
      ville: data.ville || '',
      codePostal: data.code_postal || '',
      iban: data.iban,
      bic: data.bic,
      nomBanque: data.nom_banque,
      secteurActivite: data.secteur_activite || '',
      typeEntreprise: data.type_entreprise || '',
      besoins: data.besoins || '',
      statutJuridique: data.statut_juridique || '',
      activiteDetail: data.activite_detail || '',
      siteWeb: data.site_web || '',
      moyensCommunication: data.moyens_communication || [],
      commentaires: data.commentaires || ''
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création du client:", error);
    return null;
  }
};

/**
 * Met à jour un client existant
 */
export const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id' | 'dateCreation' | 'role'>>): Promise<boolean> => {
  try {
    // Convertir les champs clients vers le format de la base de données
    const dbData: any = {};
    if (clientData.nom !== undefined) dbData.nom = clientData.nom;
    if (clientData.prenom !== undefined) dbData.prenom = clientData.prenom;
    if (clientData.email !== undefined) dbData.email = clientData.email;
    if (clientData.telephone !== undefined) dbData.telephone = clientData.telephone;
    if (clientData.adresse !== undefined) dbData.adresse = clientData.adresse;
    if (clientData.ville !== undefined) dbData.ville = clientData.ville;
    if (clientData.codePostal !== undefined) dbData.code_postal = clientData.codePostal;
    if (clientData.iban !== undefined) dbData.iban = clientData.iban;
    if (clientData.bic !== undefined) dbData.bic = clientData.bic;
    if (clientData.nomBanque !== undefined) dbData.nom_banque = clientData.nomBanque;
    if (clientData.secteurActivite !== undefined) dbData.secteur_activite = clientData.secteurActivite;
    if (clientData.typeEntreprise !== undefined) dbData.type_entreprise = clientData.typeEntreprise;
    if (clientData.besoins !== undefined) dbData.besoins = clientData.besoins;
    if (clientData.statutJuridique !== undefined) dbData.statut_juridique = clientData.statutJuridique;
    if (clientData.activiteDetail !== undefined) dbData.activite_detail = clientData.activiteDetail;
    if (clientData.siteWeb !== undefined) dbData.site_web = clientData.siteWeb;
    if (clientData.moyensCommunication !== undefined) dbData.moyens_communication = clientData.moyensCommunication;
    if (clientData.commentaires !== undefined) dbData.commentaires = clientData.commentaires;

    const { error } = await supabase
      .from('profiles')
      .update(dbData)
      .eq('id', id)
      .eq('role', 'client');

    if (error) {
      console.error(`Erreur lors de la mise à jour du client ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la mise à jour du client ${id}:`, error);
    return false;
  }
};

/**
 * Supprime un client existant
 */
export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .eq('role', 'client');

    if (error) {
      console.error(`Erreur lors de la suppression du client ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur inattendue lors de la suppression du client ${id}:`, error);
    return false;
  }
};

/**
 * Importe des clients à partir d'un fichier CSV
 */
export const importClientsFromCSV = async (file: File): Promise<{ 
  success: boolean; 
  imported?: number; 
  error?: string;
}> => {
  try {
    const text = await file.text();
    const rows = text.split('\n');
    
    // Parse CSV header
    const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
    
    // Verify required fields
    const requiredHeaders = ['nom', 'prenom', 'email'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return {
        success: false,
        error: `Champs obligatoires manquants: ${missingHeaders.join(', ')}`
      };
    }
    
    // Parse data rows
    const clients = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;
      
      const values = row.split(',');
      if (values.length !== headers.length) {
        console.warn(`La ligne ${i + 1} ne correspond pas aux en-têtes et sera ignorée.`);
        continue;
      }
      
      const client: Record<string, any> = {};
      headers.forEach((header, index) => {
        client[header] = values[index].trim();
      });
      
      // Skip empty required fields
      if (!client.nom || !client.prenom || !client.email) {
        console.warn(`La ligne ${i + 1} a des champs obligatoires manquants et sera ignorée.`);
        continue;
      }
      
      // Map field names correctly to match the database columns
      clients.push({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone || '',
        role: 'client',
        date_creation: new Date().toISOString(),
        adresse: client.adresse || '',
        ville: client.ville || '',
        code_postal: client.code_postal || client.codepostal || '',
        secteur_activite: client.secteur_activite || '',
        type_entreprise: client.type_entreprise || ''
      });
    }
    
    if (clients.length === 0) {
      return {
        success: false,
        error: 'Aucun client valide trouvé dans le fichier.'
      };
    }
    
    // Insert clients in batch with the correct field structure
    // The schema requires id field, but since we want Supabase to generate it
    // we need to use upsert with onConflict do nothing
    const { error } = await supabase
      .from('profiles')
      .upsert(clients, { 
        onConflict: undefined,
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error("Erreur lors de l'import des clients:", error);
      return {
        success: false,
        error: `Erreur lors de l'import: ${error.message}`
      };
    }
    
    return {
      success: true,
      imported: clients.length
    };
  } catch (error) {
    console.error("Erreur inattendue lors de l'import des clients:", error);
    return {
      success: false,
      error: "Une erreur inattendue est survenue lors de l'import."
    };
  }
};

// Export du service client pour l'utiliser dans d'autres fichiers
export const clientService = {
  fetchClients,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
  importClientsFromCSV
};
