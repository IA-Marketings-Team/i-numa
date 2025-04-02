import { Offre, SecteurActivite, OffreSection } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const fetchOffres = async (): Promise<Offre[]> => {
  // Fetch offers
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
    type: item.type || 'SEO',
    prix: item.prix || 0,
    prixMensuel: item.prix_mensuel || '',
    fraisCreation: item.frais_creation || '',
    sections: []
  }));
  
  // Fetch sections for all offers
  const { data: sectionsData, error: sectionsError } = await supabase
    .from('offre_sections')
    .select('*');
    
  if (sectionsError) {
    console.error("Error fetching sections:", sectionsError);
  } else if (sectionsData) {
    // Fetch section items for all sections
    const { data: itemsData, error: itemsError } = await supabase
      .from('offre_section_items')
      .select('*');
      
    if (itemsError) {
      console.error("Error fetching section items:", itemsError);
    } else if (itemsData) {
      // For each offer, find its associated sections and items
      offres.forEach(offre => {
        const offreSections = sectionsData.filter(section => section.offre_id === offre.id);
        
        if (offreSections.length > 0) {
          offre.sections = offreSections.map(section => {
            const sectionItems = itemsData
              .filter(item => item.section_id === section.id)
              .map(item => item.texte);
              
            return {
              id: section.id,
              titre: section.titre,
              offreId: section.offre_id,
              estOuvertParDefaut: section.est_ouvert_par_defaut,
              items: sectionItems
            };
          });
        }
      });
    }
  }
  
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
    prix: data.prix || 0,
    prixMensuel: data.prix_mensuel || '',
    fraisCreation: data.frais_creation || '',
    sections: []
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
      prix: offreData.prix,
      prix_mensuel: offreData.prixMensuel,
      frais_creation: offreData.fraisCreation
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
    type: data.type,
    prix: data.prix || 0,
    prixMensuel: data.prix_mensuel || '',
    fraisCreation: data.frais_creation || '',
    sections: []
  };
  
  // Add sections if provided
  if (offreData.sections && offreData.sections.length > 0) {
    for (const section of offreData.sections) {
      // Insert section
      const { data: sectionData, error: sectionError } = await supabase
        .from('offre_sections')
        .insert({
          offre_id: offre.id,
          titre: section.titre,
          est_ouvert_par_defaut: section.estOuvertParDefaut
        })
        .select()
        .single();
        
      if (sectionError) {
        console.error("Error creating section:", sectionError);
        continue;
      }
      
      // Insert section items
      if (section.items && section.items.length > 0) {
        const itemInserts = section.items.map(item => ({
          section_id: sectionData.id,
          texte: item
        }));
        
        const { error: itemsError } = await supabase
          .from('offre_section_items')
          .insert(itemInserts);
          
        if (itemsError) {
          console.error("Error creating section items:", itemsError);
        }
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
  if (updates.prixMensuel !== undefined) updateData.prix_mensuel = updates.prixMensuel;
  if (updates.fraisCreation !== undefined) updateData.frais_creation = updates.fraisCreation;
  
  const { error } = await supabase
    .from('offres')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating offre with ID ${id}:`, error);
    throw new Error(error.message);
  }
  
  // Update sections if provided
  if (updates.sections) {
    // Get existing sections
    const { data: existingSections, error: fetchError } = await supabase
      .from('offre_sections')
      .select('*')
      .eq('offre_id', id);
      
    if (fetchError) {
      console.error("Error fetching existing sections:", fetchError);
    } else {
      // For each provided section
      for (const section of updates.sections) {
        if (section.id) {
          // Update existing section
          const { error: updateError } = await supabase
            .from('offre_sections')
            .update({
              titre: section.titre,
              est_ouvert_par_defaut: section.estOuvertParDefaut
            })
            .eq('id', section.id);
            
          if (updateError) {
            console.error(`Error updating section ${section.id}:`, updateError);
            continue;
          }
          
          // Update section items (delete existing and insert new)
          const { error: deleteError } = await supabase
            .from('offre_section_items')
            .delete()
            .eq('section_id', section.id);
            
          if (deleteError) {
            console.error(`Error deleting items for section ${section.id}:`, deleteError);
          }
          
          if (section.items && section.items.length > 0) {
            const itemInserts = section.items.map(item => ({
              section_id: section.id,
              texte: item
            }));
            
            const { error: insertError } = await supabase
              .from('offre_section_items')
              .insert(itemInserts);
              
            if (insertError) {
              console.error(`Error inserting items for section ${section.id}:`, insertError);
            }
          }
        } else {
          // Create new section
          const { data: newSection, error: createError } = await supabase
            .from('offre_sections')
            .insert({
              offre_id: id,
              titre: section.titre,
              est_ouvert_par_defaut: section.estOuvertParDefaut
            })
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating new section:", createError);
            continue;
          }
          
          // Insert section items
          if (section.items && section.items.length > 0) {
            const itemInserts = section.items.map(item => ({
              section_id: newSection.id,
              texte: item
            }));
            
            const { error: insertError } = await supabase
              .from('offre_section_items')
              .insert(itemInserts);
              
            if (insertError) {
              console.error(`Error inserting items for new section:`, insertError);
            }
          }
        }
      }
      
      // Delete sections that were not included in the update
      const sectionIdsToKeep = updates.sections
        .filter(s => s.id)
        .map(s => s.id);
        
      const sectionsToDelete = existingSections
        .filter(s => !sectionIdsToKeep.includes(s.id));
        
      for (const section of sectionsToDelete) {
        // Delete section items first
        const { error: deleteItemsError } = await supabase
          .from('offre_section_items')
          .delete()
          .eq('section_id', section.id);
          
        if (deleteItemsError) {
          console.error(`Error deleting items for section ${section.id}:`, deleteItemsError);
        }
        
        // Delete section
        const { error: deleteSectionError } = await supabase
          .from('offre_sections')
          .delete()
          .eq('id', section.id);
          
        if (deleteSectionError) {
          console.error(`Error deleting section ${section.id}:`, deleteSectionError);
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
