
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "bloom_bliss_cart";

export function CartProvider({ children }) {
  // Load previously saved cart
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Unable to load cart:", error);
      return [];
    }
  });

  // Save cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cart]);

  // ADD TO CART
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

    if (currentQuantity >= Number(currentProduct.stock)) {
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
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previous,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  // REMOVE FROM CART
  function removeFromCart(id) {
    setCart((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  // CLEAR CART
  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
