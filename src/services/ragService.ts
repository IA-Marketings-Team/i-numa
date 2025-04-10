
import { toast } from '@/hooks/use-toast';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
}

export interface QueryResponse {
  success: boolean;
  answer: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Upload a document to the RAG service
 */
export const uploadDocument = async (file: File): Promise<{ documentId: string; filename: string } | null> => {
  try {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload document');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading document:', error);
    toast({
      variant: "destructive",
      title: "Erreur d'upload",
      description: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'upload du document"
    });
    return null;
  }
};

/**
 * Query documents with a specific question
 */
export const queryDocuments = async (
  query: string, 
  documentIds?: string[], 
  customPrompt?: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        documentIds,
        customPrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to query documents');
    }

    const data = await response.json() as QueryResponse;
    return data.answer;
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

/**
 * Get a list of all uploaded documents
 */
export const getDocuments = async (): Promise<Document[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch documents');
    }

    const data = await response.json();
    return data.documents.map((doc: any) => ({
      ...doc,
      uploadDate: new Date(doc.uploadDate)
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    toast({
      variant: "destructive",
      title: "Erreur de récupération",
      description: "Impossible de récupérer la liste des documents"
    });
    return [];
  }
};

/**
 * Delete a document by ID
 */
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete document');
    }

    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    toast({
      variant: "destructive",
      title: "Erreur de suppression",
      description: "Impossible de supprimer le document"
    });
    return false;
  }
};

/**
 * Get available prompt templates
 */
export const getPromptTemplates = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/prompt-templates`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch prompt templates');
    }

    const data = await response.json();
    return data.templates;
  } catch (error) {
    console.error('Error fetching prompt templates:', error);
    return [];
  }
};
