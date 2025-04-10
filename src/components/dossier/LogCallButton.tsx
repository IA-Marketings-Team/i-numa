
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import LogCallModal, { CallData } from "./LogCallModal";

interface LogCallButtonProps {
  dossierId: string;
  onLogCall: (callData: CallData) => Promise<void>;
  disabled?: boolean;
}

const LogCallButton: React.FC<LogCallButtonProps> = ({
  dossierId,
  onLogCall,
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (callData: CallData) => {
    setIsLoading(true);
    try {
      await onLogCall(callData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error logging call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsModalOpen(true)}
        disabled={disabled || isLoading}
      >
        <PhoneCall className="h-4 w-4" />
        {isLoading ? "Enregistrement..." : "Enregistrer un appel"}
      </Button>

      <LogCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        dossierId={dossierId}
      />
    </>
  );
};

export default LogCallButton;
