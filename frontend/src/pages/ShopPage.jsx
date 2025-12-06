import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductCard from "../components/product/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    api
      .get("/products", { params: { category, sort, order } })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [category, sort, order]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="bg-white rounded-2xl border border-slate-100 p-4 text-sm space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Danh mục</h3>
          {["", "Baby Deals", "Best Sellers", "Baby Toys", "Toddler Clothing"].map(
            (c) => (
              <button
                key={c || "all"}
                onClick={() => setCategory(c)}
                className={`block w-full text-left px-2 py-1 rounded-lg mb-1 ${
                  category === c
                    ? "bg-pink-50 text-pink-600"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                {c || "Tất cả"}
              </button>
            )
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Sắp xếp</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs"
          >
            <option value="createdAt">Mới nhất</option>
            <option value="price">Giá</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="mt-2 w-full border border-slate-200 rounded-lg px-2 py-1 text-xs"
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
      </aside>

      <section>
        <h1 className="text-lg font-semibold mb-4">Cửa hàng</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {products.length === 0 && (
            <p className="text-sm text-slate-500">Không tìm thấy sản phẩm.</p>
          )}
        </div>
      </section>
    </div>
  );
}
