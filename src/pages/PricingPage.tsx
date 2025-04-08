
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: "Essentiel",
      price: "29",
      description: "Parfait pour les indépendants et petites entreprises.",
      features: [
        "Jusqu'à 100 clients",
        "Agenda et rendez-vous",
        "Gestion des dossiers",
        "Support par email"
      ],
      highlighted: false
    },
    {
      name: "Professionnel",
      price: "79",
      description: "La solution idéale pour les PME en croissance.",
      features: [
        "Jusqu'à 1000 clients",
        "Agenda et rendez-vous",
        "Gestion des dossiers avancée",
        "Statistiques détaillées",
        "Marketplace d'offres",
        "Support prioritaire"
      ],
      highlighted: true
    },
    {
      name: "Entreprise",
      price: "199",
      description: "Pour les grandes structures avec des besoins spécifiques.",
      features: [
        "Clients illimités",
        "Toutes les fonctionnalités",
        "API complète",
        "Personnalisation avancée",
        "Intégrations ERP/CRM",
        "Support dédié 24/7"
      ],
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">i-numa</Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">Accueil</Link>
            <Link to="/tarifs" className="text-gray-700 hover:text-primary transition-colors font-medium">Tarifs</Link>
            <Link to="/a-propos" className="text-gray-700 hover:text-primary transition-colors">À propos</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">Contact</Link>
            <Link to="/connexion">
              <Button variant="outline">Connexion</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Des tarifs adaptés à vos besoins</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez l'offre qui correspond le mieux à votre activité et à votre budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg p-8 shadow-sm border ${plan.highlighted ? 'border-primary ring-4 ring-primary/10' : 'border-gray-200'}`}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="text-green-500 mr-2 flex-shrink-0" size={18} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    <Link to="/inscription">Choisir ce plan</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16 bg-gray-50 p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-center">Vous avez des besoins spécifiques ?</h2>
            <p className="text-center text-gray-600 mb-6">
              Nous proposons également des solutions sur mesure pour répondre parfaitement à vos exigences.
              Contactez-nous pour obtenir un devis personnalisé.
            </p>
            <div className="flex justify-center">
              <Link to="/contact">
                <Button variant="outline">Nous contacter</Button>
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Questions fréquentes</h2>
            <div className="max-w-3xl mx-auto grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Puis-je changer de plan à tout moment ?</h3>
                <p className="text-gray-600">
                  Oui, vous pouvez changer de plan à tout moment. La facturation sera ajustée au prorata du temps restant dans votre cycle de facturation.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Y a-t-il un engagement de durée ?</h3>
                <p className="text-gray-600">
                  Non, tous nos plans sont sans engagement. Vous pouvez annuler votre abonnement à tout moment.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Proposez-vous une période d'essai ?</h3>
                <p className="text-gray-600">
                  Oui, nous offrons une période d'essai de 14 jours pour tous nos plans, sans carte bancaire requise.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-2">Comment fonctionne le support ?</h3>
                <p className="text-gray-600">
                  Le support varie selon le plan choisi, allant du support par email pour le plan Essentiel au support dédié 24/7 pour le plan Entreprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">i-numa</h3>
              <p className="text-gray-300">
                La solution complète pour la gestion de vos relations clients.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white">Accueil</Link></li>
                <li><Link to="/tarifs" className="text-gray-300 hover:text-white">Tarifs</Link></li>
                <li><Link to="/a-propos" className="text-gray-300 hover:text-white">À propos</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-300">Email: contact@i-numa.fr</p>
              <p className="text-gray-300">Téléphone: +33 1 23 45 67 89</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} i-numa. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
