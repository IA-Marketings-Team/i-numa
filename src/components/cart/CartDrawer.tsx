
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface CartDrawerProps {
  children?: React.ReactNode;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ children }) => {
  const { cart, removeFromCart, clearCart, updateQuantity, cartCount, getCartTotal } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toast({
      title: "Commande en cours",
      description: "Votre panier est en cours de traitement"
    });
    
    navigate("/contrat-acceptation");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-gray-200 dark:border-gray-800">
            <ShoppingCart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[20px] flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
                {cartCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-indigo-950 border-l border-gray-200 dark:border-gray-800">
        <SheetHeader className="border-b pb-4 mb-2 border-gray-200 dark:border-gray-800">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" /> 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Votre panier</span>
          </SheetTitle>
          <SheetDescription>
            {cart.length === 0
              ? "Votre panier est vide"
              : `${cart.length} type(s) d'articles dans votre panier`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
              <p>Votre panier est vide</p>
              <p className="text-sm">Ajoutez des offres pour les voir apparaître ici</p>
              <Button 
                variant="outline" 
                className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-gray-200 dark:border-gray-800"
                onClick={() => navigate("/marketplace")}
              >
                <Package className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Voir les offres
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{item.title || item.nom}</h3>
                          <Badge variant="outline" className="mt-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-gray-200 dark:border-gray-800">
                            {item.category || item.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {item.price || (item.prix && `${item.prix} €`)}
                        </p>
                        {item.setupFee && (
                          <p className="text-xs text-muted-foreground">
                            + {item.setupFee} (installation)
                          </p>
                        )}
                      </div>
                      <div className="flex items-center mt-3 justify-between">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {item.prix 
                              ? `${item.prix * item.quantity} €` 
                              : item.price 
                                ? `${parseFloat(item.price.replace(/[^\d.,]/g, '')) * item.quantity} €`
                                : '0 €'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <>
            <Separator className="bg-gray-200 dark:bg-gray-800" />
            <div className="py-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{getCartTotal()} €</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{getCartTotal()} €</span>
              </div>
            </div>
            <SheetFooter className="flex-col sm:flex-row sm:justify-between gap-3 border-t pt-4 border-gray-200 dark:border-gray-800">
              <Button 
                variant="outline" 
                className="sm:w-auto w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                onClick={clearCart}
              >
                Vider le panier
              </Button>
              <Button 
                className="sm:w-auto w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={handleCheckout}
              >
                Commander
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
