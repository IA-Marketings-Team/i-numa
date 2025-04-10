
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDossierConsultations } from "@/services/consultationService";
import { DossierConsultation } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Search, User, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const DossierConsultationsPage: React.FC = () => {
  const [consultations, setConsultations] = useState<DossierConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur a les droits d'accès
    if (!hasPermission(['superviseur', 'responsable'])) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page."
      });
      navigate("/");
      return;
    }

    // Charger les consultations
    const loadConsultations = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDossierConsultations();
        setConsultations(data);
      } catch (error) {
        console.error("Erreur lors du chargement des consultations:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des consultations."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConsultations();
  }, [hasPermission, navigate, toast]);

  // Filtrer les consultations en fonction du terme de recherche
  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.userRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.dossierId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl">Historique des consultations de dossiers</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-end">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-6">
              <p>Chargement des consultations...</p>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center p-6">
              <p>Aucune consultation trouvée.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Utilisateur</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rôle</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dossier</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredConsultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {consultation.userName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                          {consultation.userRole}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          {consultation.dossierId.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {format(consultation.timestamp, "PPP à HH:mm", { locale: fr })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/dossiers/${consultation.dossierId}`)}
                        >
                          Voir le dossier
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DossierConsultationsPage;
