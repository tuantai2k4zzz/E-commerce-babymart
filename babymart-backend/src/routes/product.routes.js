// src/routes/product.routes.js
import express from "express";
import { Product } from "../models/Product.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/products
 * Query:
 *   category, search, sort (price|createdAt), order (asc|desc), minPrice, maxPrice, tag
 */
router.get("/", async (req, res) => {
  const {
    category,
    search,
    sort = "createdAt",
    order = "desc",
    minPrice,
    maxPrice,
    tag
  } = req.query;

  const query = {};
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (search) query.name = { $regex: search, $options: "i" };

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortOption = { [sort]: order === "asc" ? 1 : -1 };

  const products = await Product.find(query).sort(sortOption);
  res.json(products);
});

// GET /api/products/:slug
router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST /api/products (admin, manager)
router.post("/", protect, requireRole("admin", "manager"), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Create product failed", error: err.message });
  }
});

// PUT /api/products/:id
router.put("/:id", protect, requireRole("admin", "manager"), async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// DELETE /api/products/:id
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Deleted" });
});

export default router;
