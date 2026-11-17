
function Navbar({ cartCount, onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, customer, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    ["Home", "/"],
    ["Shop", "/shop"],
    ["Collections", "#categories"],
    ["Our Story", "#about"],
    ["Contact", "#contact"],
  ];

  const occasionCategories = [
    "Birthday Flowers",
    "Love & Romance",
    "Anniversary Gifts",
    "Flower Baskets",
  ];

  async function handleLogout() {
    try {
      await logout();
      setProfileOpen(false);
      navigate("/");
      alert("Logged out successfully!");
    } catch {
      alert("Unable to logout. Please try again.");
    }
  }

  return (
    <>
      <div style={styles.announcement}>
        FREE DELIVERY ON ORDERS ABOVE ₹1499 🌸
      </div>

      <header style={styles.header}>
        <div style={styles.navbar}>

          <a href="/" style={styles.logo}>
            Bloom <span style={{ color: "#d58c91" }}>&</span> Bliss
            <span style={{
              display: "block",
              textAlign: "center",
              fontSize: "9px",
              letterSpacing: "4px",
              color: "#777"
            }}>
              FLOWER STUDIO
            </span>
          </a>

          <nav style={styles.navLinks}>
            <a href="/">Home</a>
            <a href="/shop">Shop</a>

            <div style={{ position: "relative" }}>
              <button
                type="button"
                style={styles.iconButton}
                onClick={() => setProfileOpen(false)}
              >
                Collections ⌄
              </button>

              <div style={styles.profileDropdown}>
                {occasionCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      navigate("/shop", { state: { category } })
                    }
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      background: "white",
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <a href="#about">Our Story</a>
            <a href="#contact">Contact</a>
          </nav>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>

            <div style={{ position: "relative" }}>
              <button
                type="button"
                style={styles.iconButton}
                onClick={() => {
                  if (!user) navigate("/login");
                  else setProfileOpen(!profileOpen);
                }}
              >
                👤
              </button>

              {user && profileOpen && (
                <div style={styles.profileDropdown}>
                  <p>
                    Hello, {customer?.name || user.displayName || "Customer"}!
                  </p>

                  <p style={{ fontSize: "12px", color: "#777" }}>
                    {user.email}
                  </p>

                  <hr style={{ margin: "15px 0" }} />

                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                  >
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={styles.cartButton}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onCartClick}
              style={styles.iconButton}
            >
              🛒 {cartCount > 0 && `(${cartCount})`}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              style={styles.iconButton}
            >
              {menuOpen ? "✕" : "☰"}
            </button>

          </div>
        </div>

        {menuOpen && (
          <nav style={styles.mobileMenu}>
            {links.map(([name, href]) => (
              <a
                key={name}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ padding: "12px", borderBottom: "1px solid #eee" }}
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


function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.heroContent}>
        <p style={styles.heroSubtitle}>
          Flowers that speak from the heart
        </p>

        <h1 style={styles.heroHeading}>
          Every Bloom
          <br />
          Tells a
          <br />
          <span style={{ color: "#c77f82", fontStyle: "italic" }}>
            Beautiful Story.
          </span>
        </h1>

        <p style={styles.heroDescription}>
          Thoughtfully handcrafted bouquets and beautiful floral gifts
          to make every moment unforgettable.
        </p>

        <a href="/shop" style={styles.primaryButton}>
          Shop Flowers →
        </a>
      </div>

      <div>
        <img
          src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1400"
          alt="Beautiful flower bouquet"
          style={styles.heroImage}
        />
      </div>
    </section>
  );
}


function Benefits() {
  const benefits = [
    ["✿", "Fresh Flowers", "Handpicked daily"],
    ["♡", "Made With Love", "Beautifully arranged"],
    ["♧", "Timely Delivery", "Flowers at your door"],
    ["✉", "Personal Messages", "Make gifts special"],
  ];

  return (
    <section style={styles.benefits}>
      {benefits.map(([icon, title, subtitle]) => (
        <div key={title}>
          <div style={styles.benefitIcon}>{icon}</div>
          <h3 style={styles.benefitTitle}>{title}</h3>
          <p style={styles.benefitSubtitle}>{subtitle}</p>
        </div>
      ))}
    </section>
  );
}


function Categories() {
  const navigate = useNavigate();

  const occasions = [
    {
      name: "Birthday Flowers",
      category: "Birthday Flowers",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600",
    },
    {
      name: "Love & Romance",
      category: "Love & Romance",
      image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600",
    },
    {
      name: "Anniversary Gifts",
      category: "Anniversary Gifts",
      image: "/images/aniver.jpg",
    },
    {
      name: "Flower Baskets",
      category: "Flower Baskets",
      image: "/images/flower-baskets.jpg",
    },
  ];

  return (
    <section id="categories" style={styles.categories}>
      <div style={{ textAlign: "center" }}>
        <p style={styles.heroSubtitle}>Find something beautiful</p>

        <h2 style={styles.sectionHeading}>Shop By Occasion</h2>

        <p style={styles.sectionSubtitle}>
          The perfect flowers for every special moment.
        </p>
      </div>

      <div style={styles.categoryGrid}>
        {occasions.map(occasion => (
          <button
            key={occasion.name}
            type="button"
            style={styles.categoryCard}
            onClick={() =>
              navigate("/shop", {
                state: { category: occasion.category },
              })
            }
          >
            <img
              src={occasion.image}
              alt={occasion.name}
              style={styles.categoryImage}
            />

            <div style={{
              padding: "15px",
              backgroundColor: "#536b50",
              color: "white",
              textAlign: "center"
            }}>
              <h3>{occasion.name}</h3>
              <p style={{ fontSize: "12px" }}>Explore collection →</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function Products({
  onAddToCart,
  selectedCategory,
  setSelectedCategory,
}) {
  const { products } = useInventory();

  const productCategories = [
    ...new Set(products.map(p => p.category).filter(Boolean)),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(p => p.category === selectedCategory);

  return (
    <section id="shop" style={styles.productsSection}>
      <div style={styles.productsContainer}>

        <div style={{ textAlign: "center" }}>
          <p style={styles.heroSubtitle}>Our customer favourites</p>

          <h2 style={styles.sectionHeading}>Bestselling Blooms</h2>

          <p style={styles.sectionSubtitle}>
            Beautiful bouquets made to brighten someone's day.
          </p>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            marginTop: "24px"
          }}>
            {["All", ...productCategories].map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                style={{
                  ...styles.categoryFilter,
                  backgroundColor:
                    selectedCategory === category ? "#536b50" : "white",
                  color:
                    selectedCategory === category ? "white" : "#333",
                }}
              >
                {category === "All" ? "All Flowers" : category}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "30px" }}>
            No products available in this category.
          </p>
        ) : (
          <div style={styles.productGrid}>
            {filteredProducts.map(product => (
              <article key={product.id} style={styles.productCard}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={styles.productImage}
                />

                <p style={{ fontSize: "11px", color: "#a68a7e" }}>
                  {product.category}
                </p>

                <button
                  type="button"
                  style={styles.productName}
                  onClick={() =>
                    window.location.href = `/product/${product.id}`
                  }
                >
                  {product.name}
                </button>

                <p style={styles.productPrice}>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>

                <p style={{ fontSize: "12px", color: "#777" }}>
                  {product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock"}
                </p>

                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => onAddToCart(product)}
                  style={{
                    ...styles.cartButton,
                    marginTop: "12px",
                    opacity: product.stock > 0 ? 1 : 0.5,
                  }}
                >
                  {product.stock > 0 ? "Add To Cart +" : "Out Of Stock"}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


function About() {
  return (
    <section id="about" style={styles.about}>
      <p style={styles.heroSubtitle}>A little about us</p>

      <h2 style={styles.aboutHeading}>
        Flowers Are Our Love Language.
      </h2>

      <p style={styles.aboutDescription}>
        We believe every flower carries a feeling, every bouquet tells a
        story, and every little gift creates a memory. Our mission is to
        bring happiness to your special moments with thoughtfully arranged
        flowers and heartfelt gifts.
      </p>

      <p style={{
        fontFamily: "Georgia, serif",
        fontSize: "24px",
        fontStyle: "italic",
        color: "#c77f82"
      }}>
        With love, Bloom & Bliss.
      </p>
    </section>
  );
}


function Footer() {
  return (
    <footer id="contact" style={styles.footer}>
      <div style={styles.footerGrid}>

        <div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "30px" }}>
            Bloom & Bliss
          </h2>

          <p style={styles.footerText}>
            Bringing smiles, love and beautiful memories through the
            language of flowers.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <div style={styles.footerText}>
            <p><a href="/">Home</a></p>
            <p><a href="#shop">Shop</a></p>
            <p><a href="#categories">Collections</a></p>
            <p><a href="#about">Our Story</a></p>
          </div>
        </div>

        <div>
          <h3>Customer Care</h3>
          <div style={styles.footerText}>
            <p><a href="#contact">Contact Us</a></p>
            <p><a href="#contact">Delivery Information</a></p>
            <p><a href="#contact">Privacy Policy</a></p>
          </div>
        </div>

        <div>
          <h3>Get In Touch</h3>
          <div style={styles.footerText}>
            <p>hello@yourflowershop.com</p>
            <p>+91 XXXXX XXXXX</p>
            <p>India</p>
          </div>
        </div>

      </div>

      <p style={{
        textAlign: "center",
        marginTop: "50px",
        paddingTop: "20px",
        borderTop: "1px solid rgba(255,255,255,0.2)",
        fontSize: "12px"
      }}>
        © {new Date().getFullYear()} Bloom & Bliss. All rights reserved.
      </p>
    </footer>
  );
}



const styles = {
  // NAVBAR
  announcement: {
    backgroundColor: "#536b50",
    padding: "8px",
    textAlign: "center",
    fontSize: "12px",
    letterSpacing: "1px",
    color: "white",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backgroundColor: "#fffaf7",
    borderBottom: "1px solid #eee5df",
  },

  navbar: {
    maxWidth: "1280px",
    margin: "auto",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontFamily: "Georgia, serif",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#536b50",
    textDecoration: "none",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    fontSize: "14px",
  },

  iconButton: {
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
    color: "#536b50",
  },

  profileDropdown: {
    position: "absolute",
    right: 0,
    top: "48px",
    zIndex: 100,
    width: "240px",
    padding: "20px",
    backgroundColor: "white",
    border: "1px solid #eee",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
  },

  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 24px",
    backgroundColor: "#fffaf7",
    borderTop: "1px solid #eee",
  },

  // HERO
  hero: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },

  heroContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "80px 64px",
    backgroundColor: "#f8eae5",
  },

  heroSubtitle: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "4px",
    color: "#a66e68",
  },

  heroHeading: {
    marginTop: "24px",
    fontFamily: "Georgia, serif",
    fontSize: "64px",
    lineHeight: 1.1,
    color: "#333",
  },

  heroDescription: {
    marginTop: "24px",
    maxWidth: "420px",
    fontSize: "14px",
    lineHeight: 1.9,
    color: "#776b64",
  },

  primaryButton: {
    display: "inline-block",
    width: "fit-content",
    marginTop: "32px",
    padding: "16px 32px",
    backgroundColor: "#536b50",
    color: "white",
    textDecoration: "none",
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    border: "none",
    cursor: "pointer",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    minHeight: "400px",
    objectFit: "cover",
  },

  // BENEFITS
  benefits: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    padding: "40px 20px",
    backgroundColor: "white",
    textAlign: "center",
  },

  benefitIcon: {
    fontSize: "26px",
    color: "#c77f82",
  },

  benefitTitle: {
    marginTop: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },

  benefitSubtitle: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#777",
  },

  // CATEGORIES
  categories: {
    maxWidth: "1280px",
    margin: "auto",
    padding: "80px 20px",
  },

  sectionHeading: {
    marginTop: "12px",
    fontFamily: "Georgia, serif",
    fontSize: "44px",
    textAlign: "center",
  },

  sectionSubtitle: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#777",
    textAlign: "center",
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginTop: "40px",
  },

  categoryCard: {
    position: "relative",
    overflow: "hidden",
    border: "none",
    padding: 0,
    backgroundColor: "white",
    cursor: "pointer",
  },

  categoryImage: {
    width: "100%",
    aspectRatio: "4 / 5",
    objectFit: "cover",
  },

  // PRODUCTS
  productsSection: {
    backgroundColor: "#f8f0eb",
    padding: "80px 20px",
  },

  productsContainer: {
    maxWidth: "1280px",
    margin: "auto",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    marginTop: "40px",
  },

  productCard: {
    backgroundColor: "transparent",
  },

  productImage: {
    width: "100%",
    aspectRatio: "4 / 5",
    objectFit: "cover",
  },

  productName: {
    marginTop: "10px",
    fontFamily: "Georgia, serif",
    fontSize: "18px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
  },

  productPrice: {
    marginTop: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  },

  categoryFilter: {
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "13px",
  },

  // ABOUT
  about: {
    maxWidth: "900px",
    margin: "auto",
    padding: "96px 20px",
    textAlign: "center",
  },

  aboutHeading: {
    marginTop: "16px",
    fontFamily: "Georgia, serif",
    fontSize: "44px",
  },

  aboutDescription: {
    maxWidth: "650px",
    margin: "24px auto",
    fontSize: "14px",
    lineHeight: 2,
    color: "#777",
  },

  // FOOTER
  footer: {
    backgroundColor: "#344333",
    color: "white",
    padding: "56px 20px",
  },

  footerGrid: {
    maxWidth: "1280px",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "40px",
  },

  footerText: {
    marginTop: "16px",
    fontSize: "14px",
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.7)",
  },

  // SHOPPING CART
  cartOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  cartPanel: {
    width: "100%",
    maxWidth: "420px",
    height: "100%",
    overflowY: "auto",
    padding: "24px",
    backgroundColor: "#fffaf7",
    boxShadow: "0 0 20px rgba(0,0,0,0.15)",
  },

  cartItem: {
    display: "flex",
    gap: "16px",
    paddingBottom: "20px",
    marginTop: "20px",
    borderBottom: "1px solid #eee",
  },

  cartItemImage: {
    width: "80px",
    height: "96px",
    objectFit: "cover",
  },

  cartButton: {
    backgroundColor: "#536b50",
    color: "white",
    padding: "14px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },

  // ORDER SUCCESS
  successOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  successCard: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    borderRadius: "12px",
    backgroundColor: "white",
    textAlign: "center",
  },
};
