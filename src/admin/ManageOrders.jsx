
import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";

export default function ManageOrders() {
  const { orders, updateOrderStatus } = useInventory();

  const [updating, setUpdating] = useState("");
  const [error, setError] = useState("");

  const statuses = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  function formatDate(date) {
    if (!date) return "Date unavailable";

    const value = date.toDate
      ? date.toDate()
      : new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "Date unavailable";
    }

    return value.toLocaleString("en-IN");
  }

  function formatStatus(status) {
    return (status || "pending")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  async function handleStatusChange(orderId, status) {
    setError("");
    setUpdating(orderId);

    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
      console.error("Order status update error:", err);
      setError(
        err.message || "Unable to update order status."
      );
    } finally {
      setUpdating("");
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] p-5 sm:p-8">

      <h1 className="text-3xl font-bold">
        Customer Orders 📦
      </h1>

      <p className="mb-8 mt-2 text-sm text-gray-500">
        View customer details and manage flower orders.
      </p>

      <div className="mb-6 rounded-xl border bg-white p-5">
        <p className="text-sm text-gray-500">
          Total Orders
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {orders.length}
        </h2>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-5xl">📦</p>

          <h2 className="mt-4 text-xl font-bold">
            No Orders Yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Customer orders will appear here after checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => {
            const customer = order.shippingAddress || {};

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-[#eee3dc] bg-white p-5 shadow-sm sm:p-7"
              >

                {/* ORDER HEADER */}

                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">

                  <div>
                    <h2 className="text-lg font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-pink-100 px-4 py-2 text-xs font-semibold text-pink-700">
                    {formatStatus(order.status)}
                  </span>

                </div>

                {/* CUSTOMER DETAILS */}

                <div className="mt-5">
                  <h3 className="mb-3 font-bold">
                    Customer Details 👤
                  </h3>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">

                    <p>
                      <strong>Name:</strong>{" "}
                      {customer.name || order.customerName || "Not provided"}
                    </p>

                    <p>
                      <strong>Mobile:</strong>{" "}
                      {customer.phone || "Not provided"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {customer.email || order.customerEmail || "Not provided"}
                    </p>

                    <p>
                      <strong>Pincode:</strong>{" "}
                      {customer.pincode || "Not provided"}
                    </p>

                    <p className="sm:col-span-2">
                      <strong>Delivery Address:</strong>{" "}
                      {customer.address || "Not provided"}
                    </p>

                  </div>
                </div>

                {/* PRODUCTS */}

                <div className="mt-6 border-t pt-5">

                  <h3 className="mb-4 font-bold">
                    Ordered Products 🌷
                  </h3>

                  <div className="space-y-3">

                    {(order.items || []).map((item, index) => (
                      <div
                        key={item.productId || index}
                        className="flex items-center justify-between gap-3 rounded-lg bg-[#fffaf7] p-3 text-sm"
                      >

                        <div className="flex items-center gap-3">

                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-14 rounded-lg object-cover"
                            />
                          )}

                          <div>
                            <p className="font-semibold">
                              {item.name}
                            </p>

                            <p className="text-gray-500">
                              Quantity: {item.quantity}
                            </p>

                            <p className="text-gray-500">
                              ₹{Number(item.price).toLocaleString("en-IN")} each
                            </p>
                          </div>

                        </div>

                        <p className="font-semibold">
                          ₹{(
                            Number(item.price) * Number(item.quantity)
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>
                    ))}

                  </div>
                </div>

                {/* TOTAL */}

                <div className="mt-5 flex justify-between border-t pt-5">

                  <span className="font-bold">
                    Total Amount
                  </span>

                  <span className="text-lg font-bold text-[#536b50]">
                    ₹{Number(order.total || 0).toLocaleString("en-IN")}
                  </span>

                </div>

                {/* UPDATE STATUS */}

                <div className="mt-6">

                  <label className="mb-2 block text-sm font-semibold">
                    Update Order Status
                  </label>

                  <select
                    value={order.status || "pending"}
                    disabled={updating === order.id}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm disabled:opacity-50 sm:max-w-xs"
                  >

                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}

                  </select>

                  {updating === order.id && (
                    <p className="mt-2 text-xs text-gray-500">
                      Updating order status...
                    </p>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
