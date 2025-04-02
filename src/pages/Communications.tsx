
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppelList from '@/components/communication/AppelList';
import { EmailList } from '@/components/communication/EmailList';
import { MeetingList } from '@/components/communication/MeetingList';
import { CommunicationProvider } from '@/contexts/CommunicationContext';

const Communications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('appels');

  return (
    <CommunicationProvider>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Communications</h1>
        
        <Tabs defaultValue="appels" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="appels">Appels</TabsTrigger>
            <TabsTrigger value="meetings">Réunions</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appels">
            <Card>
              <CardHeader>
                <CardTitle>Historique des appels</CardTitle>
              </CardHeader>
              <CardContent>
                <AppelList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="meetings">
            <Card>
              <CardHeader>
                <CardTitle>Réunions planifiées</CardTitle>
              </CardHeader>
              <CardContent>
                <MeetingList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <EmailList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CommunicationProvider>
  );
};

export default Communications;
