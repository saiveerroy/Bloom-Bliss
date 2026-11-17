
import React, { useEffect, useMemo, useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import ShoppingCart from "./ShoppingCart";

export default function Shop() {
  const { products } = useInventory();

  const {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartLoading,
  } = useCart();

  const { user, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.category || "All"
  );

  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedBudget, setSelectedBudget] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
  const filters = location.state?.shopFilters;

  if (filters) {
    setSelectedCategory(filters.selectedCategory || "All");
    setSelectedOccasion(filters.selectedOccasion || "All");
    setSelectedBudget(filters.selectedBudget || "All");
    setSearch(filters.search || "");
    setSort(filters.sort || "default");
  } else {
    setSelectedCategory(location.state?.category || "All");
  }
}, [location.state]);

  const categories = [
    ...new Set(
      products.map((product) => product.category).filter(Boolean)
    ),
  ];

  const occasions = [
    "Birthday Flowers",
    "Love & Romance",
    "Anniversary Gifts",
    "Flower Baskets",
  ];

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  // FILTER PRODUCTS

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedOccasion !== "All") {
      result = result.filter(
        (product) => product.category === selectedOccasion
      );
    }

    if (selectedBudget === "under500") {
      result = result.filter(
        (product) => Number(product.price) < 500
      );
    }

    if (selectedBudget === "500-1000") {
      result = result.filter(
        (product) =>
          Number(product.price) >= 500 &&
          Number(product.price) <= 1000
      );
    }

    if (selectedBudget === "1000-1500") {
      result = result.filter(
        (product) =>
          Number(product.price) > 1000 &&
          Number(product.price) <= 1500
      );
    }

    if (selectedBudget === "above1500") {
      result = result.filter(
        (product) => Number(product.price) > 1500
      );
    }

    if (sort === "low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    selectedOccasion,
    selectedBudget,
    sort,
  ]);

  function clearFilters() {
    setSelectedCategory("All");
    setSelectedOccasion("All");
    setSelectedBudget("All");
    setSearch("");
    setSort("default");
  }

  function handleCheckout() {
    if (cart.length === 0 || loading || cartLoading) return;

    setCartOpen(false);

    if (user) {
      navigate("/checkout", { state: { cart } });
    } else {
      navigate("/login", {
        state: {
          from: "/checkout",
          cart,
        },
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf7]">

      {/* NAVBAR */}

      <header className="sticky top-0 z-40 border-b border-[#eee5df] bg-[#fffaf7]/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#536b50] hover:text-[#c77f82]"
          >
            <span className="text-3xl">←</span>
            <span className="hidden text-sm sm:block">
              Back to Home
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-center"
          >
            <h1 className="font-serif text-2xl font-bold text-[#536b50]">
              Bloom <span className="text-[#d58c91]">&</span> Bliss
            </h1>

            <p className="text-[9px] tracking-[4px] text-gray-500">
              FLOWER STUDIO
            </p>
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full bg-[#536b50] px-4 py-3 text-white hover:bg-[#3e543b]"
          >
            <span className="text-xl">🛒</span>
            <span className="hidden text-sm sm:block">Cart</span>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#c77f82] text-xs">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* SHOP TITLE */}

      <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 text-center">

        <p className="text-xs uppercase tracking-[4px] text-[#b47b75]">
          Made with love, just for you
        </p>

        <h2 className="mt-4 font-serif text-4xl text-[#344333] sm:text-5xl">
          The Flower Boutique
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-500">
          Discover beautiful blooms and thoughtful gifts
          to make every special moment unforgettable.
        </p>

      </section>

      {/* SEARCH */}

      <section className="mx-auto max-w-7xl px-5 pb-10">

        <div className="mx-auto flex max-w-2xl items-center rounded-full border border-[#eadbd3] bg-white px-5 py-3 shadow-sm">

          <span className="mr-3 text-xl">⌕</span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your favourite flowers..."
            className="w-full bg-transparent text-sm outline-none"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}

        </div>

      </section>

      {/* SHOP CONTENT */}

      <section className="mx-auto max-w-7xl px-5 pb-20">

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* FILTER SIDEBAR */}

          <aside className="w-full shrink-0 lg:w-64">

            <div className="rounded-2xl border border-[#eee5df] bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <h3 className="font-serif text-2xl text-[#344333]">
                  Filters
                </h3>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-[#c77f82] underline"
                >
                  Clear All
                </button>

              </div>

              {/* BUDGET FILTER */}

              <div className="mt-7 border-b border-[#eee5df] pb-7">

                <h4 className="mb-4 text-sm font-semibold text-[#536b50]">
                  Your Budget
                </h4>

                <div className="space-y-3 text-sm text-gray-600">

                  {[
                    ["All", "All Prices"],
                    ["under500", "Under ₹500"],
                    ["500-1000", "₹500 – ₹1,000"],
                    ["1000-1500", "₹1,000 – ₹1,500"],
                    ["above1500", "Above ₹1,500"],
                  ].map(([value, label]) => (

                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="radio"
                        name="budget"
                        checked={selectedBudget === value}
                        onChange={() => setSelectedBudget(value)}
                        className="accent-[#536b50]"
                      />

                      {label}
                    </label>

                  ))}

                </div>

              </div>

              {/* CATEGORY FILTER */}

              <div className="mt-7 border-b border-[#eee5df] pb-7">

                <h4 className="mb-4 text-sm font-semibold text-[#536b50]">
                  Categories
                </h4>

                <div className="space-y-3 text-sm text-gray-600">

                  {["All", ...categories].map((category) => (

                    <label
                      key={category}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="accent-[#536b50]"
                      />

                      {category === "All" ? "All Flowers" : category}
                    </label>

                  ))}

                </div>

              </div>

              {/* OCCASION FILTER */}

              <div className="mt-7">

                <h4 className="mb-4 text-sm font-semibold text-[#536b50]">
                  Shop By Occasion
                </h4>

                <div className="space-y-3 text-sm text-gray-600">

                  {["All", ...occasions].map((occasion) => (

                    <label
                      key={occasion}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="radio"
                        name="occasion"
                        checked={selectedOccasion === occasion}
                        onChange={() => setSelectedOccasion(occasion)}
                        className="accent-[#536b50]"
                      />

                      {occasion === "All"
                        ? "All Occasions"
                        : occasion}
                    </label>

                  ))}

                </div>

              </div>

            </div>

          </aside>

          {/* PRODUCTS AREA */}

          <div className="min-w-0 flex-1">

            {/* PRODUCT HEADER */}

            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

              <div>

                <h3 className="font-serif text-2xl text-[#344333]">
                  Our Beautiful Collection
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Showing {filteredProducts.length} beautiful products
                </p>

              </div>

              {/* SORT PRODUCTS */}

              <div className="flex items-center gap-2">

                <span className="text-xs text-gray-500">
                  Sort by:
                </span>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-[#eadbd3] bg-white px-3 py-2 text-xs outline-none"
                >
                  <option value="default">Recommended</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>

              </div>

            </div>

            {/* ACTIVE FILTERS */}

            {(selectedCategory !== "All" ||
              selectedOccasion !== "All" ||
              selectedBudget !== "All") && (

              <div className="mb-6 flex flex-wrap items-center gap-2">

                <span className="text-xs text-gray-500">
                  Active filters:
                </span>

                {selectedCategory !== "All" && (
                  <span className="rounded-full bg-[#f8eae5] px-3 py-2 text-xs text-[#536b50]">
                    {selectedCategory}
                  </span>
                )}

                {selectedOccasion !== "All" && (
                  <span className="rounded-full bg-[#f8eae5] px-3 py-2 text-xs text-[#536b50]">
                    {selectedOccasion}
                  </span>
                )}

                {selectedBudget !== "All" && (
                  <span className="rounded-full bg-[#f8eae5] px-3 py-2 text-xs text-[#536b50]">
                    Budget selected
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-[#c77f82] underline"
                >
                  Remove all
                </button>

              </div>

            )}

            {/* PRODUCT GRID */}

            {filteredProducts.length === 0 ? (

              <div className="rounded-2xl bg-white py-24 text-center">

                <p className="text-5xl">🌷</p>

                <h3 className="mt-5 font-serif text-2xl text-[#536b50]">
                  No Flowers Found
                </h3>

                <p className="mt-3 text-sm text-gray-500">
                  Try changing your filters or search.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-full bg-[#536b50] px-7 py-3 text-sm text-white hover:bg-[#3e543b]"
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">

                {filteredProducts.map((product) => (

                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-xl bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f0eb]">

                      <button
                        type="button"
                        onClick={() =>
                            navigate(`/product/${product.id}`, {
                              state: { from: "/shop",
                                shopFilters: {
                                  selectedCategory,
                                  selectedOccasion,
                                  selectedBudget,
                                  search,
                                  sort,
                                },
                               },
                            })
                          }
                        className="h-full w-full"
                      >

                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                      </button>

                      {product.tag && (
                        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-2 text-[9px] uppercase tracking-wider text-[#536b50] shadow-sm">
                          {product.tag}
                        </span>
                      )}

                      {product.stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold">
                            Sold Out
                          </span>
                        </div>
                      )}

                    </div>

                    {/* PRODUCT DETAILS */}

                    <div className="p-3 sm:p-4">

                      <p className="text-[9px] uppercase tracking-wider text-[#b47b75] sm:text-[10px]">
                        {product.category}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                                navigate(`/product/${product.id}`, {
                                  state: { from: "/shop",
                                    shopFilters: {
                                      selectedCategory,
                                      selectedOccasion,
                                      selectedBudget,
                                      search,
                                      sort,
                                    },
                                   },
                                })
                              }
                        className="mt-2 line-clamp-2 text-left font-serif text-base text-[#344333] hover:text-[#c77f82] sm:text-lg"
                      >
                        {product.name}
                      </button>

                      <div className="mt-3 flex items-center justify-between gap-2">

                        <p className="text-sm font-semibold text-[#536b50]">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>

                        <span className="text-[9px] text-gray-400">
                          {product.stock > 0
                            ? `${product.stock} left`
                            : "Unavailable"}
                        </span>

                      </div>

                      <button
                        type="button"
                        disabled={product.stock <= 0}
                        onClick={() => addToCart(product, products)}
                        className="mt-4 w-full rounded-lg bg-[#536b50] py-3 text-[10px] uppercase tracking-wider text-white transition hover:bg-[#3e543b] disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-xs"
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

          </div>

        </div>

      </section>

  

      {/* SHOPPING CART DRAWER */}

          {cartOpen && (
            <ShoppingCart
              cart={cart}
              onClose={() => setCartOpen(false)}
              onRemove={removeFromCart}
              onIncrease={(id) => increaseQuantity(id, products)}
              onDecrease={decreaseQuantity}
              onCheckout={handleCheckout}
              cartLoading={loading || cartLoading}
            />
          )}


      {/* FOOTER */}

      <footer className="bg-[#344333] px-5 py-14 text-white">

        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}

          <div>

            <h2 className="font-serif text-3xl">
              Bloom & Bliss
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/70">
              Bringing smiles, love and beautiful memories
              through the language of flowers.
            </p>

          </div>

          {/* QUICK LINKS */}

          <div>

            <h3 className="mb-5 text-xs uppercase tracking-[2px]">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm text-white/70">

              <button
                onClick={() => navigate("/")}
                className="text-left hover:text-white"
              >
                Home
              </button>

              <button
                onClick={() => window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })}
                className="text-left hover:text-white"
              >
                Shop
              </button>

              <button
                onClick={() => navigate("/")}
                className="text-left hover:text-white"
              >
                Our Story
              </button>

            </div>

          </div>

          {/* CUSTOMER CARE */}

          <div>

            <h3 className="mb-5 text-xs uppercase tracking-[2px]">
              Customer Care
            </h3>

            <div className="flex flex-col gap-3 text-sm text-white/70">

              <p>Contact Us</p>
              <p>Delivery Information</p>
              <p>Privacy Policy</p>

            </div>

          </div>

          {/* CONTACT */}

          <div>

            <h3 className="mb-5 text-xs uppercase tracking-[2px]">
              Get In Touch
            </h3>

            <div className="flex flex-col gap-3 text-sm text-white/70">

              <p>hello@yourflowershop.com</p>
              <p>+91 XXXXX XXXXX</p>
              <p>India</p>

            </div>

          </div>

        </div>

        {/* COPYRIGHT */}

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/20 pt-6 text-center text-xs text-white/60">

          © {new Date().getFullYear()} Bloom & Bliss.
          All rights reserved.

        </div>

      </footer>

    </div>
  );
}
