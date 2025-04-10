
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { importClientsFromCSV } from "@/services/client/clientService";
import { Client } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ClientImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ImportResult {
  success: boolean;
  imported: number;
  error?: string;
}

const ClientImportModal: React.FC<ClientImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un fichier CSV à importer",
      });
      return;
    }

    setIsLoading(true);
    try {
      const clientData = await parseCSV(file);
      const importedClients = await importClientsFromCSV(clientData);
      
      setResult({
        success: true,
        imported: importedClients.length,
      });
      
      toast({
        title: "Import réussi",
        description: `${importedClients.length} clients ont été importés avec succès`,
      });
      
      onImportComplete();
    } catch (error) {
      console.error("Error importing clients:", error);
      setResult({
        success: false,
        imported: 0,
        error: error instanceof Error ? error.message : "Une erreur est survenue lors de l'import",
      });
      toast({
        variant: "destructive",
        title: "Erreur d'import",
        description: "Une erreur est survenue lors de l'import des clients",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSV = (file: File): Promise<Omit<Client, "id" | "dateCreation" | "role">[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const lines = csvText.split("\n");
          const headers = lines[0].split(",").map((h) => h.trim());
          
          const clients: Omit<Client, "id" | "dateCreation" | "role">[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(",").map((v) => v.trim());
            const client: any = {};
            
            headers.forEach((header, index) => {
              const value = values[index] || "";
              
              switch (header.toLowerCase()) {
                case "nom":
                  client.nom = value;
                  break;
                case "prenom":
                  client.prenom = value;
                  break;
                case "email":
                  client.email = value;
                  break;
                case "telephone":
                  client.telephone = value;
                  break;
                case "adresse":
                  client.adresse = value;
                  break;
                case "ville":
                  client.ville = value;
                  break;
                case "code postal":
                case "codepostal":
                case "code_postal":
                  client.codePostal = value;
                  break;
                case "iban":
                  client.iban = value;
                  break;
                case "bic":
                  client.bic = value;
                  break;
                case "nom banque":
                case "nombanque":
                case "nom_banque":
                  client.nomBanque = value;
                  break;
                case "secteur activite":
                case "secteuractivite":
                case "secteur_activite":
                  client.secteurActivite = value;
                  break;
                case "type entreprise":
                case "typeentreprise":
                case "type_entreprise":
                  client.typeEntreprise = value;
                  break;
                case "besoins":
                  client.besoins = value;
                  break;
                case "statut juridique":
                case "statutjuridique":
                case "statut_juridique":
                  client.statutJuridique = value;
                  break;
                case "activite detail":
                case "activitedetail":
                case "activite_detail":
                  client.activiteDetail = value;
                  break;
                case "site web":
                case "siteweb":
                case "site_web":
                  client.siteWeb = value;
                  break;
                case "moyens communication":
                case "moyenscommunication":
                case "moyens_communication":
                  client.moyensCommunication = value ? value.split(";") : [];
                  break;
                case "commentaires":
                  client.commentaires = value;
                  break;
                default:
                  // Ignore unknown headers
                  break;
              }
            });
            
            // Required fields validation
            if (!client.nom || !client.prenom || !client.email) {
              console.warn(`Ligne ${i} ignorée: champs obligatoires manquants`);
              continue;
            }
            
            clients.push(client as Omit<Client, "id" | "dateCreation" | "role">);
          }
          
          resolve(clients);
        } catch (error) {
          reject(new Error("Format de fichier CSV invalide"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Erreur lors de la lecture du fichier"));
      };
      
      reader.readAsText(file);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des clients</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier CSV contenant les données des clients à importer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Cliquez pour sélectionner</span>{" "}
                  ou glissez-déposez un fichier
                </p>
                <p className="text-xs text-gray-500">Format supporté: CSV</p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </label>
          </div>

          {file && (
            <div className="border rounded p-2 flex items-center gap-2 bg-slate-50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div className="text-sm">{file.name}</div>
            </div>
          )}

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {result.success ? "Import réussi" : "Erreur d'import"}
              </AlertTitle>
              <AlertDescription>
                {result.success
                  ? `${result.imported} clients ont été importés avec succès.`
                  : result.error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isLoading}
            className="gap-2"
          >
            {isLoading ? "Importation en cours..." : "Importer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientImportModal;
