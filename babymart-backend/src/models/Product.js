// src/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    brand: String,
    price: { type: Number, required: true },
    salePrice: Number,
    isOnSale: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    description: String,
    images: [String],
    tags: [String],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
