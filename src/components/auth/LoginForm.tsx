import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from "@/components/auth/LoginTab";
import { RegisterTab } from "@/components/auth/RegisterTab";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formError, setFormError] = useState("");
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    setFormError("");
    try {
      await login(email, password);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setFormError(
        (error as Error)?.message || "Une erreur est survenue lors de la connexion."
      );
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    nom: string,
    prenom: string,
    role: UserRole
  ) => {
    setFormError("");
    try {
      await register(email, password, { 
        nom, 
        prenom, 
        role 
      });
      toast({
        title: "Inscription réussie",
        description: "Vous pouvez maintenant vous connecter à votre compte.",
      });
      setActiveTab("login");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setFormError(
        (error as Error)?.message || "Une erreur est survenue lors de l'inscription."
      );
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Se connecter</TabsTrigger>
            <TabsTrigger value="register">S'inscrire</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginTab onLogin={handleLogin} formError={formError} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterTab onRegister={handleRegister} formError={formError} />
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default LoginForm;
