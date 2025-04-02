
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppelList } from '@/components/communication/AppelList';
import { MeetingList } from '@/components/communication/MeetingList';
import { EmailList } from '@/components/communication/EmailList';

const Communications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("emails");

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Veuillez vous connecter pour accéder à cette page</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Communications</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="appels">Appels</TabsTrigger>
          <TabsTrigger value="reunions">Réunions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="emails" className="space-y-4">
          <EmailList />
        </TabsContent>
        
        <TabsContent value="appels" className="space-y-4">
          <AppelList />
        </TabsContent>
        
        <TabsContent value="reunions" className="space-y-4">
          <MeetingList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communications;
