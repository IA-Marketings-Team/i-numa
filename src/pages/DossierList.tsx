
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useDossier } from "@/contexts/DossierContext";
import { useAuth } from "@/contexts/AuthContext";
import DossierList from "@/components/dossier/DossierList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DossierListPage = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { fetchDossiers, dossiers, isLoading } = useDossier();
  const [activeTab, setActiveTab] = useState("tous");

  useEffect(() => {
    const loadDossiers = async () => {
      await fetchDossiers();
    };
    
    loadDossiers();
  }, []);

  const filteredDossiers = dossiers.filter((dossier) => {
    if (activeTab === "tous") return true;
    if (activeTab === "mes-dossiers" && user) {
      if (user.role === "agent_phoner") {
        return dossier.agentPhonerId === user.id;
      } else if (user.role === "agent_visio") {
        return dossier.agentVisioId === user.id;
      }
    }
    return dossier.statut === activeTab;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dossiers</h1>
        {hasPermission(["agent_phoner", "agent_visio", "superviseur", "responsable"]) && (
          <Button onClick={() => navigate("/dossiers/nouveau")}>
            <Plus className="mr-2 h-4 w-4" /> Nouveau dossier
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des dossiers</CardTitle>
          <CardDescription>
            Consultez et gérez tous les dossiers clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="tous">Tous</TabsTrigger>
              <TabsTrigger value="mes-dossiers">Mes dossiers</TabsTrigger>
              <TabsTrigger value="en_cours">En cours</TabsTrigger>
              <TabsTrigger value="signe">Signés</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <DossierList dossiers={filteredDossiers} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DossierListPage;
