
import React from 'react';
import { DocumentManager } from '@/components/document/DocumentManager';

const DocumentsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Documents</h1>
      </div>
      
      <p className="text-gray-500">
        Téléchargez et interrogez vos documents avec l'intelligence artificielle.
        Le système analysera le contenu de vos documents et répondra à vos questions spécifiques.
      </p>
      
      <DocumentManager />
    </div>
  );
};

export default DocumentsPage;
