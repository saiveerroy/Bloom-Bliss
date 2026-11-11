
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let productsLoaded = false;
    let ordersLoaded = false;

    const finishLoading = () => {
      if (productsLoaded && ordersLoaded) {
        setLoading(false);
      }
    };

    const unsubscribeProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        setProducts(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );

        productsLoaded = true;
        finishLoading();
      },
      (err) => {
        console.error("Products error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    const unsubscribeOrders = onSnapshot(
      query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        setOrders(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );

        ordersLoaded = true;
        finishLoading();
      },
      (err) => {
        console.error("Orders error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  // ADD PRODUCT
  const addProduct = async (product) => {
    const docRef = await addDoc(
      collection(db, "products"),
      {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        createdAt: serverTimestamp(),
      }
    );

    return docRef.id;
  };

  // EDIT PRODUCT
  const editProduct = async (id, updatedProduct) => {
    await updateDoc(
      doc(db, "products", String(id)),
      {
        ...updatedProduct,
        price: Number(updatedProduct.price),
        stock: Number(updatedProduct.stock),
        updatedAt: serverTimestamp(),
      }
    );
  };

  // UPDATE STOCK
  const updateStock = async (id, quantity) => {
    const stock = Number(quantity);

    if (!Number.isInteger(stock) || stock < 0) {
      return false;
    }

    await updateDoc(
      doc(db, "products", String(id)),
      { stock }
    );

    return true;
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    await deleteDoc(
      doc(db, "products", String(id))
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        orders,
        loading,
        error,
        addProduct,
        editProduct,
        updateStock,
        deleteProduct,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error(
      "useInventory must be used inside InventoryProvider"
    );
  }

  return context;
}
