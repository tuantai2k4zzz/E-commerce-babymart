// src/routes/admin.routes.js
import express from "express";
import { Order } from "../models/Order.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/admin/stats/sales
 * Thống kê doanh thu theo ngày từ các order đã paid
 */
router.get(
  "/stats/sales",
  protect,
  requireRole("admin", "manager"),
  async (req, res) => {
    const agg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(agg);
  }
);

export default router;
