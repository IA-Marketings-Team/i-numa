
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  createdAt: string;
  phoneNumber?: string;
  address?: string;
  department?: string;
}

const dummyUsers: Record<string, User> = {
  "1": {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    lastLogin: "2023-05-15",
    createdAt: "2023-01-10",
    phoneNumber: "+33 6 12 34 56 78",
    address: "123 Rue de Paris, 75001 Paris",
    department: "IT"
  },
  "2": {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    lastLogin: "2023-05-14",
    createdAt: "2023-02-15",
    phoneNumber: "+33 6 98 76 54 32",
    department: "Marketing"
  },
  "3": {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "Editor",
    lastLogin: "2023-05-13",
    createdAt: "2023-03-22",
    address: "45 Avenue du Général Leclerc, 75014 Paris"
  }
};

const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = id ? dummyUsers[id] : null;

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Utilisateur non trouvé</h1>
          <p className="mb-4">L'utilisateur que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate("/users")}>
            Retour à la liste des utilisateurs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Détails de l'utilisateur</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/users")}>
            Retour à la liste
          </Button>
          <Button variant="outline" onClick={() => navigate(`/users/${id}/edit`)}>
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informations utilisateur</CardTitle>
            <CardDescription>Détails personnels et coordonnées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nom complet</h3>
                <p className="text-base">{user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-base">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Rôle</h3>
                <p className="text-base">{user.role}</p>
              </div>
              {user.phoneNumber && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Téléphone</h3>
                  <p className="text-base">{user.phoneNumber}</p>
                </div>
              )}
              {user.address && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
                  <p className="text-base">{user.address}</p>
                </div>
              )}
              {user.department && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Département</h3>
                  <p className="text-base">{user.department}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Compte créé le</h3>
                <p className="text-base">{user.createdAt}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Dernière connexion</h3>
                <p className="text-base">{user.lastLogin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="activity">
            <TabsList className="mb-4">
              <TabsTrigger value="activity">Activité</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Historique des dernières actions de l'utilisateur</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aucune activité récente à afficher.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>Gérer les droits d'accès de l'utilisateur</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Les permissions détaillées seront disponibles prochainement.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>Paramètres de sécurité du compte</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Les options de sécurité seront disponibles prochainement.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
