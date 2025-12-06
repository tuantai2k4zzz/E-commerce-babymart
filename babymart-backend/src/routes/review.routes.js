// src/routes/review.routes.js
import express from "express";
import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/reviews
 * body: { productId, rating, comment }
 * 1 user chỉ review 1 lần / product (đã set unique index)
 */
router.post("/", protect, async (req, res) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let review = await Review.findOne({ user: req.user._id, product: productId });
  if (review) {
    review.rating = rating;
    review.comment = comment;
    await review.save();
  } else {
    review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment
    });
  }

  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        total: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    product.averageRating = stats[0].avgRating;
    product.totalReviews = stats[0].total;
    await product.save();
  }

  res.status(201).json(review);
});

// GET /api/reviews/:productId
router.get("/:productId", async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "firstName lastName")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

export default router;
