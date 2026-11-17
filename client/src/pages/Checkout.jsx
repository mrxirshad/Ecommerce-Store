import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api/axios.js";

const Checkout = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (!userId || userId === "undefined") {
        setLoading(false);
        return;
      }

      try {
        const [addressRes, cartRes] = await Promise.all([
          api.get(`/address/${userId}`),
          api.get(`/cart/${userId}`),
        ]);

        const addressList = Array.isArray(addressRes.data)
          ? addressRes.data
          : addressRes.data?.addresses || [];

        setAddresses(addressList);
        if (addressList.length > 0) {
          setSelectedAddress(addressList[0]._id);
        }
        setCart(cartRes.data);
      } catch (error) {
        console.error("Error loading checkout data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [userId]);

  if (loading || !cart) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg font-medium animate-pulse">
          Loading checkout...
        </p>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.productId.price,
    0
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select or add a delivery address.");
      return;
    }

    // Find the full address object matching the selected ID
    const chosenAddress = addresses.find((add) => add._id === selectedAddress);
    if (!chosenAddress) {
      alert("Selected address not found.");
      return;
    }

    try {
      setPlacingOrder(true);
      const res = await api.post("/order/place", {
        userId,
        address: {
          fullName: chosenAddress.fullName,
          phone: chosenAddress.phone,
          addressLine: chosenAddress.addressLine,
          city: chosenAddress.city,
          state: chosenAddress.state,
          pincode: chosenAddress.pincode,
        },
      });

      // Reset Navbar cart badge to 0
      window.dispatchEvent(new Event("cartUpdate"));

      // Navigate to OrderSuccess page with the created order ID
      const orderId = res.data?.order?._id;
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Address Selection */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Select Delivery Address
              </h2>
              <Link
                to="/checkout-address"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                + Add New Address
              </Link>
            </div>

            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No saved addresses found. Click "+ Add New Address" above.
              </p>
            ) : (
              <div className="space-y-3">
                {addresses.map((add) => (
                  <div
                    key={add._id}
                    onClick={() => setSelectedAddress(add._id)}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedAddress === add._id
                        ? "border-blue-600 bg-blue-50/40"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">
                        {add.fullName}
                      </p>
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddress === add._id}
                        onChange={() => setSelectedAddress(add._id)}
                        className="accent-blue-600"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{add.phone}</p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {add.addressLine}, {add.city}, {add.state} - {add.pincode}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="py-4 space-y-2 text-sm">
              {items.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex justify-between text-gray-600"
                >
                  <span className="truncate pr-2">
                    {item.productId.title} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900 shrink-0">
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || items.length === 0}
              className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition cursor-pointer"
            >
              {placingOrder ? "Placing Order..." : "Place Order (COD)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;