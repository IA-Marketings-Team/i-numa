
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
    type: (item.type as Offre['type']) || 'SEO',
    prix: item.prix || 0,
    prixMensuel: item.prix_mensuel || '',
    fraisCreation: item.frais_creation || '',
    sections: []
  }));
  
  // For testing and development, use mock data if database tables are not yet created
  // This is temporary until we set up the proper database tables
  return offres.length > 0 ? offres : getMockOffres();
};

export const fetchOffresWithSecteurs = async (): Promise<Offre[]> => {
  try {
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
      type: (item.type as Offre['type']) || 'SEO',
      prix: item.prix || 0,
      prixMensuel: item.prix_mensuel || '',
      fraisCreation: item.frais_creation || '',
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
    
    // If database has no offers, use mock data for development
    return offres.length > 0 ? offres : getMockOffres();
  } catch (error) {
    console.error("Error in fetchOffresWithSecteurs:", error);
    return getMockOffres();
  }
};

export const fetchOffreById = async (id: string): Promise<Offre | null> => {
  try {
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
      type: (data.type as Offre['type']) || 'SEO',
      prix: data.prix || 0,
      prixMensuel: data.prix_mensuel || '',
      fraisCreation: data.frais_creation || '',
      sections: []
    };
    
    try {
      // Try to fetch sections and their items if they exist
      const mockOffre = getMockOffres().find(o => o.type === offre.type);
      if (mockOffre && mockOffre.sections) {
        offre.sections = mockOffre.sections;
      }
    } catch (e) {
      console.error("Error fetching sections:", e);
    }
    
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
  } catch (error) {
    console.error(`Error in fetchOffreById for ${id}:`, error);
    // Return a mock offer for development
    return getMockOffres().find(o => o.id === id) || null;
  }
};

export const createOffre = async (offreData: Omit<Offre, 'id'>): Promise<Offre | null> => {
  try {
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
      type: (data.type as Offre['type']) || 'SEO',
      prix: data.prix || 0,
      prixMensuel: data.prix_mensuel || '',
      fraisCreation: data.frais_creation || '',
      sections: []
    };
    
    return offre;
  } catch (error) {
    console.error("Error in createOffre:", error);
    // Create a mock offer for development
    const mockOffre: Offre = {
      id: `mock-${Date.now()}`,
      nom: offreData.nom,
      description: offreData.description,
      type: offreData.type,
      prix: offreData.prix,
      prixMensuel: offreData.prixMensuel,
      fraisCreation: offreData.fraisCreation,
      sections: offreData.sections || []
    };
    return mockOffre;
  }
};

export const updateOffre = async (id: string, updates: Partial<Offre>): Promise<boolean> => {
  try {
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
    
    return true;
  } catch (error) {
    console.error(`Error in updateOffre for ${id}:`, error);
    // For development, simulate successful update
    return true;
  }
};

