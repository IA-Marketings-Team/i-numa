
import { supabase } from "@/integrations/supabase/client";
import { UserListItem, DossierListItem } from "../models/FilterTypes";

export const fetchFilterData = async (
  setUsers: (users: UserListItem[]) => void,
  setDossiers: (dossiers: DossierListItem[]) => void
) => {
  try {
    await fetchUsers(setUsers);
    await fetchDossiers(setDossiers);
  } catch (error) {
    console.error("Error fetching filter data:", error);
  }
};

const fetchUsers = async (setUsers: (users: UserListItem[]) => void) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, nom, prenom");
    
    if (error) throw error;
    
    if (data) {
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: `${user.prenom || ''} ${user.nom || ''}`.trim()
      }));
      setUsers(formattedUsers);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
  }
};

const fetchDossiers = async (setDossiers: (dossiers: DossierListItem[]) => void) => {
  try {
    const { data, error } = await supabase
      .from("dossiers")
      .select("id, client_id");

    if (error) throw error;
    
    if (data) {
      const processedDossiers: DossierListItem[] = [];
      
      for (const dossier of data) {
        let clientName = `Dossier ${dossier.id.substring(0, 8)}`;
        
        if (dossier.client_id) {
          const { data: clientData } = await supabase
            .from("profiles")
            .select("nom, prenom")
            .eq("id", dossier.client_id)
            .single();
          
          if (clientData) {
            const formattedName = `${clientData.prenom || ''} ${clientData.nom || ''}`.trim();
            clientName = formattedName || clientName;
          }
        }
        
        processedDossiers.push({
          id: dossier.id,
          client_name: clientName
        });
      }
      
      setDossiers(processedDossiers);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des dossiers:", error);
  }
};
