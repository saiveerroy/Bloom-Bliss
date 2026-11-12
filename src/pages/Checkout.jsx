
import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";


export default function Checkout() {
  const { placeOrder } = useInventory();
  const { user, customer: authCustomer } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const {cart, clearCart, cartLoading,} = useCart();

  const [customer, setCustomer] = useState({
    name: authCustomer?.name || user?.displayName || "",
    mobile: "",
    email: user?.email || "",
    pincode: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleChange = (e) => {
    setCustomer((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/login", {
        state: {
          from: "/checkout",
          cart,
        },
      });
      return;
    }

    if (loading) return;

    if (cartLoading) {
      return <div className="p-10 text-center">Loading your cart...</div>;
    }

    if (cart.length === 0) {
      setError("Your shopping cart is empty.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(customer.mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^[1-9]\d{5}$/.test(customer.pincode)) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    if (!customer.name.trim() || !customer.address.trim()) {
      setError("Please complete your delivery details.");
      return;
    }

    setLoading(true);

    try {
      // STEP 1: Update inventory and validate stock
      const result = await placeOrder(
        cart.map((item) => ({
          productId: String(item.id),
          quantity: Number(item.quantity),
        })),
        {
          uid: user.uid,
          name: customer.name.trim(),
          email: customer.email.trim(),
          mobile: customer.mobile.trim(),
          pincode: customer.pincode.trim(),
          address: customer.address.trim(),
        }
      );

      if (!result.success) {
        throw new Error(result.message);
      }
      await clearCart();

      // Redirect after successful order placement
      navigate("/", {
        replace: true,
        state: {
          orderSuccess: {
            id: result.orderId,
          },
        },
      });

    } catch (err) {
      console.error("Order placement error:", err);

      setError(
        err.message || "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffaf7]">
        <h2 className="font-serif text-2xl">
          Please login to continue.
        </h2>

        <button
          onClick={() =>
            navigate("/login", {
              state: { from: "/checkout", cart },
            })
          }
          className="mt-5 bg-[#536b50] px-6 py-3 text-white"
        >
          Login
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffaf7]">
        <h2 className="font-serif text-2xl">
          Your shopping cart is empty
        </h2>

        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-[#536b50] px-6 py-3 text-white"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] px-5 py-12">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 text-sm text-[#536b50]"
        >
          ← Back to shopping
        </button>

        <h1 className="font-serif text-4xl text-[#536b50]">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Please enter your delivery details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">
            Customer Information
          </h2>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              name="name"
              value={customer.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg border p-3"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Mobile Number
            </label>

            <input
              name="mobile"
              type="tel"
              value={customer.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="w-full rounded-lg border p-3"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              name="email"
              type="email"
              value={customer.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              PIN Code
            </label>

            <input
              name="pincode"
              value={customer.pincode}
              onChange={handleChange}
              placeholder="6-digit PIN code"
              className="w-full rounded-lg border p-3"
              pattern="[1-9][0-9]{5}"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Complete Delivery Address
            </label>

            <textarea
              name="address"
              value={customer.address}
              onChange={handleChange}
              placeholder="House number, street, area, city and state"
              className="w-full rounded-lg border p-3"
              rows={4}
              maxLength={500}
              required
            />
          </div>

          <div className="rounded-xl bg-[#fff5f3] p-4">
            <h3 className="font-semibold">Order Summary</h3>

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-3 py-2 text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹{(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            ))}

            <div className="mt-3 flex justify-between border-t pt-3 font-bold">
              <span>Total</span>
              <span>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Payment Method: Cash on Delivery
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#536b50] py-4 text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#3e543b] disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

        </form>
      </div>
    </div>
  );
}
