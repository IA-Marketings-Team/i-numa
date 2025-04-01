
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const isDemoAccount = (email: string): boolean => {
    const demoAccounts = [
      "jean.dupont@example.com", 
      "thomas.leroy@example.com", 
      "claire.moreau@example.com", 
      "ahmed.tayin@example.com", 
      "marie.andy@example.com"
    ];
    return demoAccounts.includes(email);
  };

  const handleDemoLogin = async (email: string): Promise<boolean> => {
    // Pour les comptes de démo, on contourne la vérification du mot de passe
    // en créant directement une session Supabase
    try {
      console.log("Tentative de connexion avec compte démo:", email);
      
      // On s'assure d'abord que l'utilisateur existe dans auth
      const { data: userExists } = await supabase.auth.signInWithPassword({
        email: email,
        password: "demo12345" // Mot de passe par défaut pour les démos
      });
      
      if (userExists.user) {
        console.log("Connexion démo réussie");
        return true;
      } else {
        // Si l'utilisateur n'existe pas dans auth, on le crée d'abord
        console.log("Création du compte démo dans auth");
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: "demo12345" // Mot de passe par défaut pour les démos
        });
        
        if (signUpError) {
          console.error("Erreur lors de la création du compte démo:", signUpError);
          return false;
        }
        
        if (newUser.user) {
          console.log("Compte démo créé avec succès");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Erreur lors du login démo:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      let success = false;
      
      if (isDemoAccount(email)) {
        // Logique spéciale pour les comptes de démonstration
        console.log("Compte de démonstration détecté, tentative de connexion...");
        success = await handleDemoLogin(email);
      } else {
        // Connexion normale pour les autres comptes
        success = await login(email, password);
      }
      
      if (!success) {
        setError("Identifiants incorrects. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Une erreur s'est produite lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour accéder à votre compte
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
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
          )}
          
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                to="/reset-password"
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
          
          <div className="text-sm text-center">
            Vous n'avez pas de compte?{" "}
            <Link to="/inscription" className="text-primary hover:underline">
              S'inscrire
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
