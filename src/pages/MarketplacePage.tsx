
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      
      {/* Banner vidéo */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg overflow-hidden mb-8">
        <div className="max-w-6xl mx-auto px-4 py-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Découvrez i-mailX</h2>
              <p className="text-lg text-blue-100">
                La solution de cold-mailing révolutionnaire pour développer votre business
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate("/offres/email-x")}
                >
                  En savoir plus
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-blue-600"
                  onClick={() => navigate("/contact")}
                >
                  Demander une démo
                </Button>
              </div>
            </div>
            <div className="bg-blue-800 rounded-lg overflow-hidden shadow-xl">
              {/* Placez ici un lecteur vidéo (ou simplement une image pour le moment) */}
              <div className="aspect-video bg-blue-900 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-blue-300 mb-2">Vidéo promotionnelle</p>
                  <p className="text-white text-lg">Découvrez comment i-mailX peut transformer votre prospection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section des offres */}
      <h2 className="text-2xl font-bold mb-4">Nos offres</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>i-mailX</CardTitle>
            <CardDescription>Solution de cold-mailing avancée</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Automatisez vos campagnes d'emails avec notre solution optimisée pour un taux de délivrabilité maximal.</p>
            <Button className="w-full" onClick={() => navigate("/offres/email-x")}>
              Voir les détails
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>SEO Premium</CardTitle>
            <CardDescription>Optimisation pour les moteurs de recherche</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Améliorez votre positionnement dans les résultats de recherche et augmentez votre visibilité en ligne.</p>
            <Button className="w-full" onClick={() => navigate("/offres/seo")}>
              Voir les détails
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Google Ads Pro</CardTitle>
            <CardDescription>Campagnes publicitaires optimisées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Créez et gérez des campagnes publicitaires efficaces sur Google avec un ROI maximisé.</p>
            <Button className="w-full" onClick={() => navigate("/offres/google-ads")}>
              Voir les détails
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* CTA */}
      <Card className="bg-gray-50 border-none">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
          <div>
            <h3 className="text-xl font-bold">Besoin d'une solution personnalisée?</h3>
            <p className="text-gray-600">Nos experts sont disponibles pour étudier vos besoins spécifiques.</p>
          </div>
          <Button size="lg" onClick={() => navigate("/contact")}>
            Nous contacter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplacePage;
