
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

const AccessDeniedCard = () => {
  return (
    <Card className="mx-auto max-w-md mt-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-red-600">
          <ShieldAlert className="h-5 w-5 mr-2" />
          Accès refusé
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité. 
          Cette page est réservée aux superviseurs et responsables.
        </p>
      </CardContent>
    </Card>
  );
};

export default AccessDeniedCard;
