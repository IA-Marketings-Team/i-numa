
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchClientById, updateClient } from "@/services/client/clientService";
import { Client } from "@/types";
import ClientForm from "@/components/client/ClientForm";

const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadClient = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const clientData = await fetchClientById(id);
        if (clientData) {
          setClient(clientData);
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Client introuvable",
          });
          navigate("/clients");
        }
      } catch (error) {
        console.error("Error loading client:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les informations du client.",
        });
        navigate("/clients");
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const updated = await updateClient({ id, ...data });
      if (updated) {
        toast({
          title: "Client mis à jour",
          description: "Les informations du client ont été mises à jour avec succès.",
        });
        navigate(`/clients/${id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour le client.",
        });
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du client.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/clients/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Chargement des informations client...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modifier le client</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/clients/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au détail
        </Button>
      </div>
      
      {client && (
        <ClientForm
          client={client}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default ClientEditPage;
