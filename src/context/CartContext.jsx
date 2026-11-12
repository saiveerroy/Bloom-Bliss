
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "bloom_bliss_cart";

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  // LOAD CART
  useEffect(() => {
    if (authLoading) return;

    setCartLoading(true);

    // Guest cart: use localStorage
    if (!user) {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        setCart(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error("Cart loading error:", error);
        setCart([]);
      }

      setCartLoading(false);
      return;
    }

    // Logged-in customer: use Firestore
    const cartRef = collection(
      db,
      "customers",
      user.uid,
      "cartItems"
    );

    const unsubscribe = onSnapshot(
      cartRef,
      (snapshot) => {
        const items = snapshot.docs.map((item) => ({
          ...item.data(),
          id: item.id,
        }));

        setCart(items);
        setCartLoading(false);
      },
      (error) => {
        console.error("Firestore cart error:", error);
        setCartLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  // SAVE GUEST CART
  useEffect(() => {
    if (authLoading || user) return;

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Cart saving error:", error);
    }
  }, [cart, user, authLoading]);

  // ADD TO CART
  async function addToCart(product, products) {
    const currentProduct = products.find(
      (item) => item.id === product.id
    );

    if (!currentProduct) {
      alert("Product not found.");
      return;
    }

    const existing = cart.find(
      (item) => item.id === product.id
    );

    const quantity = existing
      ? existing.quantity
      : 0;

    if (quantity >= Number(currentProduct.stock)) {
      alert("Sorry, no more stock available.");
      return;
    }

    const updatedItem = {
      id: product.id,
      name: currentProduct.name,
      image: currentProduct.image || "",
      price: Number(currentProduct.price),
      quantity: quantity + 1,
    };

    try {
      if (user) {
        await setDoc(
          doc(db, "customers", user.uid, "cartItems", product.id),
          updatedItem
        );
      } else {
        setCart((previous) => {
          const found = previous.find(
            (item) => item.id === product.id
          );

          if (found) {
            return previous.map((item) =>
              item.id === product.id
                ? updatedItem
                : item
            );
          }

          return [...previous, updatedItem];
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Unable to add product to cart.");
    }
  }

  // REMOVE FROM CART
  async function removeFromCart(id) {
    try {
      if (user) {
        await deleteDoc(
          doc(db, "customers", user.uid, "cartItems", id)
        );
      } else {
        setCart((previous) =>
          previous.filter((item) => item.id !== id)
        );
      }
    } catch (error) {
      console.error("Remove cart item error:", error);
      alert("Unable to remove product.");
    }
  }

  // CLEAR CART
  async function clearCart() {
    try {
      if (user) {
        await Promise.all(
          cart.map((item) =>
            deleteDoc(
              doc(db, "customers", user.uid, "cartItems", item.id)
            )
          )
        );
      } else {
        setCart([]);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Clear cart error:", error);
      alert("Unable to clear cart.");
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
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
