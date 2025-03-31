
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profil");
  
  const [email, setEmail] = useState(user?.email || "");
  const [telephone, setTelephone] = useState(user?.telephone || "");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true
  });
  
  const handleSaveProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès."
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Préférences de notification mises à jour",
      description: "Vos préférences ont été enregistrées avec succès."
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Paramètres</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="securite">Sécurité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles ici
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" value={user?.nom} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" value={user?.prenom} disabled />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input 
                  id="telephone" 
                  type="tel" 
                  value={telephone} 
                  onChange={(e) => setTelephone(e.target.value)} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Enregistrer les modifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-gray-500">Recevez des notifications par email</p>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par SMS</p>
                  <p className="text-sm text-gray-500">Recevez des notifications par SMS</p>
                </div>
                <Switch 
                  checked={notifications.sms} 
                  onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications dans l'application</p>
                  <p className="text-sm text-gray-500">Recevez des notifications dans l'application</p>
                </div>
                <Switch 
                  checked={notifications.app} 
                  onCheckedChange={(checked) => setNotifications({...notifications, app: checked})} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Enregistrer les préférences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="securite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>
                Gérez votre mot de passe et la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Changer le mot de passe</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
