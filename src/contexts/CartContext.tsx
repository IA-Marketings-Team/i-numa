
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  offreId: string;
  quantity: number;
  nom?: string;
  description?: string;
  type?: string;
  prix?: number;
  title?: string;
  category?: string;
  price?: string;
  setupFee?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  getCartTotal: () => number;
  cartCount: number;
  isInCart: (offreId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        setCartCount(parsedCart.length);
      } catch (error) {
        console.error("Error parsing saved cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.offreId === item.offreId);
    
    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += item.quantity;
      setCart(updatedCart);
    } else {
      // Add new item to cart with a unique ID
      setCart([...cart, { ...item, id: crypto.randomUUID() }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(
      cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Handle both price formats (number and string)
      if (item.prix) {
        return total + item.prix * item.quantity;
      } else if (item.price) {
        // Extract the number from a string like "39€/mois"
        const priceNumber = parseFloat(item.price.replace(/[^\d.,]/g, ''));
        return total + priceNumber * item.quantity;
      }
      return total;
    }, 0);
  };

  const isInCart = (offreId: string) => {
    return cart.some(item => item.offreId === offreId);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        updateQuantity, 
        getCartTotal, 
        cartCount,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
