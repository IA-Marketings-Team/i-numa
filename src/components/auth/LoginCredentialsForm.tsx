
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { isDemoAccount } from "@/contexts/auth/demoUserHandling";

interface LoginCredentialsFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginCredentialsForm: React.FC<LoginCredentialsFormProps> = ({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={onEmailChange}
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
          onChange={onPasswordChange}
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
    </div>
  );
};

export default LoginCredentialsForm;
