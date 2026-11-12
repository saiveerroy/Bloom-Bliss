
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

    if (!user) {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        setCart(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error("Guest cart loading error:", error);
        setCart([]);
      }

      setCartLoading(false);
      return;
    }

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
        console.error("Firestore cart loading error:", error);
        setCartLoading(false);
      }
    );

    return unsubscribe;
  }, [user, authLoading]);

  // SAVE GUEST CART
  useEffect(() => {
    if (authLoading || user) return;

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart, user, authLoading]);

  // ADD TO CART
  async function addToCart(product, products) {
    const currentProduct = products.find(
      (p) => String(p.id) === String(product.id)
    );

    if (!currentProduct) {
      alert("Product not found.");
      return;
    }

    const existing = cart.find(
      (item) => String(item.id) === String(product.id)
    );

    const quantity = existing ? Number(existing.quantity) : 0;

    if (quantity >= Number(currentProduct.stock)) {
      alert("Sorry, no more stock available.");
      return;
    }

    const updatedItem = {
      id: String(product.id),
      name: currentProduct.name,
      image: currentProduct.image || "",
      price: Number(currentProduct.price),
      quantity: quantity + 1,
    };

    try {
      if (user) {
        await setDoc(
          doc(db, "customers", user.uid, "cartItems", String(product.id)),
          updatedItem
        );
      } else {
        setCart((previous) => {
          const found = previous.find(
            (item) => String(item.id) === String(product.id)
          );

          return found
            ? previous.map((item) =>
                String(item.id) === String(product.id)
                  ? updatedItem
                  : item
              )
            : [...previous, updatedItem];
        });
      }
    } catch (error) {
      console.error("Add cart error:", error);
      alert("Unable to add product.");
    }
  }

  // INCREASE QUANTITY
  async function increaseQuantity(id, products) {
    const item = cart.find(
      (p) => String(p.id) === String(id)
    );

    if (!item) return;

    const product = products.find(
      (p) => String(p.id) === String(id)
    );

    if (!product) {
      alert("Product not found.");
      return;
    }

    if (Number(item.quantity) >= Number(product.stock)) {
      alert("Sorry, no more stock available.");
      return;
    }

    const updatedItem = {
      ...item,
      quantity: Number(item.quantity) + 1,
    };

    try {
      if (user) {
        await setDoc(
          doc(db, "customers", user.uid, "cartItems", String(id)),
          updatedItem
        );
      } else {
        setCart((previous) =>
          previous.map((p) =>
            String(p.id) === String(id) ? updatedItem : p
          )
        );
      }
    } catch (error) {
      console.error("Increase quantity error:", error);
      alert("Unable to increase quantity.");
    }
  }

  // DECREASE QUANTITY
  async function decreaseQuantity(id) {
    const item = cart.find(
      (p) => String(p.id) === String(id)
    );

    if (!item) return;

    if (Number(item.quantity) <= 1) {
      await removeFromCart(id);
      return;
    }

    const updatedItem = {
      ...item,
      quantity: Number(item.quantity) - 1,
    };

    try {
      if (user) {
        await setDoc(
          doc(db, "customers", user.uid, "cartItems", String(id)),
          updatedItem
        );
      } else {
        setCart((previous) =>
          previous.map((p) =>
            String(p.id) === String(id) ? updatedItem : p
          )
        );
      }
    } catch (error) {
      console.error("Decrease quantity error:", error);
      alert("Unable to decrease quantity.");
    }
  }

  // REMOVE FROM CART
  async function removeFromCart(id) {
    try {
      if (user) {
        await deleteDoc(
          doc(db, "customers", user.uid, "cartItems", String(id))
        );
      } else {
        setCart((previous) =>
          previous.filter(
            (item) => String(item.id) !== String(id)
          )
        );
      }
    } catch (error) {
      console.error("Remove cart error:", error);
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
              doc(db, "customers", user.uid, "cartItems", String(item.id))
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
        increaseQuantity,
        decreaseQuantity,
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
