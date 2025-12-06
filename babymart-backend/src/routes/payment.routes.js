// src/routes/payment.routes.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { Order } from "../models/Order.js";
import { protect } from "../middleware/auth.js";

// Load env ngay trong file này
dotenv.config();

const router = express.Router();

// Lấy key Stripe từ env
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Nếu quên set key, log ra cho dễ debug
if (!stripeSecretKey) {
  console.error(
    "❌ STRIPE_SECRET_KEY is missing. Please set it in your .env file."
  );
}

// Khởi tạo Stripe (chỉ khi có key)
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

/**
 * POST /api/payments/create-checkout-session
 * body: { orderId }
 */
router.post("/create-checkout-session", protect, async (req, res) => {
  const { orderId } = req.body;

  if (!stripe) {
    return res.status(500).json({
      message: "Stripe is not configured on the server (missing API key)"
    });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      })),
      success_url: `${process.env.CLIENT_URL}/checkout/success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
      metadata: { orderId: order._id.toString() }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ message: "Stripe error" });
  }
});

export default router;
