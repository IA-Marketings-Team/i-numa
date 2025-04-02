
import React, { useState } from 'react';
import { useCommunication } from '@/contexts/CommunicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MailOpen, Plus, Paperclip } from 'lucide-react';
import { formatDistance, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { EmailForm } from './EmailForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const EmailList = () => {
  const { user } = useAuth();
  const { emails, fetchingEmails, markAsRead } = useCommunication();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [viewingEmail, setViewingEmail] = useState<string | null>(null);

  if (!user) return null;

  const userEmails = emails.filter(
    email => 
      email.expediteurId === user.id || 
      email.destinataireIds.includes(user.id) ||
      (email.destinatairesCc && email.destinatairesCc.includes(user.id)) ||
      (email.destinatairesBcc && email.destinatairesBcc.includes(user.id))
  );

  if (fetchingEmails) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Emails</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> Nouvel email
          </Button>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const handleEmailClick = async (emailId: string) => {
    setViewingEmail(emailId);
    // Mark as read if not already
    const email = userEmails.find(e => e.id === emailId);
    if (email && !email.lu && email.expediteurId !== user.id) {
      await markAsRead(emailId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Emails</h2>
        <Button onClick={() => {
          setSelectedEmail(null);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Nouvel email
        </Button>
      </div>

      {userEmails.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucun email à afficher
          </CardContent>
        </Card>
      ) : (
        userEmails.map((email) => (
          <Card 
            key={email.id} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${!email.lu && email.expediteurId !== user.id ? 'bg-blue-50' : ''}`}
            onClick={() => handleEmailClick(email.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-base font-semibold flex items-center">
                  {email.lu || email.expediteurId === user.id ? (
                    <MailOpen className="mr-2 h-4 w-4" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  {email.sujet}
                </CardTitle>
                {email.pieceJointes && email.pieceJointes.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {email.pieceJointes.length}
                  </Badge>
                )}
              </div>
              <CardDescription className="flex items-center gap-1">
                {email.expediteurId === user.id ? 'À: ' : 'De: '}
                {email.expediteurId === user.id 
                  ? email.destinataireIds.join(', ')
                  : email.expediteurId
                }
                <span className="mx-1">•</span>
                {formatDistance(new Date(email.dateEnvoi), new Date(), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {email.contenu}
              </p>
            </CardContent>
          </Card>
        ))
      )}

      {/* Dialogue pour composer un nouvel email */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEmail ? "Répondre" : "Nouvel email"}
            </DialogTitle>
          </DialogHeader>
          <EmailForm 
            emailId={selectedEmail} 
            onSuccess={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Dialogue pour afficher le détail d'un email */}
      <Dialog 
        open={viewingEmail !== null} 
        onOpenChange={(open) => {
          if (!open) setViewingEmail(null);
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          {viewingEmail && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {userEmails.find(e => e.id === viewingEmail)?.sujet}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div>
                    <div><strong>De:</strong> {userEmails.find(e => e.id === viewingEmail)?.expediteurId}</div>
                    <div><strong>À:</strong> {userEmails.find(e => e.id === viewingEmail)?.destinataireIds.join(', ')}</div>
                    {userEmails.find(e => e.id === viewingEmail)?.destinatairesCc?.length > 0 && (
                      <div><strong>Cc:</strong> {userEmails.find(e => e.id === viewingEmail)?.destinatairesCc?.join(', ')}</div>
                    )}
                  </div>
                  <div>
                    {format(new Date(userEmails.find(e => e.id === viewingEmail)?.dateEnvoi || new Date()), 'PPP à HH:mm', { locale: fr })}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="whitespace-pre-line">{userEmails.find(e => e.id === viewingEmail)?.contenu}</div>
                </div>
                
                {userEmails.find(e => e.id === viewingEmail)?.pieceJointes?.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Pièces jointes</h3>
                    <div className="flex flex-wrap gap-2">
                      {userEmails.find(e => e.id === viewingEmail)?.pieceJointes?.map((piece, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {piece}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const email = userEmails.find(e => e.id === viewingEmail);
                      setSelectedEmail(email?.id || null);
                      setIsFormOpen(true);
                      setViewingEmail(null);
                    }}
                  >
                    Répondre
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => setViewingEmail(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
