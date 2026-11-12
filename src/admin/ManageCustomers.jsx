
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

import { auth, db, adminAuth, adminDb } from "../firebase";

export default function ManageCustomers() {

    console.log("Customer DB:", db.app.options.projectId);
    console.log("Admin DB:", adminDb.app.options.projectId);

    console.log("Normal Auth UID:", auth.currentUser?.uid);
    console.log("Admin Auth UID:", adminAuth.currentUser?.uid);

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let customersLoaded = false;
    let ordersLoaded = false;

    const checkLoading = () => {
      if (customersLoaded && ordersLoaded) {
        setLoading(false);
      }
    };

    const unsubscribeCustomers = onSnapshot(
      collection(adminDb, "customers"),
      (snapshot) => {
        setCustomers(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );

        customersLoaded = true;
        checkLoading();
      },
      (err) => {
        console.error("Customers loading error:", err);
        setError("Unable to load customers.");
        setLoading(false);
      }
    );

    const unsubscribeOrders = onSnapshot(
      query(collection(adminDb, "orders")),
      (snapshot) => {
        setOrders(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );

        ordersLoaded = true;
        checkLoading();
      },
      (err) => {
        console.error("Orders loading error:", err);
        setError("Unable to load customer orders.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribeCustomers();
      unsubscribeOrders();
    };
  }, []);

  function formatDate(date) {
    if (!date) return "Unavailable";

    const value = date.toDate
      ? date.toDate()
      : new Date(date);

    return Number.isNaN(value.getTime())
      ? "Unavailable"
      : value.toLocaleDateString("en-IN");
  }

  const getCustomerOrders = (uid) =>
    orders.filter((order) => order.userId === uid);

  const getTotalSpent = (uid) =>
    getCustomerOrders(uid)
      .filter((order) => order.status !== "cancelled")
      .reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
      );

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] p-5 sm:p-8">

      <h1 className="text-3xl font-bold">
        Manage Customers 👥
      </h1>

      <p className="mb-8 mt-2 text-sm text-gray-500">
        View registered customers and their shopping activity.
      </p>

      {error && (
        <p className="mb-5 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </p>
      )}

      <div className="mb-6 grid gap-5 sm:grid-cols-2">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Customers
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#536b50]">
            {customers.length}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#536b50]">
            {orders.length}
          </h2>
        </div>

      </div>

      {customers.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center">
          No registered customers found.
        </div>
      ) : (
        <div className="space-y-5">

          {customers.map((customer) => {
            const customerOrders = getCustomerOrders(
              customer.uid || customer.id
            );

            return (
              <div
                key={customer.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >

                <div className="flex flex-wrap items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-2xl">
                    👤
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-bold">
                      {customer.name || "Customer"}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {customer.email || "No email"}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-4 py-2 text-xs text-green-700">
                    Registered
                  </span>

                </div>

                <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3">

                  <div>
                    <p className="text-xs text-gray-500">
                      Registered On
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatDate(customer.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Total Orders
                    </p>

                    <p className="mt-1 font-semibold">
                      {customerOrders.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Total Spent
                    </p>

                    <p className="mt-1 font-semibold text-[#536b50]">
                      ₹{getTotalSpent(
                        customer.uid || customer.id
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                </div>

                <div className="mt-5 border-t pt-4">
                  <h3 className="mb-3 font-semibold">
                    Order History
                  </h3>

                  {customerOrders.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No orders placed yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {customerOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-wrap justify-between gap-3 rounded-lg bg-[#fffaf7] p-3 text-sm"
                        >
                          <div>
                            <p className="font-semibold">
                              Order #{order.id}
                            </p>

                            <p className="text-xs text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">
                              ₹{Number(order.total || 0).toLocaleString("en-IN")}
                            </p>

                            <p className="text-xs capitalize text-[#536b50]">
                              {(order.status || "pending").replaceAll("_", " ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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
