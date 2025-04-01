
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
  onDismiss: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription className="flex items-center justify-between">
        {error}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
