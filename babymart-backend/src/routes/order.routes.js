// src/routes/order.routes.js
import express from "express";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/orders
 * body: { shippingAddress }
 * Tạo order từ cart hiện tại, tính subtotal, shipping, tax, total
 */
router.post("/", protect, async (req, res) => {
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const subtotal = cart.subtotal;
  const shipping = subtotal > 75 ? 0 : 10; // ví dụ: free ship nếu > 75$
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    subtotal,
    shipping,
    tax,
    total,
    status: "pending",
    paymentStatus: "unpaid",
    shippingAddress
  });

  res.status(201).json(order);
});

/**
 * GET /api/orders/my
 * Lấy lịch sử đơn hàng của user hiện tại
 */
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

/**
 * GET /api/orders
 * Admin xem tất cả đơn
 */
router.get("/", protect, requireRole("admin", "manager"), async (req, res) => {
  const orders = await Order.find()
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/**
 * PUT /api/orders/:id/status
 * body: { status?, paymentStatus? }
 * Admin cập nhật trạng thái đơn
 */
router.put("/:id/status", protect, requireRole("admin", "manager"), async (req, res) => {
  const { status, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();
  res.json(order);
});

export default router;
