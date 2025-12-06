import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductCard from "../components/product/ProductCard";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(null);

  useEffect(() => {
    api
      .get("/wishlist")
      .then((res) => setWishlist(res.data))
      .catch(() => setWishlist({ products: [] }));
  }, []);

  const products = wishlist?.products || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold mb-4">Danh sách yêu thích</h1>
      {products.length === 0 ? (
        <p className="text-sm text-slate-500">
          Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
