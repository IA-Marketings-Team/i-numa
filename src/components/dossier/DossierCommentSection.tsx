
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MessageSquare, PhoneCall } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DossierComment, UserRole } from "@/types";
import { Separator } from "@/components/ui/separator";

interface DossierCommentSectionProps {
  comments: DossierComment[];
  userRole: UserRole;
  onAddComment: (content: string, isPublic: boolean) => Promise<void>;
  loading?: boolean;
}

const DossierCommentSection: React.FC<DossierCommentSectionProps> = ({
  comments,
  userRole,
  onAddComment,
  loading = false,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sort comments by date (newest first)
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment, isPublic);
      setNewComment("");
      setIsPublic(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canMakePublicComments = ["superviseur", "responsable"].includes(userRole);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Commentaires et Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new comment form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading || isSubmitting}
          />
          
          {canMakePublicComments && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isPublic" 
                checked={isPublic} 
                onCheckedChange={(checked) => setIsPublic(checked === true)}
                disabled={loading || isSubmitting}
              />
              <Label htmlFor="isPublic" className="text-sm">
                Commentaire visible par le client
              </Label>
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={loading || isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? "Envoi en cours..." : "Ajouter un commentaire"}
          </Button>
        </form>
        
        <Separator className="my-4" />
        
        {/* Comments list */}
        {sortedComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun commentaire pour ce dossier
          </div>
        ) : (
          <div className="space-y-4">
            {sortedComments.map((comment) => (
              <div
                key={comment.id}
                className={`rounded-lg p-4 ${
                  comment.isCallNote
                    ? "bg-blue-50 border border-blue-100"
                    : comment.isPublic
                    ? "bg-green-50 border border-green-100"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {comment.isCallNote ? (
                      <PhoneCall className="h-4 w-4 text-blue-600" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                    )}
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-sm text-gray-500">({comment.userRole})</span>
                    {comment.isPublic && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Public
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(comment.createdAt), "dd/MM/yyyy à HH:mm", {
                      locale: fr,
                    })}
                  </span>
                </div>
                
                <div className="mt-2 whitespace-pre-wrap">{comment.content}</div>
                
                {comment.isCallNote && comment.callDuration && (
                  <div className="mt-2 text-sm text-blue-600">
                    Durée de l'appel: {comment.callDuration} minute(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DossierCommentSection;
