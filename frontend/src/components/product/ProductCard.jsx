import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiHeart } from "react-icons/fi";
import RatingStars from "./RatingStars";
import api from "../../lib/api";
import { useDispatch } from "react-redux";
import { setCart } from "../../features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    const res = await api.post("/cart/add", {
      productId: product._id,
      quantity: 1
    });
    dispatch(setCart(res.data));
  };

  const handleWishlist = async () => {
    try {
      await api.post("/wishlist/add", { productId: product._id });
    } catch {
      // bỏ qua handling phức tạp, FE hiển thị toast sau cũng được
    }
  };

  const price = product.salePrice ?? product.price;

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(15,23,42,0.1)" }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col"
    >
      <Link to={`/product/${product.slug}`} className="relative block">
        <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/300x240"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        {product.isOnSale && (
          <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-orange-500 text-white">
            Sale
          </span>
        )}
      </Link>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="text-[11px] uppercase tracking-wide text-slate-400">
          {product.category}
        </div>
        <Link
          to={`/product/${product.slug}`}
          className="text-[13px] font-semibold text-slate-900 line-clamp-2"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <RatingStars value={product.averageRating || 4.5} />
            <span className="text-[10px] text-slate-400">
              ({product.totalReviews || 0})
            </span>
          </div>
          {product.brand && (
            <span className="text-[10px] text-slate-400">{product.brand}</span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-slate-900">
              ${price.toFixed(2)}
            </span>
            {product.salePrice && (
              <span className="text-[11px] text-slate-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 text-white text-[11px] py-1.5 hover:bg-slate-800"
          >
            <FiShoppingBag className="text-[13px]" />
            Add to cart
          </button>
          <button
            onClick={handleWishlist}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-pink-400 hover:text-pink-500"
          >
            <FiHeart />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
