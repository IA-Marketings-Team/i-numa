
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tableau-de-bord");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-2">i-numa</h1>
          <p className="text-gray-600">
            Plateforme de gestion de la relation client
          </p>
        </div>
        <LoginForm />
        <div className="mt-6 text-center">
          <Link to="/inscription" className="text-primary hover:underline">
            Vous n'avez pas de compte ? Inscrivez-vous ici
          </Link>
        </div>
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Pour les besoins de démonstration, vous pouvez toujours utiliser un des comptes suivants:
          </p>
          <ul className="mt-2 space-y-1 font-mono text-xs bg-gray-50 p-3 rounded border">
            <li>jean.dupont@example.com (client)</li>
            <li>thomas.leroy@example.com (agent_phoner)</li>
            <li>claire.moreau@example.com (agent_visio)</li>
            <li>ahmed.tayin@example.com (superviseur)</li>
            <li>marie.andy@example.com (responsable)</li>
          </ul>
          <p className="mt-2 text-gray-600">Le mot de passe peut être n'importe quoi pour ces comptes de démonstration.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
