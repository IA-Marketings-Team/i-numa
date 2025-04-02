
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => navigate("/dashboard/clients/nouveau")}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>
      <p className="text-muted-foreground">
        This page will display clients fetched from Supabase.
      </p>
    </div>
  );
};

export default ClientsPage;
