
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createUser } from "@/services/supabase/usersService";
import { UserRole } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Créer un utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom,
            prenom,
            telephone,
            role
          }
        }
      });
      
      if (authError) {
        console.error("Erreur d'inscription:", authError);
        setError(authError.message);
        setIsLoading(false);
        return;
      }
      
      if (!authData.user) {
        setError("Impossible de créer l'utilisateur");
        setIsLoading(false);
        return;
      }
      
      // Attendre un moment pour que l'utilisateur soit créé dans auth avant d'essayer d'insérer dans la table users
      setTimeout(async () => {
        try {
          // Créer l'utilisateur dans notre table users personnalisée
          const newUser = await createUser({
            nom,
            prenom,
            email,
            telephone,
            role,
            auth_id: authData.user.id
          });
          
          if (!newUser) {
            setError("Compte créé mais impossible de sauvegarder toutes les informations");
          } else {
            toast({
              title: "Inscription réussie",
              description: "Votre compte a été créé avec succès",
            });
            
            // Rediriger vers la page de connexion
            navigate("/connexion");
          }
        } catch (err) {
          console.error("Erreur lors de la création du profil utilisateur:", err);
          setError("Compte créé mais impossible de sauvegarder toutes les informations");
        } finally {
          setIsLoading(false);
        }
      }, 1000);
      
    } catch (err) {
      console.error("Erreur inattendue lors de l'inscription:", err);
      setError("Une erreur inattendue s'est produite");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-2">i-numa</h1>
          <p className="text-gray-600">
            Créez votre compte pour accéder à la plateforme
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>
              Remplissez ce formulaire pour créer votre compte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="px-6">
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className="flex items-center justify-between">
                    {error}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setError(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="agent_phoner">Agent Phoner</SelectItem>
                    <SelectItem value="agent_visio">Agent Visio</SelectItem>
                    <SelectItem value="agent_developpeur">Agent Développeur</SelectItem>
                    <SelectItem value="agent_marketing">Agent Marketing</SelectItem>
                    <SelectItem value="superviseur">Superviseur</SelectItem>
                    <SelectItem value="responsable">Responsable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
              
              <div className="text-sm text-center">
                Vous avez déjà un compte?{" "}
                <Link to="/connexion" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
