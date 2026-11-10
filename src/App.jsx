import React from "react";
import { Routes, Route } from "react-router-dom";

import CustomerHome from "./CustomerHome";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";


function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerHome />} />

      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="/admin/products" element={<ManageProducts />} />

      {/* Customer Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="*"
        element={
          <div className="p-10 text-center">
            <h1 className="text-3xl font-bold">
              404 - Page Not Found
            </h1>
            <a href="/" className="mt-5 inline-block underline">
              Back to Home
            </a>
          </div>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;