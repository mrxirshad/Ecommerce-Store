import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api/axios.js";

const Login = () => {
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);

      setIsError(false);
      setMsg("Welcome back! Redirecting to store...");
      window.dispatchEvent(new Event("cartUpdate"));

      setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (error) {
      setIsError(true);
      setMsg(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8 sm:p-10">
        {/* Brand Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl tracking-tighter mb-3 shadow-xs">
            IS
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to access your bag and saved addresses
          </p>
        </div>

        {/* Status Alert */}
        {msg && (
          <div
            className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border flex items-center gap-2 ${
              isError
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <span>{isError ? "⚠️" : "✓"}</span>
            <span>{msg}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 pr-16 bg-slate-50/60 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-600 disabled:bg-slate-400 transition-colors cursor-pointer shadow-xs"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-7 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            New to IrshadStore?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;