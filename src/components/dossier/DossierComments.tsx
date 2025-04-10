import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DossierComment, UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Phone } from "lucide-react";
import { CallData } from "./LogCallModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DossierCommentsProps {
  comments: DossierComment[];
  onAddComment: (content: string) => Promise<void>;
  onAddCallNote: (callData: CallData) => Promise<void>;
}

const DossierComments: React.FC<DossierCommentsProps> = ({
  comments,
  onAddComment,
  onAddCallNote,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isAddingCallNote, setIsAddingCallNote] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const { user } = useAuth();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    await onAddComment(newComment);
    setNewComment("");
    setIsPublic(false);
  };

  const handleAddCallNote = async () => {
    if (!newComment.trim()) return;
    
    const callData: CallData = {
      content: newComment,
      duration: callDuration,
    };
    
    await onAddCallNote(callData);
    setNewComment("");
    setCallDuration(0);
    setIsAddingCallNote(false);
  };

  const getRoleBadgeClass = (role: UserRole) => {
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

  const formatTimeAgo = (date: Date) => {
    return format(new Date(date), "PPP 'à' HH:mm", { locale: fr });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const canMakePublicComments = user?.role === 'superviseur' || user?.role === 'responsable';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-3">Commentaires</h3>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
            Aucun commentaire pour ce dossier
          </p>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`border rounded-lg p-3 ${
                comment.isCallNote 
                  ? 'border-blue-200 bg-blue-50' 
                  : comment.isPublic 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(comment.userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{comment.userName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeClass(comment.userRole)}`}>
                        {comment.userRole.replace('_', ' ')}
                      </span>
                      {comment.isCallNote && (
                        <span className="flex items-center text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          <Phone className="h-3 w-3 mr-1" />
                          Appel ({comment.callDuration} min)
                        </span>
                      )}
                      {comment.isPublic && (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="border rounded-lg p-4 space-y-3">
        {isAddingCallNote ? (
          <>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center">
                <Phone className="h-4 w-4 mr-2 text-blue-600" />
                Ajouter une note d'appel
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Durée (minutes):</span>
                <input
                  type="number"
                  min="1"
                  value={callDuration}
                  onChange={(e) => setCallDuration(parseInt(e.target.value) || 0)}
                  className="w-16 h-8 border rounded px-2 text-sm"
                />
              </div>
            </div>
          </>
        ) : (
          <h4 className="font-medium text-sm">Ajouter un commentaire</h4>
        )}
        
        <Textarea
          placeholder={isAddingCallNote ? "Détails de l'appel..." : "Votre commentaire..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="resize-none"
        />
        
        {!isAddingCallNote && canMakePublicComments && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPublic" 
              checked={isPublic} 
              onCheckedChange={(checked) => setIsPublic(checked === true)}
            />
            <Label htmlFor="isPublic" className="text-sm">
              Commentaire visible par le client
            </Label>
          </div>
        )}
        
        <div className="flex justify-between">
          {isAddingCallNote ? (
            <Button 
              variant="outline" 
              onClick={() => setIsAddingCallNote(false)}
              size="sm"
            >
              Annuler
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsAddingCallNote(true)}
              size="sm"
              className="flex items-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              Noter un appel
            </Button>
          )}
          
          <Button 
            onClick={isAddingCallNote ? handleAddCallNote : handleAddComment}
            size="sm"
            disabled={!newComment.trim()}
          >
            {isAddingCallNote ? "Enregistrer l'appel" : "Ajouter"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DossierComments;
