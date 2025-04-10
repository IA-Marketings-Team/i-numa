
export const parseCSVFile = async (file: File): Promise<{
  clients: any[];
  error?: string;
}> => {
  try {
    const text = await file.text();
    const rows = text.split('\n');
    
    // Parse CSV header
    const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
    
    // Verify required fields
    const requiredHeaders = ['nom', 'prenom', 'email'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return {
        clients: [],
        error: `Champs obligatoires manquants: ${missingHeaders.join(', ')}`
      };
    }
    
    // Parse data rows
    const clients = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;
      
      const values = row.split(',');
      if (values.length !== headers.length) {
        console.warn(`La ligne ${i + 1} ne correspond pas aux en-têtes et sera ignorée.`);
        continue;
      }
      
      const client: Record<string, any> = {};
      headers.forEach((header, index) => {
        client[header] = values[index].trim();
      });
      
      // Skip empty required fields
      if (!client.nom || !client.prenom || !client.email) {
        console.warn(`La ligne ${i + 1} a des champs obligatoires manquants et sera ignorée.`);
        continue;
      }
      
      // Map to database structure with proper field naming
      clients.push({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone || '',
        role: 'client',
        date_creation: new Date().toISOString(),
        adresse: client.adresse || '',
        ville: client.ville || '',
        code_postal: client.code_postal || client.codepostal || '',
        secteur_activite: client.secteur_activite || client['secteur activite'] || '',
        type_entreprise: client.type_entreprise || client['type entreprise'] || ''
      });
    }
    
    return { clients };
  } catch (error) {
    console.error("Erreur lors du parsing du fichier CSV:", error);
    return {
      clients: [],
      error: "Erreur lors du traitement du fichier CSV."
    };
  }
};
