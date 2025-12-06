import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductCard from "../components/product/ProductCard";
import { motion } from "framer-motion";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products", { params: { tag: "featured" } })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid md:grid-cols-[1.3fr_1fr] gap-6 items-center bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-500 text-white rounded-3xl px-6 py-7 shadow-lg"
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[11px] backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Baby travel essentials • New collection
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Our Baby Is <span className="underline decoration-yellow-300">On The Way</span>
          </h1>
          <p className="text-sm text-pink-50 max-w-md">
            Mua sắm trọn bộ đồ dùng cho bé yêu của bạn: xe đẩy, ghế ngồi, đồ chơi và hơn
            thế nữa – giao hàng nhanh chóng, an toàn.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <button className="px-4 py-2 rounded-full bg-white text-pink-600 font-semibold shadow-sm">
              Shop baby deals
            </button>
            <button className="px-4 py-2 rounded-full border border-white/40 text-white">
              View best sellers
            </button>
          </div>
        </div>
        <div className="hidden md:flex justify-end">
          <motion.div
            initial={{ rotate: -3, y: 10 }}
            animate={{ rotate: 0, y: 0 }}
            className="w-60 h-60 rounded-3xl bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center"
          >
            <span className="text-xs text-center text-pink-50">
              Hình minh hoạ UI baby products
              <br />
              (thay bằng banner thật của bạn sau)
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Baby travel essentials</h2>
          <span className="text-[11px] text-slate-500">Các sản phẩm nổi bật</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {products.length === 0 && (
            <p className="text-xs text-slate-500">
              Chưa có sản phẩm featured – bạn có thể thêm tag &quot;featured&quot; ở
              backend.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
