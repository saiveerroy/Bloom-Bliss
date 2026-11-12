
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export default function Profile() {
  const { user, customer, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelling, setCancelling] = useState("");

  // FETCH CUSTOMER ORDERS
  
useEffect(() => {
    if (!user) {
        setOrders([]);
        setLoadingOrders(false);
        return;
    }

  async function fetchOrders() {
    setLoadingOrders(true);
    setError("");

    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(ordersQuery);

      const orderList = snapshot.docs.map((orderDoc) => ({
        id: orderDoc.id,
        ...orderDoc.data(),
      }));

      orderList.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.()?.getTime() || 0;
        const dateB = b.createdAt?.toDate?.()?.getTime() || 0;
        return dateB - dateA;
      });

      setOrders(orderList);
    } catch (err) {
      console.error("Order loading error:", err);
      setError("Unable to load your orders. Please try again.");
    } finally {
      setLoadingOrders(false);
    }
  }

  fetchOrders();
}, [user]);

  // FORMAT DATE
  function formatDate(date) {
    if (!date) return "Date unavailable";

    const value = date.toDate
      ? date.toDate()
      : new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "Date unavailable";
    }

    return value.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // ORDER STATUS COLORS
  function statusColor(status) {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return colors[(status || "pending").toLowerCase()] ||
      "bg-gray-100 text-gray-700";
  }

  // CANCEL ORDER
  async function cancelOrder(order) {
    if (order.status?.toLowerCase() !== "pending") {
      alert("Only pending orders can be cancelled.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    setCancelling(order.id);

    try {
      await updateDoc(doc(db, "orders", order.id), {
        status: "cancelled",
        cancelledAt: serverTimestamp(),
      });

      setOrders((previous) =>
        previous.map((item) =>
          item.id === order.id
            ? { ...item, status: "cancelled" }
            : item
        )
      );

      setSelectedOrder((previous) =>
        previous?.id === order.id
          ? { ...previous, status: "cancelled" }
          : previous
      );

      alert("Your order has been cancelled.");
    } catch (err) {
      console.error("Cancellation error:", err);
      alert("Unable to cancel your order. Please contact support.");
    } finally {
      setCancelling("");
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fffaf7] p-10 text-center">
        <h2 className="font-serif text-2xl">
          Please login to view your profile.
        </h2>

        <button
          onClick={() => navigate("/login")}
          className="mt-5 bg-[#536b50] px-6 py-3 text-white"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] px-4 py-10">

      <div className="mx-auto max-w-4xl">

        {/* PROFILE CARD */}
        <div className="rounded-2xl bg-white p-8 shadow">

          <div className="text-center text-5xl">👤</div>

          <h1 className="mt-4 text-center font-serif text-3xl">
            My Profile
          </h1>

          <div className="mx-auto mt-8 max-w-md space-y-4">
            <p>
              <strong>Name:</strong>{" "}
              {customer?.name || user.displayName || "Customer"}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-lg bg-[#536b50] py-3 text-white hover:bg-[#3e543b]"
          >
            Logout
          </button>

          <button
            onClick={() => navigate("/")}
            className="mt-3 w-full rounded-lg border border-[#536b50] py-3 text-[#536b50]"
          >
            Continue Shopping
          </button>
        </div>

        {/* MY ORDERS */}
        <div className="mt-10">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-3xl">
              My Orders 🌷
            </h2>

            <span className="rounded-full bg-[#f3e8e3] px-4 py-2 text-sm">
              {orders.length} Orders
            </span>
          </div>

          {loadingOrders ? (
            <div className="rounded-xl bg-white p-10 text-center">
              Loading your orders...
            </div>
          ) : error ? (
            <div className="rounded-xl bg-white p-8 text-center text-red-600">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">💐</div>

              <h3 className="mt-4 font-serif text-2xl">
                No Orders Yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Your beautiful flower orders will appear here.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-6 bg-[#536b50] px-6 py-3 text-white"
              >
                Shop Flowers
              </button>
            </div>
          ) : (
            <div className="space-y-5">

              {orders.map((order) => (

                <div
                  key={order.id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm"
                >

                  <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5">

                    <div>
                      <p className="text-xs text-gray-500">
                        ORDER ID
                      </p>

                      <p className="mt-1 font-semibold">
                        #{order.id}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`rounded-full px-3 py-2 text-xs font-semibold ${statusColor(order.status)}`}
                      >
                        {order.status || "Pending"}
                      </span>

                      <p className="mt-3 font-semibold">
                        ₹{Number(order.total || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                  </div>

                  <div className="p-5">

                    <p className="mb-4 text-sm text-gray-600">
                      {order.items?.length || 0} different products
                    </p>

                    <div className="flex flex-wrap gap-3">

                      <button
                        onClick={() =>
                          setSelectedOrder(
                            selectedOrder?.id === order.id
                              ? null
                              : order
                          )
                        }
                        className="rounded-lg border border-[#536b50] px-4 py-2 text-sm text-[#536b50]"
                      >
                        {selectedOrder?.id === order.id
                          ? "Hide Details"
                          : "View Details"}
                      </button>

                      {order.status?.toLowerCase() === "pending" && (
                        <button
                          disabled={cancelling === order.id}
                          onClick={() => cancelOrder(order)}
                          className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 disabled:opacity-50"
                        >
                          {cancelling === order.id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}

                    </div>

                    {/* EXPANDED ORDER DETAILS */}
                    {selectedOrder?.id === order.id && (

                      <div className="mt-6 border-t pt-5">

                        <h3 className="mb-4 font-serif text-xl">
                          Order Details
                        </h3>

                        <div className="space-y-4">

                          {(order.items || []).map((item, index) => (

                            <div
                              key={item.id || index}
                              className="flex items-center gap-4 border-b pb-4"
                            >

                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-20 w-16 rounded-lg object-cover"
                              />

                              <div className="flex-1">
                                <p className="font-medium">
                                  {item.name}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  Quantity: {item.quantity}
                                </p>

                                <p className="mt-1 text-sm">
                                  ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                </p>
                              </div>

                            </div>
                          ))}

                        </div>

                        <div className="mt-5 space-y-3 text-sm">

                          <p>
                            <strong>Payment:</strong>{" "}
                            {order.paymentMethod || "Not specified"}
                          </p>

                          <p>
                            <strong>Delivery Address:</strong>
                          </p>

                          <p className="text-gray-600">
                            {typeof order.shippingAddress === "string"
                              ? order.shippingAddress
                              : order.shippingAddress
                                ? [
                                    order.shippingAddress.name,
                                    order.shippingAddress.phone,
                                    order.shippingAddress.address,
                                    order.shippingAddress.city,
                                    order.shippingAddress.state,
                                    order.shippingAddress.pincode,
                                  ].filter(Boolean).join(", ")
                                : "Address unavailable"}
                          </p>

                          <p>
                            <strong>Order Total:</strong>{" "}
                            ₹{Number(order.total || 0).toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
