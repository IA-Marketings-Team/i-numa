
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">i-numa</Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">Accueil</Link>
            <Link to="/tarifs" className="text-gray-700 hover:text-primary transition-colors">Tarifs</Link>
            <Link to="/a-propos" className="text-gray-700 hover:text-primary transition-colors font-medium">À propos</Link>
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
            <h1 className="text-4xl font-bold mb-4">À propos de i-numa</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous révolutionnons la gestion de la relation client pour les professionnels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Notre histoire</h2>
              <p className="text-gray-600 mb-4">
                Fondée en 2020, i-numa est née d'une constatation simple : les professionnels passent trop de temps à gérer leurs tâches administratives et pas assez avec leurs clients.
              </p>
              <p className="text-gray-600 mb-4">
                Notre équipe d'experts en technologie et en relation client a conçu une solution complète permettant de centraliser toutes les interactions, d'automatiser les tâches répétitives et d'offrir une expérience client exceptionnelle.
              </p>
              <p className="text-gray-600">
                Aujourd'hui, i-numa accompagne des centaines de professionnels dans la gestion quotidienne de leur activité, leur permettant de se concentrer sur l'essentiel : la satisfaction de leurs clients.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <img 
                src="/placeholder.svg" 
                alt="Notre équipe" 
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Notre mission</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Simplifier</h3>
                <p className="text-gray-600">
                  Simplifier la gestion des relations clients pour tous les professionnels, quelle que soit la taille de leur entreprise.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><path d="m16 12-4 4-4-4"></path><path d="M12 8v8"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Optimiser</h3>
                <p className="text-gray-600">
                  Optimiser le temps et les ressources en automatisant les tâches administratives et en centralisant les informations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19.5 12c0-1.2 2.5-1.2 2.5 0"></path><path d="M19.5 5c0-1.2 2.5-1.2 2.5 0"></path><path d="M19.5 19c0-1.2 2.5-1.2 2.5 0"></path><path d="M2 19c0-1.2 2.5-1.2 2.5 0"></path><path d="M2 5c0-1.2 2.5-1.2 2.5 0"></path><path d="M2 12c0-1.2 2.5-1.2 2.5 0"></path><path d="M12 19c0-1.2 2.5-1.2 2.5 0"></path><path d="M12 5c0-1.2 2.5-1.2 2.5 0"></path><rect width="10" height="10" x="7" y="7" rx="2"></rect></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connecter</h3>
                <p className="text-gray-600">
                  Faciliter la communication entre les professionnels et leurs clients pour une relation plus fluide et personnalisée.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Notre équipe</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="text-center">
                  <div className="bg-gray-100 rounded-full w-40 h-40 mx-auto mb-4 overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Membre de l'équipe" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">Jean Dupont</h3>
                  <p className="text-gray-600">Co-fondateur & CEO</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-blue-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Rejoignez-nous dans cette aventure</h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              Découvrez comment i-numa peut transformer votre façon de gérer vos relations clients et booster votre activité.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/inscription">
                <Button>Commencer maintenant</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Nous contacter</Button>
              </Link>
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

export default AboutUsPage;
