import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
      },
    ],
    address: {
      fullName: String,
      phone: String,
      addressLine: String, // ✅ Fixed spelling ('addressLine')
      city: String,
      state: String,
      pincode: String,
    },
    totalAmount: Number, // ✅ Consistent singular naming
    paymentMethod: {
      type: String,
      default: "COD",
    },
    status: {
      type: String, // ✅ Added missing 'type: String'
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);