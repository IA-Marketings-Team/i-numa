import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Offre } from '@/types';
import { offreService } from '@/services';
import Papa from 'papaparse';

interface OffreImportExportProps {
  offres: Offre[];
  onOffreImported: (newOffres: Offre[]) => void;
}

interface CSVOffreData {
  nom: string;
  description: string;
  type: string;
  prix: string;
  prix_mensuel: string;
  frais_creation: string;
  secteur_activite: string;
}

const OffreImportExport: React.FC<OffreImportExportProps> = ({ offres, onOffreImported }) => {
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState({ success: 0, errors: 0, total: 0 });
  const [showImportResults, setShowImportResults] = useState(false);

  // Gestion de l'export CSV
  const handleExportCSV = () => {
    // Préparer les données pour l'export CSV
    const csvData = offres.map(offre => ({
      id: offre.id,
      nom: offre.nom,
      description: offre.description,
      type: offre.type,
      prix: offre.prix,
      prix_mensuel: offre.prixMensuel,
      frais_creation: offre.fraisCreation,
      secteur_activite: offre.secteurActivite
    }));

    // Convertir les données en format CSV
    const csv = Papa.unparse(csvData);
    
    // Créer un Blob et un lien pour télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `offres_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: `${csvData.length} offres exportées avec succès.`
    });
  };

  // Gestion de l'importation CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImportCSV = () => {
    if (!importFile) {
      toast({
        variant: "destructive",
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier CSV à importer."
      });
      return;
    }

    setIsProcessing(true);
    const success: Offre[] = [];
    const errors: any[] = [];

    Papa.parse<CSVOffreData>(importFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const importedData = results.data;
        let successCount = 0;
        let errorCount = 0;

        for (const item of importedData) {
          try {
            // Convertir l'élément CSV en objet Offre
            const offre: Partial<Offre> = {
              nom: item.nom,
              description: item.description || '',
              type: item.type as any,
              prix: item.prix ? Number(item.prix) : undefined,
              prixMensuel: item.prix_mensuel,
              fraisCreation: item.frais_creation,
              secteurActivite: item.secteur_activite
            };

            // Ajouter l'offre via le service
            const newOffre = await offreService.createOffre(offre as any);
            success.push(newOffre);
            successCount++;
          } catch (error) {
            console.error("Erreur lors de l'importation de l'offre:", error);
            errors.push(item);
            errorCount++;
          }
        }

        setImportStats({
          success: successCount,
          errors: errorCount,
          total: importedData.length
        });

        setShowImportResults(true);
        setIsProcessing(false);
        
        if (success.length > 0) {
          onOffreImported(success);
        }
      },
      error: (error) => {
        console.error("Erreur d'analyse CSV:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'importation",
          description: "Le fichier CSV n'a pas pu être analysé correctement."
        });
        setIsProcessing(false);
      }
    });
  };

  const handleCloseImportDialog = () => {
    setIsImportDialogOpen(false);
    setImportFile(null);
    setShowImportResults(false);
    setImportStats({ success: 0, errors: 0, total: 0 });
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleExportCSV}
      >
        <Download className="h-4 w-4" />
        <span>Exporter CSV</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => setIsImportDialogOpen(true)}
      >
        <Upload className="h-4 w-4" />
        <span>Importer CSV</span>
      </Button>

      {/* Dialog d'importation CSV */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Importer des offres depuis un fichier CSV</DialogTitle>
            <DialogDescription>
              Importez des offres depuis un fichier CSV. Le fichier doit contenir les colonnes: nom, description, type, prix, prix_mensuel, frais_creation, secteur_activite.
            </DialogDescription>
          </DialogHeader>

          {showImportResults ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <h3 className="font-medium mb-2">Résultats de l'importation</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-500 text-sm">Total</p>
                    <p className="text-xl font-bold">{importStats.total}</p>
                  </div>
                  <div>
                    <p className="text-green-500 text-sm">Réussis</p>
                    <p className="text-xl font-bold text-green-600">{importStats.success}</p>
                  </div>
                  <div>
                    <p className="text-red-500 text-sm">Erreurs</p>
                    <p className="text-xl font-bold text-red-600">{importStats.errors}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                {importStats.success > 0 ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-2 h-5 w-5" /> 
                    {importStats.success} offres importées avec succès
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Aucune offre importée
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="importFile" className="text-sm font-medium">
                  Fichier CSV
                </label>
                <input
                  id="importFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {showImportResults ? (
              <Button onClick={handleCloseImportDialog}>
                Fermer
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCloseImportDialog}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleImportCSV} 
                  disabled={!importFile || isProcessing}
                >
                  {isProcessing ? "Importation..." : "Importer"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OffreImportExport;
