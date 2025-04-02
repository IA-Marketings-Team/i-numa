
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Récupère tous les clients depuis Supabase
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        nom,
        prenom,
        email,
        telephone,
        role,
        date_creation,
        adresse,
        iban,
        secteur_activite,
        type_entreprise,
        besoins
      `)
      .eq('role', 'client');

    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      return [];
    }

    return data.map(client => ({
      id: client.id,
      nom: client.nom || '',
      prenom: client.prenom || '',
      email: client.email,
      telephone: client.telephone || '',
      role: 'client',
      dateCreation: new Date(client.date_creation),
      adresse: client.adresse || '',
      iban: client.iban,
      secteurActivite: client.secteur_activite || '',
      typeEntreprise: client.type_entreprise || '',
      besoins: client.besoins || ''
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
      .select(`
        id,
        nom,
        prenom,
        email,
        telephone,
        role,
        date_creation,
        adresse,
        iban,
        secteur_activite,
        type_entreprise,
        besoins
      `)
      .eq('id', id)
      .eq('role', 'client')
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email,
      telephone: data.telephone || '',
      role: 'client',
      dateCreation: new Date(data.date_creation),
      adresse: data.adresse || '',
      iban: data.iban,
      secteurActivite: data.secteur_activite || '',
      typeEntreprise: data.type_entreprise || '',
      besoins: data.besoins || ''
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération du client ${id}:`, error);
    return null;
  }
};

/**
 * Crée un nouveau client
 */
export const createClient = async (client: Omit<Client, "id" | "dateCreation">): Promise<Client | null> => {
  try {
    // Créer un nouvel utilisateur avec authentification
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: client.email,
      password: "password123", // Mot de passe temporaire, à changer dans une vraie application
      options: {
        data: {
          nom: client.nom,
          prenom: client.prenom,
          role: 'client'
        }
      }
    });
    
    if (authError) {
      console.error("Erreur lors de la création de l'utilisateur client:", authError);
      return null;
    }
    
    if (!authData.user) {
      console.error("Aucun utilisateur créé");
      return null;
    }
    
    // Mettre à jour le profil avec les informations supplémentaires
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        nom: client.nom,
        prenom: client.prenom,
        telephone: client.telephone,
        adresse: client.adresse,
        iban: client.iban,
        secteur_activite: client.secteurActivite,
        type_entreprise: client.typeEntreprise,
        besoins: client.besoins
      })
      .eq('id', authData.user.id);
    
    if (profileError) {
      console.error("Erreur lors de la mise à jour du profil client:", profileError);
      return null;
    }
    
    return {
      id: authData.user.id,
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      role: 'client',
      dateCreation: new Date(),
      adresse: client.adresse,
      iban: client.iban,
      secteurActivite: client.secteurActivite,
      typeEntreprise: client.typeEntreprise,
      besoins: client.besoins
    };
  } catch (error) {
    console.error("Erreur inattendue lors de la création du client:", error);
    return null;
  }
};

/**
 * Met à jour un client existant
 */
export const updateClient = async (id: string, updates: Partial<Client>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.nom !== undefined) updateData.nom = updates.nom;
    if (updates.prenom !== undefined) updateData.prenom = updates.prenom;
    if (updates.telephone !== undefined) updateData.telephone = updates.telephone;
    if (updates.adresse !== undefined) updateData.adresse = updates.adresse;
    if (updates.iban !== undefined) updateData.iban = updates.iban;
    if (updates.secteurActivite !== undefined) updateData.secteur_activite = updates.secteurActivite;
    if (updates.typeEntreprise !== undefined) updateData.type_entreprise = updates.typeEntreprise;
    if (updates.besoins !== undefined) updateData.besoins = updates.besoins;
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
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
 * Supprime un client (désactive le compte plutôt que de supprimer complètement)
 */
export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    // La suppression d'un utilisateur devrait être gérée avec précaution.
    // Dans un environnement de production, vous pourriez vouloir simplement le désactiver
    // ou conserver les données pour des raisons légales.
    const { error } = await supabase.auth.admin.deleteUser(id);
    
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
