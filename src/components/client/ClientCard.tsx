
import React from "react";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Eye, FileEdit, Trash2, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ClientCardProps {
  client: Client;
  onView: (clientId: string) => void;
  onEdit: (clientId: string) => void;
  onDelete: (client: Client) => void;
  onCall: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onView,
  onEdit,
  onDelete,
  onCall
}) => {
  const { hasPermission } = useAuth();

  return (
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">
            {client.nom} {client.prenom}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <p className="text-gray-600">{client.email}</p>
            <p className="text-gray-600">{client.telephone}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {client.secteurActivite}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
              {client.typeEntreprise}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(client.id)}
            className="flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Voir</span>
          </Button>
          
          {hasPermission(['agent_phoner', 'agent_visio']) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCall(client)}
              className="flex items-center gap-1"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Appeler</span>
            </Button>
          )}
          
          {hasPermission(['superviseur', 'responsable']) && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(client.id)}
                className="flex items-center gap-1"
              >
                <FileEdit className="w-4 h-4" />
                <span className="hidden sm:inline">Modifier</span>
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(client)}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Supprimer</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </CardContent>
  );
};

export default ClientCard;
