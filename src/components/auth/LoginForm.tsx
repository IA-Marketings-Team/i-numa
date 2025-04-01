
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LoginForm = () => {
  // État pour la gestion des onglets (connexion/inscription)
  const [activeTab, setActiveTab] = useState("login");
  
  // États pour le formulaire de connexion
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour le formulaire d'inscription
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [registerIsLoading, setRegisterIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/tableau-de-bord");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterIsLoading(true);
    setFormError("");
    
    if (registerPassword !== registerConfirmPassword) {
      setFormError("Les mots de passe ne correspondent pas");
      setRegisterIsLoading(false);
      return;
    }
    
    if (!registerEmail || !registerPassword || !nom || !prenom) {
      setFormError("Tous les champs sont obligatoires");
      setRegisterIsLoading(false);
      return;
    }

    try {
      const success = await register(registerEmail, registerPassword, {
        nom,
        prenom,
        email: registerEmail,
        role: 'client'
      });
      
      if (success) {
        // Après l'inscription réussie, passer à l'onglet de connexion
        setActiveTab("login");
        setEmail(registerEmail);
        // Réinitialiser le formulaire d'inscription
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
        setNom("");
        setPrenom("");
      }
    } catch (error) {
      console.error("Register error:", error);
      setFormError("Une erreur est survenue lors de l'inscription");
    } finally {
      setRegisterIsLoading(false);
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
          <CardContent>
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              onClick={handleLoginSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="register">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
            <CardDescription>
              Créez un compte pour accéder à toutes les fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    type="text"
                    placeholder="Dupont"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    type="text"
                    placeholder="Jean"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              onClick={handleRegisterSubmit}
              disabled={registerIsLoading}
            >
              {registerIsLoading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LoginForm;
