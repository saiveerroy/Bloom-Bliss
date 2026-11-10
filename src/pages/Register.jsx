
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password
      );

      const destination = location.state?.from || "/";

      navigate(destination, {
        replace: true,
        state: location.state?.cart
          ? { cart: location.state.cart }
          : null,
      });
    } catch (err) {
      const messages = {
        "auth/email-already-in-use":
          "This email is already registered.",
        "auth/invalid-email":
          "Please enter a valid email address.",
        "auth/weak-password":
          "Please choose a stronger password.",
      };

      setError(
        messages[err.code] ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
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
            Create Account 🌷
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join us and make every moment beautiful.
          </p>

        </div>

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg border p-3 outline-none focus:border-[#536b50]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
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
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full rounded-lg border p-3 outline-none focus:border-[#536b50]"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-lg border p-3 outline-none focus:border-[#536b50]"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#536b50] py-3 text-white hover:bg-[#3e543b] disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="mt-7 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="font-semibold text-[#536b50] underline"
          >
            Login
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
