import React from "react";
import { useParams, useNavigate } from "react-router";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10 text-center">
        {/* Green Checkmark Badge */}
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-9 h-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Thank you for your purchase. Your Cash on Delivery order has been
          confirmed and is being prepared.
        </p>

        {/* Order ID Box */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Order Reference ID
          </p>
          <p className="mt-1 text-sm sm:text-base font-mono font-bold text-gray-900 break-all">
            {id}
          </p>
        </div>

        {/* Payment Method Pill */}
        <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span>Payment Mode: Cash on Delivery (COD)</span>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer shadow-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;