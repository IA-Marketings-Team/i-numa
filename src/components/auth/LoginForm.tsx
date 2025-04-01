
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginTab from "./LoginTab";
import RegisterTab from "./RegisterTab";

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formError, setFormError] = useState("");
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setFormError("");
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/tableau-de-bord");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormError("Une erreur est survenue lors de la connexion");
    }
  };

  const handleRegister = async (
    email: string, 
    password: string, 
    nom: string, 
    prenom: string
  ) => {
    setFormError("");
    
    try {
      const success = await register(email, password, {
        nom,
        prenom,
        email,
        role: 'client'
      });
      
      if (success) {
        // Après l'inscription réussie, passer à l'onglet de connexion
        setActiveTab("login");
      }
    } catch (error) {
      console.error("Register error:", error);
      setFormError("Une erreur est survenue lors de l'inscription");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="register">Inscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <LoginTab 
            onLogin={handleLogin}
            formError={formError}
          />
        </TabsContent>
        
        <TabsContent value="register">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
            <CardDescription>
              Créez un compte pour accéder à toutes les fonctionnalités
            </CardDescription>
          </CardHeader>
          <RegisterTab 
            onRegister={handleRegister}
            formError={formError}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LoginForm;
