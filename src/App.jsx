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
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminProfile from "./admin/AdminProfile";
import AdminLogin from "./admin/AdminLogin";
import ProductDetails from "./pages/ProductDetails";


function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerHome />} />

      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

            {/* Admin Dashboard */}
      <Route path="/admin" element={ <AdminProtectedRoute> <AdminDashboard /> </AdminProtectedRoute> }/>
      <Route path="/admin/profile" element={<AdminProtectedRoute><AdminProfile /></AdminProtectedRoute>} />
      <Route path="/admin-login" element={<AdminLogin />} />
     <Route
        path="/admin/products"
        element={
          <AdminProtectedRoute>
            <ManageProducts />
          </AdminProtectedRoute>
        }
      />

      {/* Customer Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

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

      <Route path="components/AdminProtectedRoute" element={<AdminProtectedRoute />} />

      
    
    </Routes>
  );
}

export default App;