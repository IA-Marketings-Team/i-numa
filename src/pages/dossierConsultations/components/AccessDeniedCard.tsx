
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AccessDeniedCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accès refusé</CardTitle>
        <CardDescription>
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Seuls les superviseurs et les responsables peuvent consulter l'historique des consultations des dossiers.</p>
      </CardContent>
    </Card>
  );
};

export default AccessDeniedCard;
