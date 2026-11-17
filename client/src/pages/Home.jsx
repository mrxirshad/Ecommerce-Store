import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api/axios.js";

const CATEGORIES = [
  {
    label: "All Products",
    value: "",
    badge: "New Season Tech Essentials",
    headline: "Upgrade your everyday",
    highlight: "workspace & gear.",
    subtitle:
      "Curated flagship smartphones, ultra-portable laptops, and studio-grade audio—backed by fast Cash on Delivery.",
    accent: "from-slate-900 via-slate-900 to-indigo-950",
  },
  {
    label: "Laptops",
    value: "laptop",
    badge: "Performance & Portability",
    headline: "Power through every",
    highlight: "project & deadline.",
    subtitle:
      "Ultrabooks, creator workstations, and high-refresh gaming machines built for speed.",
    accent: "from-slate-900 via-slate-900 to-blue-950",
  },
  {
    label: "Phones",
    value: "phone",
    badge: "Next-Gen Flagships",
    headline: "Pro cameras & speed",
    highlight: "in your pocket.",
    subtitle:
      "Edge-to-edge AMOLED displays, all-day battery life, and flagship silicon ready to ship.",
    accent: "from-slate-900 via-slate-900 to-violet-950",
  },
  {
    label: "Audio",
    value: "audio",
    badge: "Studio-Grade Sound",
    headline: "Pure immersion,",
    highlight: "zero distractions.",
    subtitle:
      "Active noise-cancelling headphones, wireless earbuds, and portable speakers tuned for clarity.",
    accent: "from-slate-900 via-slate-900 to-emerald-950",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [addedId, setAddedId] = useState(null);

  const activeHero =
    CATEGORIES.find((c) => c.value === category) || CATEGORIES[0];

  useEffect(() => {
    const loadProducts = async () => {
      setFetching(true);
      try {
        const response = await api.get(
          `/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
        );
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
        setFetching(false);
      }
    };

    loadProducts();
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "undefined" || userId === "null") {
      navigate("/login");
      return;
    }

    try {
      const response = await api.post(`/cart/add`, { userId, productId });
      const items = response.data?.cart?.items || [];
      const total = items.reduce((sum, item) => sum + item.quantity, 0);

      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdate"));

      setAddedId(productId);
      setTimeout(() => {
        setAddedId((prev) => (prev === productId ? null : prev));
      }, 1200);
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Category Hero Banner (compacts smoothly when searching) */}
      <section
        className={`bg-gradient-to-r ${activeHero.accent} text-white border-b border-slate-800 transition-colors duration-500`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            search ? "py-6" : "py-10 sm:py-12"
          } flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              {activeHero.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {activeHero.headline}{" "}
              <span className="text-indigo-400">{activeHero.highlight}</span>
            </h1>
            {!search && (
              <p className="mt-2.5 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                {activeHero.subtitle}
              </p>
            )}
          </div>

          {/* Trust Pills */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-indigo-400 font-bold text-base">100%</p>
              <p className="text-xs text-slate-300">Genuine Tech</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-emerald-400 font-bold text-base">COD</p>
              <p className="text-xs text-slate-300">Pay on Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter & Search Toolbar */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200/80 mb-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {CATEGORIES.map((cat) => {
              const isActive = category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search laptops, phones, audio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            {category ? activeHero.label : "Featured Products"}
          </h2>
          {!loading && (
            <span className="text-sm text-slate-500 font-medium">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          )}
        </div>

        {/* Initial Load Skeletons Only (Prevents Flicker on Tab Change) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 animate-pulse"
              >
                <div className="w-full h-48 bg-slate-100 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-5" />
                <div className="h-10 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-8">
            <p className="text-lg font-bold text-slate-900">
              No matching products
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search keywords or switching categories.
            </p>
            {(search || category) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("");
                }}
                className="mt-5 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* Products Grid with Smooth Opacity Transition */
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-200 ${
              fetching ? "opacity-55" : "opacity-100"
            }`}
          >
            {products.map((item) => {
              const outOfStock = item.stock !== undefined && item.stock <= 0;
              const isAdded = addedId === item._id;

              return (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <Link
                      to={`/products/${item._id}`}
                      className="relative block bg-slate-50 rounded-xl p-4 h-48 overflow-hidden border border-slate-100"
                    >
                      {item.category && (
                        <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-slate-200/80 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          {item.category}
                        </span>
                      )}
                      {outOfStock && (
                        <span className="absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[11px] font-semibold">
                          Out of Stock
                        </span>
                      )}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <Link to={`/products/${item._id}`} className="block mt-4">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </Link>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-lg font-extrabold text-slate-900">
                        ${Number(item.price).toFixed(2)}
                      </span>
                      {item.stock > 0 && item.stock <= 5 && (
                        <span className="text-xs font-medium text-amber-600">
                          Only {item.stock} left
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(item._id)}
                      disabled={outOfStock}
                      className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        outOfStock
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : isAdded
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-900 text-white hover:bg-indigo-600 shadow-xs"
                      }`}
                    >
                      {outOfStock ? (
                        "Sold Out"
                      ) : isAdded ? (
                        <span>✓ Added to Bag</span>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;