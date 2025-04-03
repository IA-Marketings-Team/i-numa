
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Créer un compte</h1>
        <p className="text-center text-gray-600 mb-2">
          Rejoignez-nous et gérez votre business efficacement
        </p>
        <p className="text-center text-sm text-gray-500">
          Après votre inscription, vous serez guidé à travers un processus simple pour personnaliser votre expérience et prendre un rendez-vous avec l'un de nos experts
        </p>
      </div>
      
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
