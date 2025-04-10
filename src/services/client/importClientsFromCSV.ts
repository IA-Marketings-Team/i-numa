
import { supabase } from "@/integrations/supabase/client";
import { parseCSVFile } from "./utils/parseCSVFile";

/**
 * Importe des clients à partir d'un fichier CSV
 */
export const importClientsFromCSV = async (file: File): Promise<{ 
  success: boolean; 
  imported?: number; 
  error?: string;
}> => {
  try {
    const { clients, error: parseError } = await parseCSVFile(file);
    
    if (parseError) {
      return {
        success: false,
        error: parseError
      };
    }
    
    if (clients.length === 0) {
      return {
        success: false,
        error: 'Aucun client valide trouvé dans le fichier.'
      };
    }
    
    // Use proper method for multiple record insert
    const { error } = await supabase
      .from('profiles')
      .insert(clients);
    
    if (error) {
      console.error("Erreur lors de l'import des clients:", error);
      return {
        success: false,
        error: `Erreur lors de l'import: ${error.message}`
      };
    }
    
    return {
      success: true,
      imported: clients.length
    };
  } catch (error) {
    console.error("Erreur inattendue lors de l'import des clients:", error);
    return {
      success: false,
      error: "Une erreur inattendue est survenue lors de l'import."
    };
  }
};
