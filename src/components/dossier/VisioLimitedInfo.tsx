
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dossier } from '@/types';
import { Calendar, Briefcase, FileText, Package } from 'lucide-react';

interface VisioLimitedInfoProps {
  dossier: Dossier;
}

const VisioLimitedInfo: React.FC<VisioLimitedInfoProps> = ({ dossier }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Informations Client (Vue Limitée)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Secteur d'activité */}
          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Secteur d'activité</p>
              <p className="font-medium">{dossier.client.secteurActivite}</p>
            </div>
          </div>
          
          {/* Besoins du client */}
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Besoins</p>
              <p className="font-medium">{dossier.besoins || "Non spécifiés"}</p>
            </div>
          </div>
          
          {/* Date de rendez-vous */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de rendez-vous</p>
              <p className="font-medium">
                {dossier.dateRdv 
                  ? new Date(dossier.dateRdv).toLocaleDateString() 
                  : "Non planifiée"}
              </p>
            </div>
          </div>
          
          {/* Offres (sans montant) */}
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Offres</p>
              {dossier.offres && dossier.offres.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {dossier.offres.map((offre, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {offre.nom}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-medium">Aucune offre sélectionnée</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-amber-50 rounded-md text-amber-700 text-sm">
          <p className="font-medium">Note de confidentialité:</p>
          <p>Les informations personnelles du client ne sont pas accessibles depuis votre interface. Conformément à notre politique de confidentialité, vous avez uniquement accès aux informations nécessaires pour effectuer votre mission d'agent visio.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisioLimitedInfo;
