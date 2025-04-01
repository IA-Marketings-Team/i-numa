import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { isDemoAccount } from "@/contexts/auth/demoUserHandling";

// Import our components
import ErrorAlert from "./ErrorAlert";
import LoginHeader from "./LoginHeader";
import LoginCredentialsForm from "./LoginCredentialsForm";
import DemoAccountsList from "./DemoAccountsList";

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
      
      const success = await login(cleanedEmail, password);
      
      if (success) {
        navigate("/tableau-de-bord", { replace: true });
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
      <LoginHeader />
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <ErrorAlert error={error} onDismiss={() => setError(null)} />
          
          <LoginCredentialsForm
            email={email}
            password={password}
            isLoading={isLoading}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
          />
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
        <DemoAccountsList 
          accounts={demoAccounts} 
          onSelectAccount={selectDemoAccount}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
};

export default LoginForm;
