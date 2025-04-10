
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AccessDeniedCard: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Accès refusé</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AccessDeniedCard;
