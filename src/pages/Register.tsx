import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { customRegister } from "@/services/supabase/authService";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tableau-de-bord");
    }
  }, [isAuthenticated, navigate]);
  
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
      const newUser = await customRegister(
        nom,
        prenom,
        email,
        telephone,
        role,
        password
      );
      
      if (!newUser) {
        setError("Impossible de créer l'utilisateur");
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      
      navigate("/connexion");
      
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err);
      setError(err.message || "Une erreur inattendue s'est produite");
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
