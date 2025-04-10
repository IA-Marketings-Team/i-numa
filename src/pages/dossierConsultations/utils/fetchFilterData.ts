
import { supabase } from "@/integrations/supabase/client";
import { UserListItem, DossierListItem } from "../models/FilterTypes";

export async function fetchFilterData() {
  try {
    // Fetch unique users who have consulted dossiers
    const { data: usersData, error: usersError } = await supabase
      .from("dossier_consultations")
      .select("user_id, user_name, user_role")
      .order("user_name")
      .limit(1000);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return { users: [], dossiers: [] };
    }

    // Remove duplicates
    const userMap = new Map<string, UserListItem>();
    for (const user of usersData) {
      if (!userMap.has(user.user_id)) {
        userMap.set(user.user_id, {
          id: user.user_id,
          name: user.user_name,
          role: user.user_role,
        });
      }
    }
    const users = Array.from(userMap.values());

    // Fetch dossiers
    const { data: dossiersData, error: dossiersError } = await supabase
      .from("dossiers")
      .select("id, client_id")
      .limit(1000);

    if (dossiersError) {
      console.error("Error fetching dossiers:", dossiersError);
      return { users, dossiers: [] };
    }

    // Fetch clients for the dossiers
    const clientIds = dossiersData.map(d => d.client_id).filter(Boolean);
    
    if (clientIds.length === 0) {
      return { 
        users, 
        dossiers: dossiersData.map(d => ({ id: d.id, label: `Dossier ${d.id.substring(0, 8)}` }))
      };
    }

    const { data: clientsData, error: clientsError } = await supabase
      .from("profiles")
      .select("id, nom, prenom")
      .in("id", clientIds);

    if (clientsError) {
      console.error("Error fetching clients:", clientsError);
      return { 
        users, 
        dossiers: dossiersData.map(d => ({ id: d.id, label: `Dossier ${d.id.substring(0, 8)}` }))
      };
    }

    // Create a map of client IDs to client names
    const clientMap = new Map<string, { nom: string; prenom: string }>();
    for (const client of clientsData) {
      clientMap.set(client.id, { nom: client.nom, prenom: client.prenom });
    }

    // Create dossier items with client name labels
    const dossiers: DossierListItem[] = dossiersData.map(dossier => {
      const client = dossier.client_id ? clientMap.get(dossier.client_id) : null;
      const label = client 
        ? `${client.prenom} ${client.nom} (${dossier.id.substring(0, 8)})`
        : `Dossier ${dossier.id.substring(0, 8)}`;
      
      return {
        id: dossier.id,
        label
      };
    });

    return { users, dossiers };
  } catch (error) {
    console.error("Unexpected error fetching filter data:", error);
    return { users: [], dossiers: [] };
  }
}
