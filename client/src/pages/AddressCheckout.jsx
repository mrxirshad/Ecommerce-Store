import React, { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../api/axios.js";

const AddressCheckout = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const fieldLabels = {
    fullName: "Full Name",
    phone: "Phone Number",
    addressLine: "Address Line (House No., Street, Area)",
    city: "City",
    state: "State",
    pincode: "Pincode",
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    if (!userId || userId === "undefined") {
      alert("Please log in first");
      return;
    }

    try {
      await api.post("/address/add", {
        ...form,
        userId,
      });
      navigate("/checkout");
    } catch (error) {
      console.error("Error saving address:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to save address");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="font-bold text-2xl text-gray-900 mb-6">
          Delivery Address
        </h1>

        <form onSubmit={saveAddress} className="space-y-4">
          {Object.keys(form).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {fieldLabels[key]}
              </label>
              <input
                type="text"
                name={key}
                value={form[key]}
                placeholder={`Enter ${fieldLabels[key]}`}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Save Address & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressCheckout;