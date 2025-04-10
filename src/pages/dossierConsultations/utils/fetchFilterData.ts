
import { supabase } from "@/integrations/supabase/client";
import { UserListItem, DossierListItem } from "../hooks/useDossierConsultations";

export const fetchFilterData = async (
  setUsers: React.Dispatch<React.SetStateAction<UserListItem[]>>,
  setDossiers: React.Dispatch<React.SetStateAction<DossierListItem[]>>
) => {
  await Promise.all([
    fetchUsers(setUsers),
    fetchDossiers(setDossiers)
  ]);
};

const fetchUsers = async (setUsers: React.Dispatch<React.SetStateAction<UserListItem[]>>) => {
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

const fetchDossiers = async (setDossiers: React.Dispatch<React.SetStateAction<DossierListItem[]>>) => {
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
