
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  uploadDocument, 
  queryDocuments, 
  getDocuments, 
  deleteDocument, 
  Document
} from '@/services/ragService';
import { 
  Upload,
  FileText,
  Search,
  Trash,
  Loader
} from 'lucide-react';

export const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [query, setQuery] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { toast } = useToast();

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    setIsUploading(true);
    try {
      const result = await uploadDocument(file);
      
      if (result) {
        toast({
          title: "Document téléchargé",
          description: `${file.name} a été téléchargé avec succès.`
        });
        await fetchDocuments();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    const success = await deleteDocument(docId);
    if (success) {
      setDocuments(documents.filter(doc => doc.id !== docId));
      setSelectedDocIds(selectedDocIds.filter(id => id !== docId));
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès."
      });
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir une question."
      });
      return;
    }

    setIsQuerying(true);
    try {
      // Use only selected documents if any are selected
      const docIds = selectedDocIds.length > 0 ? selectedDocIds : undefined;
      const promptToUse = customPrompt.trim() || undefined;
      
      const response = await queryDocuments(query, docIds, promptToUse);
      setAnswer(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de requête",
        description: error instanceof Error 
          ? error.message 
          : "Une erreur s'est produite lors de la requête."
      });
    } finally {
      setIsQuerying(false);
    }
  };

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocIds(prev => 
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Tabs defaultValue="query" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="query">Interroger les documents</TabsTrigger>
        <TabsTrigger value="manage">Gérer les documents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="query" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Interroger les documents</CardTitle>
            <CardDescription>
              Posez une question à propos du contenu de vos documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Documents disponibles:</h3>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : documents.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun document téléchargé.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        id={`doc-${doc.id}`}
                        checked={selectedDocIds.includes(doc.id)}
                        onChange={() => toggleDocumentSelection(doc.id)}
                        className="h-4 w-4"
                      />
                      <label htmlFor={`doc-${doc.id}`} className="text-sm flex-1 cursor-pointer">
                        {doc.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {selectedDocIds.length === 0 
                  ? "Tous les documents seront interrogés." 
                  : `${selectedDocIds.length} document(s) sélectionné(s).`}
              </p>
            </div>
            
            <div>
              <Textarea
                placeholder="Saisissez votre question ici..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Invite personnalisée (optionnel):</label>
              <Textarea
                placeholder="Instruction personnalisée pour le modèle..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <Button 
              onClick={handleQuery} 
              disabled={isQuerying || documents.length === 0}
              className="w-full"
            >
              {isQuerying ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Interroger les documents
                </>
              )}
            </Button>
            
            {answer && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Réponse:</h3>
                <div className="bg-secondary/50 p-4 rounded-md whitespace-pre-wrap">
                  {answer}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="manage">
        <Card>
          <CardHeader>
            <CardTitle>Gérer les documents</CardTitle>
            <CardDescription>
              Téléchargez et gérez vos documents pour les interroger
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  type="file"
                  id="document-upload"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.txt"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Télécharger un document
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium">Documents téléchargés:</h3>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : documents.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun document téléchargé.</p>
              ) : (
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="p-3 border rounded-md flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DocumentManager;
