
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";

export const getClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from("clients")
    .select(`
      id,
      secteur_activite,
      type_entreprise,
      besoins,
      users:id (*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching client:", error);
    return null;
  }

  const user = data.users;
  
  return {
    id: data.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    role: user.role,
    dateCreation: new Date(user.date_creation),
    adresse: user.adresse || "",
    ville: user.ville || undefined,
    codePostal: user.code_postal || undefined,
    iban: user.iban || undefined,
    bic: user.bic || undefined,
    nomBanque: user.nom_banque || undefined,
    secteurActivite: data.secteur_activite,
    typeEntreprise: data.type_entreprise,
    besoins: data.besoins
  };
};

export const getAllClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from("clients")
    .select(`
      id,
      secteur_activite,
      type_entreprise,
      besoins,
      users:id (*)
    `)
    .order("id");

  if (error) {
    console.error("Error fetching clients:", error);
    return [];
  }

  return data.map((item) => {
    const user = item.users;
    
    return {
      id: item.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      dateCreation: new Date(user.date_creation),
      adresse: user.adresse || "",
      ville: user.ville || undefined,
      codePostal: user.code_postal || undefined,
      iban: user.iban || undefined,
      bic: user.bic || undefined,
      nomBanque: user.nom_banque || undefined,
      secteurActivite: item.secteur_activite,
      typeEntreprise: item.type_entreprise,
      besoins: item.besoins
    };
  });
};

export const createClient = async (client: Omit<Client, "id" | "dateCreation">): Promise<Client | null> => {
  // D'abord créer l'utilisateur
  const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([
      {
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone,
        role: "client",
        adresse: client.adresse,
        ville: client.ville,
        code_postal: client.codePostal,
        iban: client.iban,
        bic: client.bic,
        nom_banque: client.nomBanque
      }
    ])
    .select()
    .single();

  if (userError) {
    console.error("Error creating user for client:", userError);
    return null;
  }

  // Ensuite créer le client associé
  const { data: clientData, error: clientError } = await supabase
    .from("clients")
    .insert([
      {
        id: userData.id,
        secteur_activite: client.secteurActivite,
        type_entreprise: client.typeEntreprise,
        besoins: client.besoins
      }
    ])
    .select()
    .single();

  if (clientError) {
    console.error("Error creating client:", clientError);
    return null;
  }

  return {
    id: userData.id,
    nom: userData.nom,
    prenom: userData.prenom,
    email: userData.email,
    telephone: userData.telephone,
    role: userData.role,
    dateCreation: new Date(userData.date_creation),
    adresse: userData.adresse || "",
    ville: userData.ville || undefined,
    codePostal: userData.code_postal || undefined,
    iban: userData.iban || undefined,
    bic: userData.bic || undefined,
    nomBanque: userData.nom_banque || undefined,
    secteurActivite: clientData.secteur_activite,
    typeEntreprise: clientData.type_entreprise,
    besoins: clientData.besoins
  };
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client | null> => {
  // Mettre à jour les infos utilisateur
  const userUpdates: any = {};
  
  if (updates.nom) userUpdates.nom = updates.nom;
  if (updates.prenom) userUpdates.prenom = updates.prenom;
  if (updates.email) userUpdates.email = updates.email;
  if (updates.telephone) userUpdates.telephone = updates.telephone;
  if (updates.adresse !== undefined) userUpdates.adresse = updates.adresse;
  if (updates.ville !== undefined) userUpdates.ville = updates.ville;
  if (updates.codePostal !== undefined) userUpdates.code_postal = updates.codePostal;
  if (updates.iban !== undefined) userUpdates.iban = updates.iban;
  if (updates.bic !== undefined) userUpdates.bic = updates.bic;
  if (updates.nomBanque !== undefined) userUpdates.nom_banque = updates.nomBanque;

  if (Object.keys(userUpdates).length > 0) {
    const { error: userError } = await supabase
      .from("users")
      .update(userUpdates)
      .eq("id", id);

    if (userError) {
      console.error("Error updating user for client:", userError);
      return null;
    }
  }

  // Mettre à jour les infos client
  const clientUpdates: any = {};
  
  if (updates.secteurActivite) clientUpdates.secteur_activite = updates.secteurActivite;
  if (updates.typeEntreprise) clientUpdates.type_entreprise = updates.typeEntreprise;
  if (updates.besoins) clientUpdates.besoins = updates.besoins;

  if (Object.keys(clientUpdates).length > 0) {
    const { error: clientError } = await supabase
      .from("clients")
      .update(clientUpdates)
      .eq("id", id);

    if (clientError) {
      console.error("Error updating client:", clientError);
      return null;
    }
  }

  // Récupérer le client mis à jour
  return await getClientById(id);
};

export const deleteClient = async (id: string): Promise<boolean> => {
  // Comme nous avons une contrainte ON DELETE CASCADE, 
  // supprimer l'utilisateur supprimera automatiquement le client
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting client:", error);
    return false;
  }

  return true;
};
