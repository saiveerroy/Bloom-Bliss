
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, resetPassword } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await login(email, password);

      const destination = location.state?.from || "/";

      navigate(destination, {
        replace: true,
        state: location.state?.cart
          ? { cart: location.state.cart }
          : null,
      });
    } catch (err) {
      const messages = {
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
      };

      setError(
        messages[err.code] || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setError("");
    setMessage("");

    try {
      await resetPassword(email);
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setError(err.message || "Unable to send reset email.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf7] px-5 py-10">

      <div className="w-full max-w-md rounded-2xl border border-[#eee5df] bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">

          <Link
            to="/"
            className="font-serif text-3xl font-bold text-[#536b50]"
          >
            Bloom <span className="text-[#d58c91]">&</span> Bliss
          </Link>

          <p className="mt-2 text-xs tracking-[4px] text-gray-500">
            FLOWER STUDIO
          </p>

          <h1 className="mt-8 font-serif text-3xl">
            Welcome Back 🌸
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to continue shopping.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border p-3 outline-none focus:border-[#536b50]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border p-3 outline-none focus:border-[#536b50]"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#536b50] underline"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#536b50] py-3 text-white hover:bg-[#3e543b] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-7 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            state={location.state}
            className="font-semibold text-[#536b50] underline"
          >
            Register Now
          </Link>
        </p>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-gray-500"
        >
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}
