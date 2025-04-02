
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
  // First fetch all offers
  const { data: offresData, error: offresError } = await supabase
    .from('offres')
    .select('*');
  
  if (offresError) {
    console.error("Error fetching offres:", offresError);
    throw new Error(offresError.message);
  }
  
  // Transform Supabase data to match our Offre type
  const offres: Offre[] = offresData.map(item => ({
    id: item.id,
    nom: item.nom || '',
    description: item.description || '',
    type: (item.type || 'SEO') as "SEO" | "Google Ads" | "Email X" | "Foner" | "Devis",
    prix: item.prix || 0,
    secteurs: [] // Will be populated below
  }));
  
  // Now let's fetch all secteurs_activite
  const { data: secteurs, error: secteursError } = await supabase
    .from('secteurs_activite')
    .select('*');
    
  if (secteursError) {
    console.error("Error fetching secteurs:", secteursError);
  }
  
  // Then fetch all offres_secteurs join table records
  const { data: offresSecteurs, error: joinError } = await supabase
    .from('offres_secteurs')
    .select('*');
    
  if (joinError) {
    console.error("Error fetching offres_secteurs:", joinError);
  }
  
  if (secteurs && offresSecteurs) {
    // For each offer, find its associated sectors
    offres.forEach(offre => {
      const offreJoins = offresSecteurs.filter(join => join.offre_id === offre.id && join.disponible);
      
      if (offreJoins.length > 0) {
        // Map to our SecteurActivite type
        offre.secteurs = offreJoins
          .map(join => {
            const secteur = secteurs.find(s => s.id === join.secteur_id);
            if (secteur) {
              return {
                id: secteur.id,
                nom: secteur.nom,
                description: secteur.description
              };
            }
            return null;
          })
          .filter(Boolean) as SecteurActivite[];
      }
    });
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
  
  // Now let's fetch all secteurs_activite
  const { data: secteurs, error: secteursError } = await supabase
    .from('secteurs_activite')
    .select('*');
    
  if (secteursError) {
    console.error("Error fetching secteurs:", secteursError);
  }
  
  // Then fetch offres_secteurs join table records for this offer
  const { data: offresSecteurs, error: joinError } = await supabase
    .from('offres_secteurs')
    .select('*')
    .eq('offre_id', id);
    
  if (joinError) {
    console.error(`Error fetching sectors for offre ${id}:`, joinError);
  }
  
  if (secteurs && offresSecteurs && offresSecteurs.length > 0) {
    // Map to our SecteurActivite type
    offre.secteurs = offresSecteurs
      .map(join => {
        const secteur = secteurs.find(s => s.id === join.secteur_id);
        if (secteur) {
          return {
            id: secteur.id,
            nom: secteur.nom,
            description: secteur.description,
            disponible: join.disponible
          };
        }
        return null;
      })
      .filter(Boolean) as SecteurActivite[];
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
    // Create array of records for the join table
    const secteurInserts = offreData.secteurs.map(secteur => ({
      offre_id: offre.id,
      secteur_id: secteur.id,
      disponible: true
    }));
    
    // Insert all the join records
    for (const insert of secteurInserts) {
      const { error: insertError } = await supabase
        .from('offres_secteurs')
        .insert(insert);
      
      if (insertError) {
        console.error("Error linking sector to offre:", insertError);
      }
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
    // First, get current sectors join records
    const { data: currentJoins, error: fetchError } = await supabase
      .from('offres_secteurs')
      .select('*')
      .eq('offre_id', id);
    
    if (fetchError) {
      console.error("Error fetching current sectors:", fetchError);
    } else {
      // For each provided sector, update or insert
      for (const secteur of updates.secteurs) {
        const existingJoin = currentJoins?.find(j => j.secteur_id === secteur.id);
        
        if (existingJoin) {
          // Update existing join record if disponible has changed
          if (existingJoin.disponible !== (secteur.disponible !== false)) {
            const { error: updateError } = await supabase
              .from('offres_secteurs')
              .update({
                disponible: secteur.disponible !== false
              })
              .eq('id', existingJoin.id);
            
            if (updateError) {
              console.error("Error updating sector link:", updateError);
            }
          }
        } else {
          // Insert new join record
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
  // Delete the offer (cascading delete will remove join records)
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

// Fetch sectors
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

// Update the sectors for an offer
export const updateOffreSecteurs = async (
  offreId: string, 
  secteurs: { id: string, disponible: boolean }[]
): Promise<boolean> => {
  // First, get all current join records
  const { data: currentJoins, error: fetchError } = await supabase
    .from('offres_secteurs')
    .select('*')
    .eq('offre_id', offreId);
  
  if (fetchError) {
    console.error("Error fetching current sector links:", fetchError);
    throw new Error(fetchError.message);
  }
  
  // For each sector in the update list
  for (const secteur of secteurs) {
    const existingJoin = currentJoins?.find(join => join.secteur_id === secteur.id);
    
    if (existingJoin) {
      // Update existing join record if disponible has changed
      if (existingJoin.disponible !== secteur.disponible) {
        const { error: updateError } = await supabase
          .from('offres_secteurs')
          .update({
            disponible: secteur.disponible
          })
          .eq('id', existingJoin.id);
        
        if (updateError) {
          console.error("Error updating sector availability:", updateError);
          throw new Error(updateError.message);
        }
      }
    } else {
      // Create new join record
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
  
  return true;
};
