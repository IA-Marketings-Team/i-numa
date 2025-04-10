
import { supabase } from "@/integrations/supabase/client";
import { UserListItem, DossierListItem } from "../models/FilterTypes";

export const fetchFilterData = async (
  setUsers: React.Dispatch<React.SetStateAction<UserListItem[]>>,
  setDossiers: React.Dispatch<React.SetStateAction<DossierListItem[]>>
) => {
  try {
    // Fetch users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, nom, prenom, role')
      .in('role', ['agent_phoner', 'agent_visio', 'superviseur', 'responsable'])
      .order('nom');

    if (usersError) throw usersError;

    if (users) {
      const formattedUsers: UserListItem[] = users.map(user => ({
        id: user.id,
        name: `${user.prenom} ${user.nom}`,
        role: user.role
      }));
      setUsers(formattedUsers);
    }

    // Fetch dossiers
    const { data: dossiers, error: dossiersError } = await supabase
      .from('dossiers')
      .select('id, client_id, profiles:client_id(nom, prenom)')
      .order('date_creation', { ascending: false });

    if (dossiersError) throw dossiersError;

    if (dossiers) {
      const formattedDossiers: DossierListItem[] = dossiers.map(dossier => ({
        id: dossier.id,
        label: dossier.profiles 
          ? `${dossier.profiles.prenom} ${dossier.profiles.nom} (#${dossier.id.substring(0, 8)})`
          : `Dossier #${dossier.id.substring(0, 8)}`
      }));
      setDossiers(formattedDossiers);
    }
  } catch (error) {
    console.error("Error fetching filter data:", error);
  }
};
