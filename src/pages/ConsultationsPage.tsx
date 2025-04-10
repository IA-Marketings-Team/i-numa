
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchRecentConsultations } from "@/services/consultationService";
import { DossierConsultation } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, FileText, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ConsultationsPage: React.FC = () => {
  const [consultations, setConsultations] = useState<DossierConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadConsultations = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRecentConsultations(100);
        setConsultations(data);
      } catch (error) {
        console.error("Error loading consultations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsultations();
  }, []);

  const formatDate = (date: Date) => {
    return format(new Date(date), "PPP 'à' HH:mm", { locale: fr });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'agent_phoner':
        return 'bg-green-100 text-green-800';
      case 'agent_visio':
        return 'bg-purple-100 text-purple-800';
      case 'superviseur':
        return 'bg-amber-100 text-amber-800';
      case 'responsable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDossier = (dossierId: string) => {
    navigate(`/dossiers/${dossierId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Consultations des dossiers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : consultations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune consultation de dossier enregistrée.
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <Card key={consultation.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{consultation.userName}</span>
                          <Badge className={`${getRoleBadgeClass(consultation.userRole)}`}>
                            {consultation.userRole.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatDate(consultation.timestamp)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDossier(consultation.dossierId)}
                          className="flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Voir le dossier</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationsPage;
