
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ClientForm from "@/components/client/ClientForm";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/services/client/createClient";

const ClientCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await createClient(data);
      if (result) {
        toast({
          title: "Client créé avec succès",
          description: `${data.prenom} ${data.nom} a été ajouté à la liste des clients.`,
        });
        navigate("/clients");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la création du client.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du client.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/clients");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Créer un nouveau client</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
      
      <ClientForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ClientCreatePage;
