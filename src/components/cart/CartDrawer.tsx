
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
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  children?: React.ReactNode;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ children }) => {
  const { cartItems, removeFromCart, clearCart, updateQuantity, getCartCount } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/contrat-acceptation");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {getCartCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                {getCartCount()}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Votre panier</SheetTitle>
          <SheetDescription>
            {cartItems.length === 0
              ? "Votre panier est vide"
              : `${cartItems.length} type(s) d'articles dans votre panier`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
              <p>Votre panier est vide</p>
              <p className="text-sm">Ajoutez des offres pour les voir apparaître ici</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">{item.price}</p>
                    {item.setupFee && (
                      <p className="text-xs text-muted-foreground">
                        {item.setupFee}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center mt-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-3 font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            <Separator />
            <SheetFooter className="mt-4 flex-col sm:flex-row sm:justify-between gap-3">
              <Button variant="outline" className="sm:w-auto w-full" onClick={clearCart}>
                Vider le panier
              </Button>
              <Button className="sm:w-auto w-full" onClick={handleCheckout}>
                Confirmer l'achat
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
