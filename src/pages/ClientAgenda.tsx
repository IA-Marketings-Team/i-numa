
import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import RendezVousBookingForm from '@/components/rendezVous/RendezVousBookingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ClientAgenda = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    setHasItems(cart.length > 0);
  }, [cart]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Agenda</h1>
      
      {hasItems ? (
        <div className="max-w-4xl mx-auto">
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <AlertTitle>Prenez rendez-vous</AlertTitle>
            <AlertDescription>
              Veuillez choisir une date et une heure pour discuter de votre offre avec un de nos experts.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RendezVousBookingForm />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Votre panier</CardTitle>
                  <CardDescription>
                    Articles dans votre panier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cart.map((item) => (
                      <li key={item.id} className="border-b pb-2">
                        <div className="font-medium">{item.title || item.nom}</div>
                        <div className="text-sm text-muted-foreground">{item.price}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center py-12">
          <Alert className="bg-yellow-50 border-yellow-200">
            <CheckCircle2 className="h-5 w-5 text-yellow-500" />
            <AlertTitle>Aucun article dans le panier</AlertTitle>
            <AlertDescription>
              Veuillez d'abord ajouter des offres à votre panier depuis la marketplace avant de prendre rendez-vous.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ClientAgenda;
