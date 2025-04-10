
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RdvCompletionStats } from "@/services/dynamicStatService";
import { CheckCircle, XCircle } from "lucide-react";

interface RdvCompletionCardProps {
  data: RdvCompletionStats | null;
}

export const RdvCompletionCard: React.FC<RdvCompletionCardProps> = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Taux de conversion des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taux de conversion des rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Taux de conversion</span>
              <span className="text-2xl font-bold">{data.taux_completion.toFixed(1)}%</span>
            </div>
            <Progress value={data.taux_completion} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-3">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Honorés</div>
                <div className="text-2xl font-bold">{data.honores}</div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg flex items-center space-x-3">
              <XCircle className="h-10 w-10 text-red-500" />
              <div>
                <div className="text-sm text-muted-foreground">Non honorés</div>
                <div className="text-2xl font-bold">{data.non_honores}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">Total des rendez-vous</div>
            <div className="text-2xl font-bold">{data.total_rdv}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RdvCompletionCard;
