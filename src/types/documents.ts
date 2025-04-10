
export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  path?: string;
  content?: string;
  metadata?: Record<string, any>;
}

export interface DocumentQueryRequest {
  query: string;
  documentIds?: string[];
  customPrompt?: string;
}

export interface DocumentQueryResponse {
  success: boolean;
  answer: string;
  sources?: {
    documentId: string;
    documentName: string;
    relevance: number;
    excerpt: string;
  }[];
}

export interface DocumentUploadResponse {
  success: boolean;
  documentId: string;
  filename: string;
}
