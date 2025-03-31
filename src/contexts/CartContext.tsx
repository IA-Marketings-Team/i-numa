
import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity" | "id">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (item: Omit<CartItem, "quantity" | "id">) => {
    const id = `${item.category}-${item.title}`;
    const existingItem = cartItems.find((cartItem) => cartItem.id === id);

    if (existingItem) {
      updateQuantity(id, existingItem.quantity + 1);
      toast({
        title: "Quantité mise à jour",
        description: `${item.title} a été ajouté au panier (${existingItem.quantity + 1})`,
      });
    } else {
      setCartItems([...cartItems, { ...item, id, quantity: 1 }]);
      toast({
        title: "Article ajouté au panier",
        description: `${item.title} a été ajouté au panier`,
      });
    }
  };

  const removeFromCart = (id: string) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    if (itemToRemove) {
      setCartItems(cartItems.filter((item) => item.id !== id));
      toast({
        title: "Article retiré du panier",
        description: `${itemToRemove.title} a été retiré du panier`,
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Panier vidé",
      description: "Tous les articles ont été retirés du panier",
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    // Cette fonction est simplifiée car nous n'avons pas de prix numériques réels
    return cartItems.length;
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
