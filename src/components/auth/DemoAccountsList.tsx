
import React from "react";

interface DemoAccount {
  email: string;
  role: string;
}

interface DemoAccountsListProps {
  accounts: DemoAccount[];
  onSelectAccount: (email: string) => void;
  isLoading: boolean;
}

const DemoAccountsList: React.FC<DemoAccountsListProps> = ({ 
  accounts, 
  onSelectAccount, 
  isLoading 
}) => {
  return (
    <div className="mt-4 text-sm bg-muted p-3 rounded-md">
      <p className="font-medium mb-2">Comptes de démonstration disponibles:</p>
      <div className="grid gap-1">
        {accounts.map((account) => (
          <button 
            key={account.email} 
            type="button"
            onClick={() => onSelectAccount(account.email)}
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
  );
};

export default DemoAccountsList;
