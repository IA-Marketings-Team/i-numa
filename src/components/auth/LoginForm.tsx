import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { isDemoAccount } from "@/contexts/auth/demoUserHandling";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (!email) {
      setError("Veuillez saisir une adresse email");
      setIsLoading(false);
      return;
    }
    
    try {
      const cleanedEmail = email.trim().toLowerCase();
      const isDemo = isDemoAccount(cleanedEmail);
      const passwordToUse = isDemo ? "demo12345" : password;
      
      if (!isDemo && !password) {
        setError("Veuillez saisir un mot de passe");
        setIsLoading(false);
        return;
      }
      
      const success = await login(cleanedEmail, passwordToUse);
      
      if (success) {
        navigate("/tableau-de-bord");
      } else {
        setError("Identifiants incorrects. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Une erreur s'est produite lors de la connexion.");
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'jean.dupont@example.com', role: 'client' },
    { email: 'thomas.leroy@example.com', role: 'agent_phoner' },
    { email: 'claire.moreau@example.com', role: 'agent_visio' },
    { email: 'ahmed.tayin@example.com', role: 'superviseur' },
    { email: 'marie.andy@example.com', role: 'responsable' }
  ];

  const selectDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo12345");
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
              placeholder="exemple@domain.com"
              disabled={isLoading}
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
              required={!isDemoAccount(email)}
              placeholder="********"
              disabled={isLoading}
            />
            {isDemoAccount(email) && (
              <p className="text-xs text-muted-foreground mt-1">
                Pour les comptes de démonstration, le mot de passe est "demo12345".
              </p>
            )}
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

      <div className="px-6 pb-6">
        <div className="mt-4 text-sm bg-muted p-3 rounded-md">
          <p className="font-medium mb-2">Comptes de démonstration disponibles:</p>
          <div className="grid gap-1">
            {demoAccounts.map((account) => (
              <button 
                key={account.email} 
                type="button"
                onClick={() => selectDemoAccount(account.email)}
                className="text-xs text-left hover:bg-muted-foreground/10 p-1 rounded flex justify-between"
                disabled={isLoading}
              >
                <span>{account.email}</span>
                <span className="text-muted-foreground">{account.role}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Cliquez sur un email pour le sélectionner. Le mot de passe "demo12345" est prédéfini.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default LoginForm;
