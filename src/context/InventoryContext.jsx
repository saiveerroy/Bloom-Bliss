
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LISTEN TO PRODUCTS
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const productList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setProducts(productList);
        setLoading(false);
        setError("");
      },
      (error) => {
        console.error("Products loading error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // LISTEN TO ORDERS
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const orderList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setOrders(orderList);
      },
      (error) => {
        console.error("Orders loading error:", error);
      }
    );

    return unsubscribe;
  }, []);

  // ADD PRODUCT
  const addProduct = async (product) => {
    return await addDoc(collection(db, "products"), {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      createdAt: serverTimestamp(),
    });
  };

  // EDIT PRODUCT
  const editProduct = async (id, updatedProduct) => {
    return await updateDoc(doc(db, "products", id), {
      ...updatedProduct,
      price: Number(updatedProduct.price),
      stock: Number(updatedProduct.stock),
    });
  };

  // UPDATE STOCK
  const updateStock = async (id, quantity) => {
    const stock = Number(quantity);

    if (!Number.isInteger(stock) || stock < 0) {
      return false;
    }

    await updateDoc(doc(db, "products", id), {
      stock,
    });

    return true;
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    return await deleteDoc(doc(db, "products", id));
  };

  // PLACE ORDER
  const placeOrder = async (cart, customer) => {
    if (!Array.isArray(cart) || cart.length === 0) {
      return {
        success: false,
        message: "Your cart is empty.",
      };
    }

    try {
      const quantities = new Map();

      for (const item of cart) {
        const id = String(item.productId);
        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error("Invalid product quantity.");
        }

        quantities.set(
          id,
          (quantities.get(id) || 0) + quantity
        );
      }

      const orderItems = [];

      const orderRef = doc(collection(db, "orders"));

      await runTransaction(db, async (transaction) => {
        const productRefs = [...quantities.keys()].map(
          (id) => doc(db, "products", id)
        );

        const snapshots = await Promise.all(
          productRefs.map((ref) => transaction.get(ref))
        );

        snapshots.forEach((snapshot, index) => {
          if (!snapshot.exists()) {
            throw new Error("A product could not be found.");
          }

          const product = snapshot.data();
          const quantity = quantities.get(snapshot.id);

          if (Number(product.stock) < quantity) {
            throw new Error(
              `Only ${product.stock} units of ${product.name} are available.`
            );
          }

          orderItems.push({
            productId: snapshot.id,
            name: product.name,
            image: product.image || "",
            price: Number(product.price),
            quantity,
          });

          transaction.update(productRefs[index], {
            stock: Number(product.stock) - quantity,
          });
        });

        const total = orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        transaction.set(orderRef, {
          userId: customer.uid,
          customerName: customer.name,
          customerEmail: customer.email,
          items: orderItems,
          total,
          status: "pending",
          paymentMethod: "Cash on Delivery",
          shippingAddress: {
            name: customer.name,
            phone: customer.mobile,
            email: customer.email,
            address: customer.address,
            pincode: customer.pincode,
          },
          createdAt: serverTimestamp(),
        });
      });

      return {
        success: true,
        message: "Order placed successfully!",
        orderId: orderRef.id,
      };

    } catch (error) {
      console.error("Order placement error:", error);

      return {
        success: false,
        message: error.message,
      };
    }
  };

  // UPDATE ORDER STATUS
  const updateOrderStatus = async (orderId, status) => {
    return await updateDoc(doc(db, "orders", orderId), {
      status,
      updatedAt: serverTimestamp(),
    });
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
        placeOrder,
        updateOrderStatus,
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
