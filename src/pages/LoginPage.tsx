
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Users, Building, BarChart, Globe, RefreshCw } from "lucide-react";

const slides = [
  {
    title: "Gérez vos clients",
    description: "Suivez et gérez efficacement vos interactions avec vos clients",
    icon: <Users className="h-12 w-12 text-white" />,
    bgColor: "from-blue-600 to-indigo-700"
  },
  {
    title: "Développez votre entreprise",
    description: "Utilisez nos outils pour développer votre activité",
    icon: <Building className="h-12 w-12 text-white" />,
    bgColor: "from-purple-600 to-indigo-700"
  },
  {
    title: "Analysez vos performances",
    description: "Visualisez et comprenez vos données commerciales",
    icon: <BarChart className="h-12 w-12 text-white" />,
    bgColor: "from-green-600 to-teal-700"
  },
  {
    title: "Étendez votre visibilité",
    description: "Augmentez votre présence en ligne et attirez plus de clients",
    icon: <Globe className="h-12 w-12 text-white" />,
    bgColor: "from-orange-500 to-pink-600"
  }
];

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Changement de slide automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Obtenir la destination prévue depuis l'état de l'emplacement, ou par défaut au tableau de bord
  const from = location.state?.from || "/tableau-de-bord";
  
  // Vérifier les messages provenant d'autres pages
  useEffect(() => {
    if (location.state?.message) {
      toast({
        description: location.state.message
      });
      
      // Effacer le message après l'avoir affiché
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, toast, navigate]);

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from);
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Partie gauche: Slider */}
      <div className="hidden md:flex md:flex-col md:w-1/2 relative overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center p-10 transition-opacity duration-1000 bg-gradient-to-br ${slide.bgColor} ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="bg-white/20 p-6 rounded-full mb-6">
              {slide.icon}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{slide.title}</h2>
            <p className="text-white/90 text-center max-w-md">{slide.description}</p>
            
            <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2">
              {slides.map((_, idx) => (
                <button 
                  key={idx} 
                  className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Partie droite: Formulaire de connexion */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-5">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
