
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ClientForm from "@/components/client/ClientForm";

const ClientCreatePage: React.FC = () => {
  const navigate = useNavigate();

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
      
      <ClientForm />
    </div>
  );
};

export default ClientCreatePage;
