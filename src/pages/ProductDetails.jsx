
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ShoppingCart from "./ShoppingCart";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, loading, error } = useInventory();

  const {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartLoading,
  } = useCart();

  const { user, loading: authLoading } = useAuth();

  const [cartOpen, setCartOpen] = useState(false);

  // GO BACK TO PREVIOUS PAGE
  function goBack() {
      if (location.state?.from === "/shop") {
        navigate("/shop", {
          state: {
            shopFilters: location.state.shopFilters,
          },
        });
      } else {
        navigate(-1);
      }
    }

  // CART COUNT
  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  // CHECKOUT
  function handleCheckout() {
    if (cart.length === 0 || cartLoading || authLoading) return;

    setCartOpen(false);

    if (user) {
      navigate("/checkout", {
        state: { cart },
      });
    } else {
      navigate("/login", {
        state: {
          from: "/checkout",
          cart,
        },
      });
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf7]">
        <p className="text-lg text-[#536b50]">
          Loading beautiful flowers... 🌸
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Unable to load products: {error}</p>
      </div>
    );
  }

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">
          Product not found
        </h2>

        <button
          onClick={goBack}
          className="mt-5 rounded-lg bg-[#536b50] px-6 py-3 text-white"
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] p-5 sm:p-10">

      {/* TOP NAVIGATION */}

      <div className="mb-8 flex items-center justify-between">

        <button
          type="button"
          onClick={goBack}
          className="text-sm text-[#536b50] underline"
        >
          ← Back to Shopping
        </button>

        {/* CART ICON */}

        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 rounded-full bg-[#536b50] px-4 py-3 text-white transition hover:bg-[#3e543b]"
          aria-label="Open shopping cart"
        >
          <span className="text-xl">🛒</span>

          <span className="hidden text-sm sm:block">
            Cart
          </span>

          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#c77f82] text-xs text-white">
              {cartCount}
            </span>
          )}
        </button>

      </div>

      {/* PRODUCT DETAILS */}

      <div className="mx-auto grid max-w-5xl gap-10 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2 md:p-10">

        {/* PRODUCT IMAGE */}

        <div>
          <img
            src={product.image}
            alt={product.name}
            className="h-[450px] w-full rounded-xl object-cover"
          />
        </div>

        {/* PRODUCT INFORMATION */}

        <div className="flex flex-col justify-center">

          <p className="text-sm uppercase tracking-widest text-[#b47b75]">
            {product.category}
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            {product.name}
          </h1>

          {product.tag && (
            <span className="mt-4 w-fit rounded-full bg-pink-100 px-4 py-2 text-xs text-pink-700">
              {product.tag}
            </span>
          )}

          <p className="mt-6 text-3xl font-bold text-[#536b50]">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          <p className="mt-5 text-sm text-gray-600">
            {product.stock > 0
              ? `${product.stock} items available`
              : "Currently out of stock"}
          </p>

          {/* ADD TO CART */}

          <button
            type="button"
            disabled={Number(product.stock) <= 0 || cartLoading}
            onClick={() => addToCart(product, products)}
            className="mt-8 rounded-lg bg-[#536b50] px-8 py-4 text-white hover:bg-[#3e543b] disabled:bg-gray-400"
          >
            {product.stock > 0
              ? "Add to Cart +"
              : "Out of Stock"}
          </button>

          {/* CONTINUE SHOPPING */}

          <button
            type="button"
            onClick={goBack}
            className="mt-4 rounded-lg border border-[#536b50] px-8 py-4 text-[#536b50]"
          >
            Continue Shopping
          </button>

        </div>
      </div>

      {/* SHARED SHOPPING CART */}

      {cartOpen && (
        <ShoppingCart
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onIncrease={(id) => increaseQuantity(id, products)}
          onDecrease={decreaseQuantity}
          onCheckout={handleCheckout}
          cartLoading={cartLoading || authLoading}
        />
      )}

    </div>
  );
}
