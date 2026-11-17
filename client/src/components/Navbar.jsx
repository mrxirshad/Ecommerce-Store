import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { api } from "../api/axios.js";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  const isLoggedIn = Boolean(userId && userId !== "undefined" && userId !== "null");

  useEffect(() => {
    const loadCart = async () => {
      const currentUserId = localStorage.getItem("userId");
      setUserId(currentUserId);

      if (!currentUserId || currentUserId === "undefined" || currentUserId === "null") {
        setCartCount(0);
        return;
      }

      try {
        const response = await api.get(`/cart/${currentUserId}`);
        const items = response.data?.items || [];
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } catch (error) {
        console.error("Server error loading cart:", error);
      }
    };

    loadCart();
    window.addEventListener("cartUpdate", loadCart);
    return () => {
      window.removeEventListener("cartUpdate", loadCart);
    };
  }, [location.pathname]);

  const logout = () => {
    localStorage.clear();
    setUserId(null);
    setCartCount(0);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg tracking-tighter group-hover:bg-indigo-600 transition-colors">
            IS
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
              Irshad<span className="text-indigo-600">Store</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mt-0.5">
              Essentials
            </span>
          </div>
        </Link>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/"
            className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Explore
          </Link>

          {!isLoggedIn ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-lg shadow-xs transition"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Cart Button (Only visible when logged in) */}
              <Link
                to="/cart"
                aria-label="Shopping Cart"
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 transition group"
              >
                <svg
                  className="w-5 h-5"
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
                <span className="hidden md:inline text-sm font-semibold">
                  Bag
                </span>
                {cartCount > 0 && (
                  <span className="min-w-5 h-5 px-1.5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="h-5 w-px bg-slate-200" />

              {/* Logout Button */}
              <button
                onClick={logout}
                className="px-3.5 py-2 text-sm font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;