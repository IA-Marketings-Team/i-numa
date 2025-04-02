
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import ProspectList from '@/components/prospect/ProspectList';
import ProspectForm from '@/components/prospect/ProspectForm';
import ProspectSummary from '@/components/prospect/ProspectSummary';
import ProspectByPhoner from '@/components/prospect/ProspectByPhoner';
import ProspectByClient from '@/components/prospect/ProspectByClient';

const ProspectsPage: React.FC = () => {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  return (
    <CommunicationProvider>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-primary-gradient bg-clip-text text-transparent">Gestion des Prospects</h1>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Nouvelle fiche
          </Button>
        </div>
        
        <Card className="border-0 shadow-md bg-card-gradient">
          <CardHeader className="pb-3">
            <CardTitle>Fiches de prospection</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">Historique global</TabsTrigger>
                <TabsTrigger value="byPhoner">Par phoner</TabsTrigger>
                <TabsTrigger value="byClient">Par client</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <ProspectList />
              </TabsContent>
              
              <TabsContent value="byPhoner">
                <ProspectByPhoner />
              </TabsContent>
              
              <TabsContent value="byClient">
                <ProspectByClient />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <ProspectSummary />
        
        {/* Dialog pour créer une nouvelle fiche */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle fiche de prospection</DialogTitle>
            </DialogHeader>
            <ProspectForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </CommunicationProvider>
  );
};

export default ProspectsPage;
