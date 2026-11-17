import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api/axios.js";

const Cart = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    if (!userId || userId === "undefined") {
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  const removeItem = async (productId) => {
    try {
      await api.post(`/cart/remove`, { userId, productId });
      await loadCart();
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updateQty = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }
    try {
      await api.post(`/cart/update`, { userId, productId, quantity });
      await loadCart();
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg font-medium animate-pulse">
          Loading your cart...
        </p>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <span className="text-sm text-gray-500 font-medium">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 transition"
                >
                  {/* Product Image & Details */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-20 h-20 shrink-0 bg-gray-50 border border-gray-100 rounded-lg p-2 flex items-center justify-center">
                      <img
                        src={item.productId.image}
                        alt={item.productId.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${item.productId._id}`}
                        className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition block truncate"
                      >
                        {item.productId.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Unit Price: ${Number(item.productId.price).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId._id)}
                        className="mt-2 text-xs font-medium text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity Controls & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQty(item.productId._id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-800 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.productId._id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-28 text-right">
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        ${(item.productId.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Checkout Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-6">
              <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="py-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout-address")}
                className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer shadow-sm"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-800 transition"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;