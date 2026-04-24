"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number; // variant id
  product_id?: number;
  variant_id?: number;
  product_code?: string;
  sku?: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  category_code?: string;
  size_label?: string | null;
  size_code?: string | null;
  color?: string | null;
  max_quantity?: number;
  quantity: number;
};

type AddToCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: AddToCartItem) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cartItems";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[];
        setCartItems(parsed);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: AddToCartItem) => {
    setCartItems((prev) => {
      const quantityToAdd = item.quantity ?? 1;
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        const maxQuantity = existing.max_quantity ?? item.max_quantity;
        const nextQuantity = existing.quantity + quantityToAdd;

        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity: maxQuantity
                  ? Math.min(nextQuantity, maxQuantity)
                  : nextQuantity,
              }
            : p
        );
      }

      const maxQuantity = item.max_quantity;
      const safeQuantity = maxQuantity
        ? Math.min(quantityToAdd, maxQuantity)
        : quantityToAdd;

      return [...prev, { ...item, quantity: safeQuantity }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const maxQuantity = item.max_quantity;

        return {
          ...item,
          quantity: maxQuantity
            ? Math.min(item.quantity + 1, maxQuantity)
            : item.quantity + 1,
        };
      })
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}