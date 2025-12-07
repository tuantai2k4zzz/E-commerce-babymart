// src/routes/product.routes.js
import express from "express";
import { Product } from "../models/Product.js";

const router = express.Router();

/**
 * GET /api/products
 * Query:
 *  - category
 *  - sort       (default: createdAt)
 *  - order      (asc | desc, default: desc)
 *  - priceMin   (number)
 *  - priceMax   (number)
 *  - rating     (>= averageRating)
 *  - page       (default: 1)
 *  - limit      (default: 12)
 */
router.get("/", async (req, res) => {
  try {
    let {
      category,
      sort = "createdAt",
      order = "desc",
      priceMin,
      priceMax,
      rating,
      page = 1,
      limit = 12,
    } = req.query;

    // 👉 Log thử để debug khi cần
    console.log("🔎 /api/products query:", req.query);

    // Ép kiểu số cho page / limit
    page = Number(page) || 1;
    limit = Number(limit) || 12;

    // ============= BUILD FILTER =============
    const filter = {};

    // 1. Lọc theo danh mục
    if (category && category !== "") {
      filter.category = category;
    }

    // 2. Lọc theo rating
    if (rating) {
      filter.averageRating = { $gte: Number(rating) };
    }

    // 3. Lọc theo khoảng giá (TRÁNH dùng "||" nuốt mất giá trị 0)
    const min =
      priceMin !== undefined && priceMin !== "" ? Number(priceMin) : 0;
    const max =
      priceMax !== undefined && priceMax !== "" ? Number(priceMax) : 99999999;

    filter.price = {
      $gte: min,
      $lte: max,
    };

    // ============= SORT =============
    const sortOptions = {};
    sortOptions[sort] = order === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    // ============= QUERY DB =============
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    // Chỉ trả về MỘT response
    return res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ GET /api/products error:", err);
    res.status(500).json({ message: "Failed to load products" });
  }
});

export default router;
