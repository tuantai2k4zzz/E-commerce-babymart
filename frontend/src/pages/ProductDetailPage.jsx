import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import RatingStars from "../components/product/RatingStars";
import { useDispatch } from "react-redux";
import { setCart } from "../features/cart/cartSlice";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => setProduct(res.data));
  }, [slug]);

  useEffect(() => {
    if (product?._id) {
      api.get(`/reviews/${product._id}`).then((res) => setReviews(res.data));
    }
  }, [product]);

  const handleAddToCart = async () => {
    const res = await api.post("/cart/add", {
      productId: product._id,
      quantity: 1
    });
    dispatch(setCart(res.data));
  };

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500">
        Đang tải sản phẩm...
      </div>
    );
  }

  const price = product.salePrice ?? product.price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[1.1fr_1.2fr] gap-6">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="aspect-[4/3] bg-slate-100">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/400x300"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3">
        <div className="text-[11px] uppercase tracking-wide text-slate-400">
          {product.category}
        </div>
        <h1 className="text-xl font-semibold">{product.name}</h1>

        <div className="flex items-center gap-2 text-xs">
          <RatingStars value={product.averageRating || 0} />
          <span className="text-slate-500">
            {product.totalReviews || 0} đánh giá
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-bold text-slate-900">
            ${price.toFixed(2)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-slate-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-600 mt-2">{product.description}</p>

        <button
          onClick={handleAddToCart}
          className="mt-4 w-full rounded-full bg-slate-900 text-white py-2 text-sm font-semibold hover:bg-slate-800"
        >
          Thêm vào giỏ
        </button>

        <div className="mt-4">
          <h2 className="text-sm font-semibold mb-2">Đánh giá</h2>
          <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="border border-slate-100 rounded-xl px-3 py-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">
                    {(r.user?.firstName || "") + " " + (r.user?.lastName || "")}
                  </span>
                  <RatingStars value={r.rating} />
                </div>
                <p className="text-slate-600">{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-slate-400">Chưa có đánh giá nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
