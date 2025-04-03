
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const { success, error } = await register(
        {
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          role: "client", // Default role for registered users
        },
        formData.password
      );

      if (success) {
        navigate("/login", { state: { message: "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte." } });
      } else {
        setError(error?.message || "L'inscription a échoué. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
      console.error("Erreur d'inscription:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>Remplissez vos informations pour créer un nouveau compte</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Création du compte..." : "Créer un compte"}
        </Button>
        <div className="text-center text-sm">
          Vous avez déjà un compte ?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Se connecter
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
