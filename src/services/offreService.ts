
import { Offre, SecteurActivite, OffreSecteur } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchOffres = async (): Promise<Offre[]> => {
  const { data, error } = await supabase
    .from('offres')
    .select('*');
  
  if (error) {
    console.error("Error fetching offres:", error);
    throw new Error(error.message);
  }
  
  // Transform Supabase data to match our Offre type
  const offres: Offre[] = data.map(item => ({
    id: item.id,
    nom: item.nom || '',
    description: item.description || '',
    type: (item.type || 'SEO') as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
    prix: item.prix || 0
  }));
  
  return offres;
};

export const fetchOffresWithSecteurs = async (): Promise<Offre[]> => {
  const { data, error } = await supabase
    .from('offres')
    .select('*');
  
  if (error) {
    console.error("Error fetching offres:", error);
    throw new Error(error.message);
  }
  
  // Transform Supabase data to match our Offre type
  const offres: Offre[] = data.map(item => ({
    id: item.id,
    nom: item.nom || '',
    description: item.description || '',
    type: (item.type || 'SEO') as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
    prix: item.prix || 0,
    secteurs: [] // Will be populated below
  }));
  
  // Fetch the sectors for each offer
  for (const offre of offres) {
    const { data: secteurData, error: secteurError } = await supabase
      .from('offres_secteurs')
      .select(`
        secteur_id,
        disponible,
        secteurs_activite:secteur_id(id, nom, description)
      `)
      .eq('offre_id', offre.id);
    
    if (secteurError) {
      console.error(`Error fetching sectors for offre ${offre.id}:`, secteurError);
      continue;
    }
    
    if (secteurData && secteurData.length > 0) {
      // Filter only disponible sectors and transform to our type
      offre.secteurs = secteurData
        .filter(item => item.disponible)
        .map(item => ({
          id: item.secteurs_activite.id,
          nom: item.secteurs_activite.nom,
          description: item.secteurs_activite.description
        }));
    }
  }
  
  return offres;
};

export const fetchOffreById = async (id: string): Promise<Offre | null> => {
  const { data, error } = await supabase
    .from('offres')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching offre with ID ${id}:`, error);
    return null;
  }
  
  if (!data) return null;
  
  // Transform Supabase data to match our Offre type
  const offre: Offre = {
    id: data.id,
    nom: data.nom || '',
    description: data.description || '',
    type: (data.type || 'SEO') as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
    prix: data.prix || 0
  };
  
  // Fetch the sectors for this offer
  const { data: secteurData, error: secteurError } = await supabase
    .from('offres_secteurs')
    .select(`
      secteur_id,
      disponible,
      secteurs_activite:secteur_id(id, nom, description)
    `)
    .eq('offre_id', id);
  
  if (!secteurError && secteurData && secteurData.length > 0) {
    // Include all sectors with disponible flag
    offre.secteurs = secteurData.map(item => ({
      id: item.secteurs_activite.id,
      nom: item.secteurs_activite.nom,
      description: item.secteurs_activite.description,
      disponible: item.disponible
    }));
  }
  
  return offre;
};

export const createOffre = async (offreData: Omit<Offre, 'id'>): Promise<Offre | null> => {
  const { data, error } = await supabase
    .from('offres')
    .insert([{
      nom: offreData.nom,
      description: offreData.description,
      type: offreData.type,
      prix: offreData.prix
    }])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating offre:", error);
    throw new Error(error.message);
  }
  
  const offre: Offre = {
    id: data.id,
    nom: data.nom || '',
    description: data.description || '',
    type: (data.type || 'SEO') as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
    prix: data.prix || 0
  };
  
  // If sectors were provided, link them to the offer
  if (offreData.secteurs && offreData.secteurs.length > 0) {
    const secteurInserts = offreData.secteurs.map(secteur => ({
      offre_id: offre.id,
      secteur_id: secteur.id,
      disponible: true
    }));
    
    const { error: insertError } = await supabase
      .from('offres_secteurs')
      .insert(secteurInserts);
    
    if (insertError) {
      console.error("Error linking sectors to offre:", insertError);
      // Continue even if sector linking fails
    }
  }
  
  return offre;
};

export const updateOffre = async (id: string, updates: Partial<Offre>): Promise<boolean> => {
  const updateData: any = {};
  
  if (updates.nom !== undefined) updateData.nom = updates.nom;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.prix !== undefined) updateData.prix = updates.prix;
  
  const { error } = await supabase
    .from('offres')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating offre with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  // If sectors were provided, update them
  if (updates.secteurs) {
    // First, get current sectors
    const { data: currentSecteurs, error: fetchError } = await supabase
      .from('offres_secteurs')
      .select('*')
      .eq('offre_id', id);
    
    if (fetchError) {
      console.error("Error fetching current sectors:", fetchError);
      // Continue even if sector update fails
    } else {
      // For each provided sector, update or insert
      for (const secteur of updates.secteurs) {
        const existingSecteur = currentSecteurs?.find(s => s.secteur_id === secteur.id);
        
        if (existingSecteur) {
          // Update existing link
          const { error: updateError } = await supabase
            .from('offres_secteurs')
            .update({ disponible: secteur.disponible !== false })
            .eq('id', existingSecteur.id);
          
          if (updateError) {
            console.error("Error updating sector link:", updateError);
          }
        } else {
          // Insert new link
          const { error: insertError } = await supabase
            .from('offres_secteurs')
            .insert({
              offre_id: id,
              secteur_id: secteur.id,
              disponible: secteur.disponible !== false
            });
          
          if (insertError) {
            console.error("Error inserting sector link:", insertError);
          }
        }
      }
    }
  }
  
  return true;
};

export const deleteOffre = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('offres')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting offre with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  return true;
};

// New functions for sectors
export const fetchSecteurs = async (): Promise<SecteurActivite[]> => {
  const { data, error } = await supabase
    .from('secteurs_activite')
    .select('*')
    .order('nom');
  
  if (error) {
    console.error("Error fetching secteurs:", error);
    throw new Error(error.message);
  }
  
  return data.map(item => ({
    id: item.id,
    nom: item.nom,
    description: item.description
  }));
};

export const updateOffreSecteurs = async (
  offreId: string, 
  secteurs: { id: string, disponible: boolean }[]
): Promise<boolean> => {
  // First, get all current sector associations
  const { data: currentLinks, error: fetchError } = await supabase
    .from('offres_secteurs')
    .select('*')
    .eq('offre_id', offreId);
  
  if (fetchError) {
    console.error("Error fetching current sector links:", fetchError);
    throw new Error(fetchError.message);
  }
  
  // For each sector in the update list
  for (const secteur of secteurs) {
    const existingLink = currentLinks?.find(link => link.secteur_id === secteur.id);
    
    if (existingLink) {
      // Update existing link
      if (existingLink.disponible !== secteur.disponible) {
        const { error: updateError } = await supabase
          .from('offres_secteurs')
          .update({ disponible: secteur.disponible })
          .eq('id', existingLink.id);
        
        if (updateError) {
          console.error("Error updating sector availability:", updateError);
          throw new Error(updateError.message);
        }
      }
    } else {
      // Create new link
      const { error: insertError } = await supabase
        .from('offres_secteurs')
        .insert({
          offre_id: offreId,
          secteur_id: secteur.id,
          disponible: secteur.disponible
        });
      
      if (insertError) {
        console.error("Error creating new sector link:", insertError);
        throw new Error(insertError.message);
      }
    }
  }
  
  // For sectors in the database but not in the update list, we'll leave them as is
  
  return true;
};
