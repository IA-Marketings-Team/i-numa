
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

const AccessDeniedCard: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Card className="border-red-200">
        <CardHeader className="flex items-center">
          <ShieldAlert className="h-10 w-10 text-red-500 mb-4" />
          <CardTitle className="text-red-500">Accès refusé</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AccessDeniedCard;