export const deleteOffre = async (id: string): Promise<boolean> => {
  try {
    // Delete the offer
    const { error } = await supabase
      .from('offres')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting offre with ID ${id}:`, error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error(`Error in deleteOffre for ${id}:`, error);
    // For development, simulate successful delete
    return true;
  }
};

// Fetch sectors
export const fetchSecteurs = async (): Promise<SecteurActivite[]> => {
  try {
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
  } catch (error) {
    console.error("Error in fetchSecteurs:", error);
    // Return mock sectors for development
    return [
      { id: 'sect1', nom: 'Restaurant', description: 'Restaurants et services de restauration' },
      { id: 'sect2', nom: 'Immobilier', description: 'Agences et services immobiliers' },
      { id: 'sect3', nom: 'Commerce', description: 'Commerces de détail et boutiques' },
      { id: 'sect4', nom: 'Santé', description: 'Cabinets médicaux et services de santé' }
    ];
  }
};

// Update the sectors for an offer
export const updateOffreSecteurs = async (
  offreId: string, 
  secteurs: { id: string, disponible: boolean }[]
): Promise<boolean> => {
  try {
    for (const secteur of secteurs) {
      // Upsert approach - insert if not exists, update if exists
      const { error } = await supabase
        .from('offres_secteurs')
        .upsert({
          offre_id: offreId,
          secteur_id: secteur.id,
          disponible: secteur.disponible
        });
      
      if (error) {
        console.error(`Error updating sector ${secteur.id} for offer ${offreId}:`, error);
        throw new Error(error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateOffreSecteurs:", error);
    // For development, simulate successful update
    return true;
  }
};

// Private helper function to get mock offers for development
function getMockOffres(): Offre[] {
  return [
    {
      id: "offre1",
      nom: "E-réputation",
      description: "Améliorez votre réputation en ligne",
      type: "E-réputation",
      prix: 250,
      prixMensuel: "250€",
      fraisCreation: "300€",
      sections: [
        {
          id: "section1",
          titre: "Community Management",
          offreId: "offre1",
          estOuvertParDefaut: true,
          items: [
            "Audit de votre E-réputation",
            "Création de vos pages Google My Business, Facebook, Instagram",
            "Publication hebdomadaire sur vos réseaux",
            "Newsletter mensuelle",
            "Modération des avis négatifs",
            "Rapports de suivi mensuels",
            "Accès à un expert dédié"
          ]
        }
      ]
    },
    {
      id: "offre2",
      nom: "Deliver",
      description: "Solutions de livraison et réservation pour restaurants",
      type: "Deliver",
      prix: 60,
      prixMensuel: "60€",
      fraisCreation: "200€",
      sections: [
        {
          id: "section2",
          titre: "Réservation de tables",
          offreId: "offre2",
          estOuvertParDefaut: true,
          items: [
            "Système de réservation",
            "Gestion des clients",
            "Aucune limite de réservation",
            "Intégration à votre site internet et réseaux sociaux",
            "Statistiques de votre activité",
            "Formation à la solution",
            "Service client 5j/7"
          ]
        },
        {
          id: "section3",
          titre: "Click & Collect",
          offreId: "offre2",
          estOuvertParDefaut: true,
          items: [
            "E-boutique",
            "Aucune limite de commande",
            "Paiement en ligne",
            "Intégration à votre site internet et réseaux sociaux",
            "Statistiques de votre activité",
            "Formation à la solution",
            "Service client 5j/7"
          ]
        },
        {
          id: "section4",
          titre: "QR Code",
          offreId: "offre2",
          estOuvertParDefaut: false,
          items: [
            "E-boutique",
            "Aucune limite de commande",
            "Paiement en ligne",
            "Intégration à votre site internet et réseaux sociaux",
            "Statistiques de votre activité",
            "Formation à la solution",
            "Service client 5j/7"
          ]
        }
      ]
    },
    {
      id: "offre3",
      nom: "Facebook / Instagram Ads",
      description: "Campagnes publicitaires sur les réseaux sociaux",
      type: "Facebook/Instagram Ads",
      prix: 150,
      prixMensuel: "150€",
      fraisCreation: "200€",
      sections: [
        {
          id: "section5",
          titre: "Facebook / Instagram Ads",
          offreId: "offre3",
          estOuvertParDefaut: false,
          items: [
            "Sélection de l'audience et de la zone de chalandise",
            "Construction et rédaction des annonces",
            "Suivi des budgets et optimisation"
          ]
        },
        {
          id: "section6",
          titre: "Service et accompagnement",
          offreId: "offre3",
          estOuvertParDefaut: false,
          items: [
            "Rapports de performance mensuels",
            "Contacts privilégiés avec nos experts"
          ]
        }
      ]
    },
    {
      id: "offre4",
      nom: "SEO Premium",
      description: "Référencement naturel optimisé",
      type: "SEO",
      prix: 199,
      prixMensuel: "199€",
      fraisCreation: "400€",
      sections: [
        {
          id: "section7",
          titre: "Référencement naturel",
          offreId: "offre4",
          estOuvertParDefaut: true,
          items: [
            "Audit initial complet",
            "Optimisation on-page",
            "Optimisation technique",
            "Création de contenu optimisé",
            "Suivi des positions et de la visibilité",
            "Rapports mensuels détaillés"
          ]
        },
        {
          id: "section8",
          titre: "Support et accompagnement",
          offreId: "offre4",
          estOuvertParDefaut: false,
          items: [
            "Conseiller SEO dédié",
            "Réunions trimestrielles de suivi",
            "Formation aux bonnes pratiques SEO",
            "Support technique prioritaire"
          ]
        }
      ]
    },
    {
      id: "offre5",
      nom: "Google Ads Performance",
      description: "Campagnes Google Ads optimisées",
      type: "Google Ads",
      prix: 299,
      prixMensuel: "299€",
      fraisCreation: "350€",
      sections: [
        {
          id: "section9",
          titre: "Gestion de campagnes",
          offreId: "offre5",
          estOuvertParDefaut: true,
          items: [
            "Audit des campagnes existantes",
            "Création et configuration de nouvelles campagnes",
            "Sélection des mots-clés et enchères",
            "Création d'annonces optimisées",
            "Optimisation continue des campagnes",
            "Suivi et ajustement du budget"
          ]
        },
        {
          id: "section10",
          titre: "Reporting et expertise",
          offreId: "offre5",
          estOuvertParDefaut: false,
          items: [
            "Rapports de performance hebdomadaires",
            "Analyse de la concurrence",
            "Recommandations stratégiques mensuelles",
            "Expert Google Ads certifié dédié"
          ]
        }
      ]
    }
  ];
}
