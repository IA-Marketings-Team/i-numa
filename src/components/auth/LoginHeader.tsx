
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const LoginHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle>Connexion</CardTitle>
      <CardDescription>
        Entrez vos identifiants pour accéder à votre compte
      </CardDescription>
    </CardHeader>
  );
};

export default LoginHeader;
