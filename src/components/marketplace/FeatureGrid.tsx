
import React from 'react';
import {
  Building,
  MessageCircle,
  Star,
  Globe,
  ThumbsUp,
  Gauge,
  Gift,
  Cloud,
  TrendingUp,
  CandlestickChart,
  TrendingDown
} from 'lucide-react';

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    {icon}
    <p className="text-center text-sm" dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

const FeatureGrid: React.FC = () => {
  const features = [
    { icon: <Building className="h-8 w-8 mb-2 text-indigo-500" />, text: "Générez des <strong>visites en magasin</strong>" },
    { icon: <MessageCircle className="h-8 w-8 mb-2 text-indigo-500" />, text: "Animez/créez votre <strong>communauté</strong>" },
    { icon: <Star className="h-8 w-8 mb-2 text-indigo-500" />, text: "Valorisez <strong>votre expertise</strong>" },
    { icon: <Globe className="h-8 w-8 mb-2 text-indigo-500" />, text: "Augmentez votre <strong>visibilité / notoriété</strong>" },
    { icon: <ThumbsUp className="h-8 w-8 mb-2 text-indigo-500" />, text: "Générez des <strong>avis positifs</strong>" },
    { icon: <Gauge className="h-8 w-8 mb-2 text-indigo-500" />, text: "Gagnez en <strong>efficacité</strong>" },
    { icon: <Gift className="h-8 w-8 mb-2 text-indigo-500" />, text: "<strong>Fidélisez</strong> vos clients" },
    { icon: <Cloud className="h-8 w-8 mb-2 text-indigo-500" />, text: "Exploitez vos <strong>données clients</strong>" },
    { icon: <TrendingUp className="h-8 w-8 mb-2 text-indigo-500" />, text: "<strong>Développez</strong> votre activité" },
    { icon: <CandlestickChart className="h-8 w-8 mb-2 text-indigo-500" />, text: "<strong>Pilotez</strong> votre activité" },
    { icon: <TrendingDown className="h-8 w-8 mb-2 text-indigo-500" />, text: "<strong>Diminuez</strong> vos coûts" }
  ];

  return (
    <div className="mb-10 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Nos offres vous permettent de...
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {features.map((feature, index) => (
          <FeatureItem key={index} icon={feature.icon} text={feature.text} />
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
