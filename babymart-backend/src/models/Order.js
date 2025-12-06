// src/models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "completed", "cancelled"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid"
    },
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      country: String,
      postalCode: String
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
