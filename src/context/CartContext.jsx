
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product, products) {
    const currentProduct = products.find(
      (p) => p.id === product.id
    );

    if (!currentProduct) {
      alert("Product not found.");
      return;
    }

    const existing = cart.find(
      (item) => item.id === product.id
    );

    const currentQuantity = existing
      ? existing.quantity
      : 0;

    if (currentQuantity >= currentProduct.stock) {
      alert("Sorry, no more stock available.");
      return;
    }

    setCart((previous) => {
      const found = previous.find(
        (item) => item.id === product.id
      );

      if (found) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart }}
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
