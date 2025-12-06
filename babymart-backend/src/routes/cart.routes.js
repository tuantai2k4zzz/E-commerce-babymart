// src/routes/cart.routes.js
import express from "express";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const calcSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

/**
 * GET /api/cart
 * Lấy hoặc khởi tạo giỏ hàng cho user hiện tại
 */
router.get("/", protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], subtotal: 0 });
  }
  res.json(cart);
});

/**
 * POST /api/cart/add
 * body: { productId, quantity }
 * Thêm sản phẩm vào giỏ hoặc tăng số lượng
 */
router.post("/add", protect, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [], subtotal: 0 });

  const existing = cart.items.find(
    (item) => item.product.toString() === productId
  );

  const price = product.salePrice ?? product.price;
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price,
      image: product.images?.[0] || "",
      quantity
    });
  }

  cart.subtotal = calcSubtotal(cart.items);
  await cart.save();
  res.json(cart);
});

/**
 * PUT /api/cart/update
 * body: { productId, quantity }
 * Cập nhật số lượng 1 item (quantity <= 0 sẽ xoá)
 */
router.put("/update", protect, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ message: "productId is required" });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  cart.subtotal = calcSubtotal(cart.items);
  await cart.save();
  res.json(cart);
});

/**
 * DELETE /api/cart/item/:productId
 * Xoá 1 item khỏi giỏ
 */
router.delete("/item/:productId", protect, async (req, res) => {
  const { productId } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  cart.subtotal = calcSubtotal(cart.items);
  await cart.save();
  res.json(cart);
});

/**
 * DELETE /api/cart/clear
 * Xoá sạch giỏ hàng
 */
router.delete("/clear", protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [], subtotal: 0 });

  cart.items = [];
  cart.subtotal = 0;
  await cart.save();
  res.json(cart);
});

export default router;
