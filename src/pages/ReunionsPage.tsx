
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MeetingForm } from '@/components/communication/MeetingForm';
import { MeetingList } from '@/components/communication/MeetingList';
import { CommunicationProvider } from '@/contexts/CommunicationContext';

const ReunionsPage: React.FC = () => {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <CommunicationProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion des réunions</h1>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Nouvelle réunion
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Liste des réunions</CardTitle>
          </CardHeader>
          <CardContent>
            <MeetingList />
          </CardContent>
        </Card>
        
        {/* Dialog pour créer une nouvelle réunion */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle réunion</DialogTitle>
            </DialogHeader>
            <MeetingForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </CommunicationProvider>
  );
};

export default ReunionsPage;
