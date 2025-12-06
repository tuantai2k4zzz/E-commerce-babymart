// src/routes/wishlist.routes.js
import express from "express";
import { Wishlist } from "../models/Wishlist.js";
import { Product } from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/wishlist
router.get("/", protect, async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products"
  );
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }
  res.json(wishlist);
});

// POST /api/wishlist/add
// body: { productId }
router.post("/add", protect, async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

  if (!wishlist.products.some((p) => p.toString() === productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  await wishlist.populate("products");
  res.json(wishlist);
});

// DELETE /api/wishlist/:productId
router.delete("/:productId", protect, async (req, res) => {
  const { productId } = req.params;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== productId
  );
  await wishlist.save();
  await wishlist.populate("products");
  res.json(wishlist);
});

export default router;
