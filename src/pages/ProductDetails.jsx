
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, loading, error } = useInventory();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffaf7]">
        <p className="text-lg text-[#536b50]">
          Loading beautiful flowers... 🌸
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Unable to load products: {error}</p>
      </div>
    );
  }

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">
          Product not found
        </h2>

        <button
          onClick={() => navigate("/")}
          className="mt-5 rounded-lg bg-[#536b50] px-6 py-3 text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] p-5 sm:p-10">

      <button
        onClick={() => navigate("/")}
        className="mb-8 text-sm text-[#536b50] underline"
      >
        ← Back to Shopping
      </button>

      <div className="mx-auto grid max-w-5xl gap-10 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2 md:p-10">

        <div>
          <img
            src={product.image}
            alt={product.name}
            className="h-[450px] w-full rounded-xl object-cover"
          />
        </div>

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

          <button
            disabled={Number(product.stock) <= 0}
            onClick={() => addToCart(product, products)}
            className="mt-8 rounded-lg bg-[#536b50] px-8 py-4 text-white hover:bg-[#3e543b] disabled:bg-gray-400"
          >
            {product.stock > 0
              ? "Add to Cart +"
              : "Out of Stock"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-lg border border-[#536b50] px-8 py-4 text-[#536b50]"
          >
            Continue Shopping
          </button>

        </div>
      </div>
    </div>
  );
}
