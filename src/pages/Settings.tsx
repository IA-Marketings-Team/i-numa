
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { FileDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "profil");
  const [contracts, setContracts] = useState([]);
  const isClient = user?.role === 'client';
  
  // Profil
  const [email, setEmail] = useState(user?.email || "");
  const [telephone, setTelephone] = useState(user?.telephone || "");
  const [adresse, setAdresse] = useState(user?.adresse || "");
  const [ville, setVille] = useState(user?.ville || "");
  const [codePostal, setCodePostal] = useState(user?.codePostal || "");
  
  // Mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // IBAN
  const [iban, setIban] = useState(user?.iban || "");
  const [bic, setBic] = useState(user?.bic || "");
  const [nomBanque, setNomBanque] = useState(user?.nomBanque || "");

  // Charger les contrats depuis le localStorage
  useEffect(() => {
    const storedContracts = JSON.parse(localStorage.getItem("contracts") || "[]");
    setContracts(storedContracts);
  }, []);
  
  const handleSaveProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès."
    });
  };
  
  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur de mot de passe",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès."
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleSaveBankInfo = () => {
    toast({
      title: "Informations bancaires mises à jour",
      description: "Vos coordonnées bancaires ont été enregistrées avec succès."
    });
  };
  
  const handleDownloadContract = (contractId) => {
    toast({
      title: "Téléchargement du contrat",
      description: "Le téléchargement de votre contrat va commencer."
    });
    
    // Dans une application réelle, nous ajouterions ici le code pour télécharger un fichier PDF
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Définir les onglets disponibles en fonction du rôle de l'utilisateur
  const getAvailableTabs = () => {
    const tabs = [{ id: "profil", label: "Profil" }];
    
    // Seul le client voit les onglets d'informations bancaires et de contrat
    if (isClient) {
      tabs.push({ id: "bancaire", label: "Informations bancaires" });
      tabs.push({ id: "contrat", label: "Contrat" });
    }
    
    return tabs;
  };

  // Vérifier si l'onglet actif est valide pour ce rôle d'utilisateur
  useEffect(() => {
    const availableTabs = getAvailableTabs().map(tab => tab.id);
    if (!availableTabs.includes(activeTab)) {
      setActiveTab("profil");
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mon compte</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className={`grid ${isClient ? 'grid-cols-3' : 'grid-cols-1'} md:w-[400px]`}>
          {getAvailableTabs().map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
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
              
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Textarea 
                  id="adresse" 
                  value={adresse} 
                  onChange={(e) => setAdresse(e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input 
                    id="ville" 
                    value={ville} 
                    onChange={(e) => setVille(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code postal</Label>
                  <Input 
                    id="codePostal" 
                    value={codePostal} 
                    onChange={(e) => setCodePostal(e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button onClick={handleSaveProfile} className="w-full sm:w-auto">Enregistrer les modifications</Button>
              
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Modification du mot de passe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePassword}>Changer le mot de passe</Button>
                </CardFooter>
              </Card>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {isClient && (
          <>
            <TabsContent value="bancaire" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations bancaires</CardTitle>
                  <CardDescription>
                    Gérez vos coordonnées bancaires pour les paiements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <Input 
                      id="iban" 
                      value={iban} 
                      onChange={(e) => setIban(e.target.value)} 
                      placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bic">BIC / SWIFT</Label>
                    <Input 
                      id="bic" 
                      value={bic} 
                      onChange={(e) => setBic(e.target.value)} 
                      placeholder="XXXXXXXXXXXX"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nomBanque">Nom de la banque</Label>
                    <Input 
                      id="nomBanque" 
                      value={nomBanque} 
                      onChange={(e) => setNomBanque(e.target.value)} 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveBankInfo}>Enregistrer les informations bancaires</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="contrat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents contractuels</CardTitle>
                  <CardDescription>
                    Consultez et téléchargez vos documents contractuels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contracts.length > 0 ? (
                    contracts.map((contract) => (
                      <div key={contract.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Contrat de service</h3>
                            <p className="text-sm text-muted-foreground">Signé le {formatDate(contract.date)}</p>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Articles:</p>
                              <ul className="text-sm list-disc pl-5 mt-1">
                                {contract.items.map((item, index) => (
                                  <li key={index}>{item.title} ({item.quantity})</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => handleDownloadContract(contract.id)}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Vous n'avez pas encore de contrat</p>
                    </div>
                  )}
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Conditions générales</h3>
                        <p className="text-sm text-muted-foreground">Version 2.1 - Mise à jour le 01/01/2023</p>
                      </div>
                      <Button variant="outline" onClick={() => handleDownloadContract('cgu')}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Politique de confidentialité</h3>
                        <p className="text-sm text-muted-foreground">Version 1.3 - Mise à jour le 01/06/2023</p>
                      </div>
                      <Button variant="outline" onClick={() => handleDownloadContract('privacy')}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
