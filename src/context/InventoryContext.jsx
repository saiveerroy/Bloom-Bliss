
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const InventoryContext = createContext(null);

const initialProducts = [
  {
    id: 1,
    name: "Blush Pink Roses",
    category: "Romantic Bouquets",
    price: 1299,
    stock: 10,
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Classic Red Roses",
    category: "Love & Romance",
    price: 1499,
    stock: 10,
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800",
    tag: "Popular",
  },
  {
    id: 3,
    name: "White Elegance",
    category: "Premium Collection",
    price: 1899,
    stock: 10,
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800",
    tag: "New",
  },
  {
    id: 4,
    name: "Sunshine Bouquet",
    category: "Birthday Flowers",
    price: 999,
    stock: 10,
    image: "https://images.unsplash.com/photo-1494972308805-463bc619d34b?w=800",
    tag: "Special",
  },
];

export function InventoryProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("bloom-inventory");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          Array.isArray(parsed.products) &&
          Array.isArray(parsed.orders)
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Inventory loading error:", error);
    }

    return {
      products: initialProducts,
      orders: [],
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "bloom-inventory",
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("Inventory saving error:", error);
      alert("Storage is full. Please use smaller product images.");
    }
  }, [data]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
    };

    setData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));
  };

  const editProduct = (id, updatedProduct) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id
          ? { ...product, ...updatedProduct, id }
          : product
      ),
    }));
  };

  const updateStock = (id, quantity) => {
    const stock = Number(quantity);

    if (!Number.isInteger(stock) || stock < 0) {
      return false;
    }

    setData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id
          ? { ...product, stock }
          : product
      ),
    }));

    return true;
  };

  const deleteProduct = (id) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter(
        (product) => product.id !== id
      ),
    }));
  };

  const placeOrder = (cart, customer) => {
    if (!Array.isArray(cart) || cart.length === 0) {
      return {
        success: false,
        message: "Your cart is empty.",
      };
    }

    const quantities = new Map();

    for (const item of cart) {
      const id = Number(item.productId);
      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(id) ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return {
          success: false,
          message: "Invalid product or quantity.",
        };
      }

      quantities.set(
        id,
        (quantities.get(id) || 0) + quantity
      );
    }

    // Validate every item before changing any stock.
    for (const [id, quantity] of quantities) {
      const product = data.products.find(
        (p) => p.id === id
      );

      if (!product) {
        return {
          success: false,
          message: "A product could not be found.",
        };
      }

      if (product.stock < quantity) {
        return {
          success: false,
          message: `Only ${product.stock} units of ${product.name} are available.`,
        };
      }
    }

    const updatedProducts = data.products.map((product) => {
      const quantity = quantities.get(product.id) || 0;

      return {
        ...product,
        stock: product.stock - quantity,
      };
    });

    const orderItems = [...quantities].map(
      ([id, quantity]) => {
        const product = data.products.find(
          (p) => p.id === id
        );

        return {
          productId: id,
          name: product.name,
          price: product.price,
          quantity,
        };
      }
    );

    const order = {
      id: "BB" + Date.now(),
      customer,
      items: orderItems,
      total: orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      products: updatedProducts,
      orders: [...prev.orders, order],
    }));

    return {
      success: true,
      message: "Order placed successfully!",
      order,
    };
  };

  const updateOrderStatus = (orderId, status) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((order) =>
        order.id === orderId
          ? { ...order, status }
          : order
      ),
    }));
  };

  return (
    <InventoryContext.Provider
      value={{
        products: data.products,
        orders: data.orders,
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
