
import React from "react";
import { useInventory } from "../context/InventoryContext";

export default function ManageOrders() {
  const { orders, updateOrderStatus } = useInventory();

  const statuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="min-h-screen bg-[#fffaf7] p-5 sm:p-8">

      <h1 className="text-3xl font-bold">
        Customer Orders 📦
      </h1>

      <p className="mb-8 mt-2 text-sm text-gray-500">
        View customer details and manage flower orders.
      </p>

      <div className="mb-6 rounded-xl border bg-white p-5">
        <p className="text-sm text-gray-500">Total Orders</p>
        <h2 className="mt-2 text-3xl font-bold">
          {orders.length}
        </h2>
      </div>

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

          {orders.slice().reverse().map((order) => {
            const customer = order.customer || {};

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-[#eee3dc] bg-white p-5 shadow-sm sm:p-7"
              >

                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h2 className="text-lg font-bold">
                      Order #{order.id}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN")
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span className="rounded-full bg-pink-100 px-4 py-2 text-xs font-semibold text-pink-700">
                    {order.status}
                  </span>
                </div>

                {/* Customer details */}
                <div className="mt-5">
                  <h3 className="mb-3 font-bold">
                    Customer Details 👤
                  </h3>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">

                    <p>
                      <strong>Name:</strong>{" "}
                      {customer.name || "Not provided"}
                    </p>

                    <p>
                      <strong>Mobile:</strong>{" "}
                      {customer.mobile || "Not provided"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {customer.email || "Not provided"}
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

                {/* Products */}
                <div className="mt-6 border-t pt-5">
                  <h3 className="mb-4 font-bold">
                    Ordered Products 🌷
                  </h3>

                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div
                        key={item.productId || index}
                        className="flex justify-between gap-3 rounded-lg bg-[#fffaf7] p-3 text-sm"
                      >
                        <div>
                          <p className="font-semibold">
                            {item.name}
                          </p>
                          <p className="text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">
                          ₹{(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="mt-5 flex justify-between border-t pt-5">
                  <span className="font-bold">
                    Total Amount
                  </span>

                  <span className="text-lg font-bold text-[#536b50]">
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Update status */}
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold">
                    Update Order Status
                  </label>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm sm:max-w-xs"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}
