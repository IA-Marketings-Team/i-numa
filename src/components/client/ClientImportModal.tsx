
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { importClientsFromCSV } from "@/services/clientService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ClientImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

const ClientImportModal: React.FC<ClientImportModalProps> = ({ isOpen, onClose, onImportComplete }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setErrorMessage(null);
    
    if (!selectedFile) {
      setFile(null);
      setPreviewData([]);
      return;
    }
    
    // Check file type
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      setErrorMessage("Veuillez sélectionner un fichier CSV valide.");
      setFile(null);
      setPreviewData([]);
      return;
    }
    
    setFile(selectedFile);
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      
      // Take only the first 5 rows for preview
      const preview = rows.slice(0, 5);
      setPreviewData(preview);
      
      // Basic validation
      if (preview.length === 0) {
        setErrorMessage("Le fichier CSV semble être vide.");
        return;
      }
      
      const headers = preview[0];
      const requiredHeaders = ["nom", "prenom", "email"];
      const missingHeaders = requiredHeaders.filter(
        header => !headers.map(h => h.toLowerCase().trim()).includes(header.toLowerCase())
      );
      
      if (missingHeaders.length > 0) {
        setErrorMessage(`Colonnes obligatoires manquantes: ${missingHeaders.join(", ")}`);
      }
    };
    
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setErrorMessage(null);
    
    try {
      const result = await importClientsFromCSV(file);
      
      if (result.success) {
        toast({
          title: "Import réussi",
          description: `${result.imported} clients ont été importés avec succès.`,
        });
        
        // Reset state and close modal
        setFile(null);
        setPreviewData([]);
        onImportComplete();
        onClose();
      } else {
        setErrorMessage(result.error || "Une erreur est survenue lors de l'import.");
      }
    } catch (error) {
      console.error("Error importing clients:", error);
      setErrorMessage("Une erreur inattendue est survenue lors de l'import.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importer des clients depuis un fichier CSV</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier CSV contenant les informations des clients à importer.
            Le fichier doit contenir au minimum les colonnes: "nom", "prenom" et "email".
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".csv"
              id="csv-file"
              onChange={handleFileChange}
              className="flex-1"
            />
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                // In a real implementation, this would download a template
                const template = "nom,prenom,email,telephone,adresse,ville,code_postal,secteur_activite,type_entreprise\n";
                const blob = new Blob([template], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'template_clients.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              Télécharger modèle
            </a>
          </div>
          
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {previewData.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <div className="text-sm font-medium p-2 bg-muted">
                Aperçu des données (5 premières lignes)
              </div>
              <div className="overflow-auto max-h-[200px]">
                <table className="w-full text-sm">
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b last:border-0">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2 border-r last:border-0">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {file && !errorMessage && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Fichier prêt</AlertTitle>
              <AlertDescription>
                Le fichier <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB) est prêt à être importé.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || !!errorMessage || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? "Importation en cours..." : (
              <>
                <Upload className="h-4 w-4" />
                Importer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientImportModal;
