
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send } from "lucide-react";
import { DossierComment, UserRole } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import LogCallButton from "./LogCallButton";
import { CallData } from "./LogCallModal";

interface DossierCommentSectionProps {
  comments: DossierComment[];
  onAddComment: (content: string, isPublic?: boolean) => Promise<void>;
  onLogCall?: (callData: CallData) => Promise<void>;
  userRole: UserRole;
  loading: boolean;
}

const DossierCommentSection: React.FC<DossierCommentSectionProps> = ({
  comments,
  onAddComment,
  onLogCall,
  userRole,
  loading
}) => {
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(comment, isPublic);
      setComment("");
      setIsPublic(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAddCallNote = ["agent_phoner", "superviseur", "responsable"].includes(userRole);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Commentaires et notes</h3>
        {canAddCallNote && onLogCall && (
          <div>
            <LogCallButton 
              dossierId="dossierId" 
              onLogCall={onLogCall} 
              disabled={loading}
            />
          </div>
        )}
      </div>

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border ${
                comment.isCallNote 
                  ? "bg-blue-50 border-blue-200" 
                  : comment.isPublic 
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {comment.userRole.replace("_", " ")}
                  </span>
                  {comment.isCallNote && (
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                      Note d'appel
                    </span>
                  )}
                  {comment.isPublic && (
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                      Visible par le client
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm", { locale: fr })}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
              {comment.isCallNote && comment.callDuration && (
                <div className="mt-1 text-xs text-gray-500">
                  Durée de l'appel: {Math.floor(comment.callDuration / 60)}:{comment.callDuration % 60 < 10 ? `0${comment.callDuration % 60}` : comment.callDuration % 60}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border">
          <MessageCircle className="mx-auto h-8 w-8 mb-2 text-gray-400" />
          <p>Aucun commentaire pour le moment</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Ajouter un commentaire..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked as boolean)}
            />
            <Label htmlFor="is-public">Visible par le client</Label>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!comment.trim() || isSubmitting || loading}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Envoi en cours..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DossierCommentSection;
