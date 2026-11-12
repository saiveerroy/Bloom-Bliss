import React, { useState } from "react";
import { useInventory } from "./context/InventoryContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";

// CATEGORIES

const categories = [
  {
    name: "Birthday Flowers",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600",
  },
  {
    name: "Love & Romance",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600",
  },
  {
    name: "Anniversary Gifts",
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600",
  },
  {
    name: "Flower Baskets",
    image: "https://images.unsplash.com/photo-1494972308805-463bc619d34b?w=600",
  },
];

// NAVBAR

function Navbar({ cartCount, onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const { user, customer, logout, loading } = useAuth();
  const navigate = useNavigate();
 


  const links = [
    ["Home", "#"],
    ["Shop", "/shop"],
    ["Collections", "#categories"],
    ["Our Story", "#about"],
    ["Contact", "#contact"],
  ];

  async function handleLogout() {
    try {
      await logout();
      setProfileOpen(false);
      navigate("/");
      alert("Logged out successfully!");
    } catch (error) {
      alert("Unable to logout. Please try again.");
    }
  }


  return (
    <>
      <div className="bg-[#536b50] py-2 text-center text-xs tracking-wider text-white">
        FREE DELIVERY ON ORDERS ABOVE ₹1499 🌸
      </div>

      <header className="sticky top-0 z-50 border-b border-[#eee5df] bg-[#fffaf7]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          <a href="#" className="font-serif text-2xl font-bold text-[#536b50]">
            Bloom <span className="text-[#d58c91]">&</span> Bliss
            <span className="block text-center text-[9px] tracking-[4px] text-gray-500">
              FLOWER STUDIO
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#">Home</a>
            <a href="#shop">Shop</a>

            <div className="group relative">
              <button type="button" className="py-3">
                Collections ⌄
              </button>

              <div className="invisible absolute left-0 top-full z-50 w-64 rounded-xl border bg-white p-3 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                {categories.map((category) => (
                  <a
                    key={category.name}
                    href="#shop"
                    className="block rounded-lg px-4 py-3 text-sm hover:bg-[#fff5f3]"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>

            <a href="#about">Our Story</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="flex items-center gap-4">

            {/* PROFILE ICON */}

            <div className="relative">

              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                  } else {
                    setProfileOpen(!profileOpen);
                  }
                }}
                className="flex items-center gap-2 text-xl text-[#536b50]"
                aria-label="Customer profile"
              >
                👤
              </button>

              {user && profileOpen && (
                <div className="absolute right-0 top-12 z-[100] w-60 rounded-xl border bg-white p-5 shadow-xl">

                  <p className="font-semibold text-[#536b50]">
                    Hello, {customer?.name || user.displayName || "Customer"}!
                  </p>

                  <p className="mt-1 break-all text-xs text-gray-500">
                    {user.email}
                  </p>

                  <div className="my-4 border-t" />

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#fff5f3]"
                  >
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-lg bg-[#536b50] px-3 py-2 text-sm text-white hover:bg-[#3e543b]"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>

            {/* CART ICON */}


            <button
              type="button"
              onClick={onCartClick}
              className="relative cursor-pointer text-2xl"
              aria-label="Open shopping cart"
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#c77f82] text-xs text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col border-t bg-[#fffaf7] px-6 py-4 md:hidden">
            {links.map(([name, href]) => (
              <a
                key={name}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="border-b py-3 text-sm"
              >
                {name}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

// HERO SECTION

function Hero() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="flex flex-col justify-center bg-[#f8eae5] px-8 py-20 md:px-16">

        <p className="text-xs uppercase tracking-[4px] text-[#a66e68]">
          Flowers that speak from the heart
        </p>

        <h1 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
          Every Bloom
          <br />
          Tells a
          <br />
          <span className="italic text-[#c77f82]">
            Beautiful Story.
          </span>
        </h1>

        <p className="mt-6 max-w-md text-sm leading-7 text-[#776b64]">
          Thoughtfully handcrafted bouquets and beautiful floral gifts
          to make every moment unforgettable.
        </p>

        <a
          href="#shop"
          className="mt-8 w-fit bg-[#536b50] px-8 py-4 text-xs uppercase tracking-[2px] text-white hover:bg-[#3e543b]"
        >
          Shop Flowers →
        </a>
      </div>

      <div className="min-h-[400px]">
        <img
          src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400"
          alt="Beautiful flower bouquet"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}

// BENEFITS

function Benefits() {
  const benefits = [
    ["✿", "Fresh Flowers", "Handpicked daily"],
    ["♡", "Made With Love", "Beautifully arranged"],
    ["♧", "Timely Delivery", "Flowers at your door"],
    ["✉", "Personal Messages", "Make gifts special"],
  ];

  return (
    <section className="grid grid-cols-2 gap-6 bg-white px-5 py-10 text-center md:grid-cols-4">
      {benefits.map(([icon, title, subtitle]) => (
        <div key={title}>
          <div className="text-2xl text-[#c77f82]">{icon}</div>
          <h3 className="mt-2 text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
      ))}
    </section>
  );
}

// CATEGORIES

function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-5 py-20">

      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[4px] text-[#b47b75]">
          Find something beautiful
        </p>

        <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
          Shop By Occasion
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          The perfect flowers for every special moment.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <a
            href="#shop"
            key={category.name}
            className="group relative overflow-hidden"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16 text-center text-white">
              <h3 className="font-serif text-lg">{category.name}</h3>
              <p className="mt-1 text-xs">Explore collection →</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// PRODUCTS

function Products({
  onAddToCart,
  selectedCategory,
  setSelectedCategory,
}) {

  const navigate = useNavigate();
  const { products } = useInventory();

  const productCategories = [
    ...new Set(
      products.map((product) => product.category).filter(Boolean)
    ),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <section id="shop" className="bg-[#f8f0eb] px-5 py-20">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[4px] text-[#b47b75]">
            Our customer favourites
          </p>

          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
            Bestselling Blooms
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            Beautiful bouquets made to brighten someone's day.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`rounded-full px-5 py-2 text-sm ${
                selectedCategory === "All"
                  ? "bg-[#536b50] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              All Flowers
            </button>

            {productCategories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-sm ${
                  selectedCategory === category
                    ? "bg-[#536b50] text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">
            No products available in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {filteredProducts.map((product) => (
              <article key={product.id} className="group">

                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  {product.tag && (
                    <span className="absolute left-3 top-3 bg-white px-3 py-2 text-[10px] uppercase">
                      {product.tag}
                    </span>
                  )}
                </div>

                <div className="pt-4">
                  <p className="text-[10px] uppercase text-[#a68a7e]">
                    {product.category}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `/product/${product.id}`;
                    }}
                    className="mt-2 cursor-pointer text-left font-serif text-lg hover:text-[#c77f82]"
                  >
                    {product.name}
                  </button>

                  <p className="mt-2 text-sm font-semibold">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </p>

                  <button
                    type="button"
                    disabled={product.stock <= 0}
                    onClick={() => onAddToCart(product)}
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
      </div>
    </section>
  );
}

// ABOUT

function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-5 py-24 text-center">

      <p className="text-xs uppercase tracking-[4px] text-[#b47b75]">
        A little about us
      </p>

      <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
        Flowers Are Our Love Language.
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-gray-500">
        We believe every flower carries a feeling, every bouquet tells a
        story, and every little gift creates a memory. Our mission is to
        bring happiness to your special moments with thoughtfully arranged
        flowers and heartfelt gifts.
      </p>

      <p className="mt-8 font-serif text-2xl italic text-[#c77f82]">
        With love, Bloom & Bliss.
      </p>
    </section>
  );
}

// FOOTER

function Footer() {
  return (
    <footer id="contact" className="bg-[#344333] px-5 py-14 text-white">

      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">

        <div>
          <h2 className="font-serif text-3xl">Bloom & Bliss</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Bringing smiles, love and beautiful memories through the
            language of flowers.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-xs uppercase tracking-[2px]">
            Quick Links
          </h3>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <a href="#">Home</a>
            <a href="#shop">Shop</a>
            <a href="#categories">Collections</a>
            <a href="#about">Our Story</a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-xs uppercase tracking-[2px]">
            Customer Care
          </h3>
          <div className="flex flex-col gap-3 text-sm text-white/70">
            <a href="#contact">Contact Us</a>
            <a href="#contact">Delivery Information</a>
            <a href="#contact">Privacy Policy</a>
          </div>
        </div>

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

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/20 pt-6 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Bloom & Bliss. All rights reserved.
      </div>

    </footer>
  );
}

// SHOPPING CART

function ShoppingCart({
  cart,
  onClose,
  onRemove,
  onIncrease,
  onDecrease,
  onCheckout,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-[#fffaf7] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between border-b pb-5">
          <h2 className="font-serif text-2xl">
            Your Shopping Bag
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-5xl">🛍️</p>

            <h3 className="mt-5 font-serif text-2xl">
              Your cart is empty
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add some beautiful flowers!
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 bg-[#536b50] px-6 py-3 text-white"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-serif text-lg">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <div className="mt-3 flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() => onDecrease(item.id)}
                        className="h-8 w-8 rounded border border-[#536b50] text-lg"
                      >
                        −
                      </button>

                      <span className="text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onIncrease(item.id)}
                        className="h-8 w-8 rounded border border-[#536b50] text-lg"
                      >
                        +
                      </button>

                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="mt-2 text-xs text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="text-sm font-semibold">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-5">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Delivery charges will be calculated at checkout.
              </p>

              <button
                type="button"
                onClick={onCheckout}
                className="mt-6 w-full bg-[#536b50] py-4 text-white hover:bg-[#3e543b]"
              >
                Proceed To Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// MAIN CUSTOMER HOME

export default function CustomerHome() {
  const { products } = useInventory();
  const { user, customer, logout, loading } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const {
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      cartLoading,
    } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [orderSuccess, setOrderSuccess] = useState(
    location.state?.orderSuccess || null
  );

 

  

  // CART COUNT

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  // OPEN CHECKOUT

  function openCheckout() {
  if (cart.length === 0) {
    alert("Your shopping cart is empty.");
    return;
  }

  if (loading) return;

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

  // ORDER SUCCESS



  return (
    <>
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <Hero />

      <Benefits />

      <Categories />

      <Products
        onAddToCart={(product) => addToCart(product, products)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <About />

      <Footer />

      {/* SHOPPING CART */}

      {cartOpen && (
        <ShoppingCart
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onIncrease={(id) => increaseQuantity(id, products)}
          onDecrease={decreaseQuantity}
          onCheckout={openCheckout}
        />
      )}

      {/* ORDER SUCCESS */}

      

      {orderSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-5">

          <div className="w-full max-w-md rounded-xl bg-white p-8 text-center">

            <div className="text-5xl">🌸</div>

            <h2 className="mt-4 font-serif text-2xl">
              Order Placed Successfully!
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              Thank you for shopping with Bloom & Bliss.
            </p>

            <p className="mt-3 font-semibold">
              Order ID: {orderSuccess.id}
            </p>

            <button
              type="button"
              onClick={() => setOrderSuccess(null)}
              className="mt-6 bg-[#536b50] px-6 py-3 text-white hover:bg-[#3e543b]"
            >
              Continue Shopping
            </button>

          </div>
        </div>
      )}
    </>
  );
}
