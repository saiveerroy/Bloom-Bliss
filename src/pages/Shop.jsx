import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Shop() {
  const { products } = useInventory();
  const { addToCart } = useCart();
  const navigate = useNavigate();
    const location = useLocation();

    const [selectedCategory, setSelectedCategory] = useState(
    location.state?.category || "All"
    );

    React.useEffect(() => {
     setSelectedCategory(location.state?.category || "All");
    }, [location.state]);

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-[#fffaf7]">

      {/* SHOP HEADER */}
      <div className="bg-[#536b50] px-5 py-16 text-center text-white">
        <h1 className="font-serif text-5xl">
          Our Flower Collection
        </h1>

        <p className="mt-4 text-sm">
          Find the perfect flowers for every beautiful moment.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 border border-white px-6 py-2 text-sm"
        >
          ← Back To Home
        </button>
      </div>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-16">

        <h2 className="mb-8 text-center font-serif text-3xl">
          Shop All Flowers
        </h2>

        {/* CATEGORY FILTER */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">

          <button
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full px-5 py-2 text-sm ${
              selectedCategory === "All"
                ? "bg-[#536b50] text-white"
                : "bg-white border"
            }`}
          >
            All Flowers
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm ${
                selectedCategory === category
                  ? "bg-[#536b50] text-white"
                  : "bg-white border"
              }`}
            >
              {category}
            </button>
          ))}

        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <p className="py-16 text-center text-gray-500">
            No products available.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">

            {filteredProducts.map((product) => (
              <article key={product.id} className="group">

                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {product.tag && (
                    <span className="absolute left-3 top-3 bg-white px-3 py-2 text-xs">
                      {product.tag}
                    </span>
                  )}
                </div>

                <div className="pt-4">

                  <p className="text-xs uppercase text-[#a68a7e]">
                    {product.category}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/product/${product.id}`)
                    }
                    className="mt-2 text-left font-serif text-lg"
                  >
                    {product.name}
                  </button>

                  <p className="mt-2 font-semibold">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </p>

                  <button
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product, products)}
                    className="mt-4 w-full bg-[#536b50] py-3 text-xs uppercase tracking-wider text-white hover:bg-[#3e543b] disabled:bg-gray-400"
                  >
                    {product.stock > 0
                      ? "Add To Cart +"
                      : "Out Of Stock"}
                  </button>

                </div>
              </article>
            ))}

          </div>
        )}

      </section>
    </div>
  );
}
