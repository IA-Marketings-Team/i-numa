
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircle, XCircle, FileSignature, PhoneCall } from "lucide-react";

interface StatsCardsProps {
  rdvEnCours: number;
  rdvHonores: number;
  rdvNonHonores: number;
  signaturesEffectuees: number;
  nbAppels: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  rdvEnCours,
  rdvHonores,
  rdvNonHonores,
  signaturesEffectuees,
  nbAppels
}) => {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">RDV en cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div className="text-2xl font-bold">{rdvEnCours}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">RDV honorés/non honorés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-lg font-semibold">{rdvHonores}</span>
            </div>
            <div className="text-xl">/</div>
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-lg font-semibold">{rdvNonHonores}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Signatures effectuées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <FileSignature className="h-4 w-4 text-muted-foreground" />
            <div className="text-2xl font-bold">{signaturesEffectuees}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Nombre d'appels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
            <div className="text-2xl font-bold">{nbAppels}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
