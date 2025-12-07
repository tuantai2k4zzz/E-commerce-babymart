import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  setCategory,
  setSort,
  setOrder,
  setPriceMin,
  setPriceMax,
  setRating,
  setPage,
} from "../store/productSlice";
import ProductCard from "../components/product/ProductCard";
import { useSearchParams } from "react-router-dom";

export default function ShopPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products,
    loading,
    category,
    sort,
    order,
    priceMin,
    priceMax,
    rating,
    page,
    pages,
  } = useSelector((state) => state.products);

  // 1️⃣ Load filters from URL only once
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    const urlSort = searchParams.get("sort") || "createdAt";
    const urlOrder = searchParams.get("order") || "desc";
    const urlMin = Number(searchParams.get("priceMin")) || 0;
    const urlMax = Number(searchParams.get("priceMax")) || 5000000;
    const urlRating = Number(searchParams.get("rating")) || 0;
    const urlPage = Number(searchParams.get("page")) || 1;

    dispatch(setCategory(urlCategory));
    dispatch(setSort(urlSort));
    dispatch(setOrder(urlOrder));
    dispatch(setPriceMin(urlMin));
    dispatch(setPriceMax(urlMax));
    dispatch(setRating(urlRating));
    dispatch(setPage(urlPage));

    dispatch(
      fetchProducts({
        category: urlCategory,
        sort: urlSort,
        order: urlOrder,
        priceMin: urlMin,
        priceMax: urlMax,
        rating: urlRating,
        page: urlPage,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2️⃣ Fetch when filters change
  useEffect(() => {
    setSearchParams({
      category,
      sort,
      order,
      priceMin,
      priceMax,
      rating,
      page,
    });

    dispatch(
      fetchProducts({
        category,
        sort,
        order,
        priceMin,
        priceMax,
        rating,
        page,
      })
    );
  }, [category, sort, order, priceMin, priceMax, rating, page, dispatch, setSearchParams]);

  // 3️⃣ Pagination UI
  const Pagination = () => {
    if (!pages || pages <= 1) return null;

    const items = [];
    for (let p = 1; p <= pages; p++) {
      items.push(
        <button
          key={p}
          onClick={() => dispatch(setPage(p))}
          className={`px-3 py-1 border rounded-lg text-sm ${
            page === p
              ? "bg-pink-500 text-white border-pink-500"
              : "bg-white hover:bg-slate-100 border-slate-300"
          }`}
        >
          {p}
        </button>
      );
    }

    return <div className="flex gap-2 mt-6">{items}</div>;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
      {/* LEFT SIDEBAR */}
      <aside className="bg-white rounded-2xl border border-slate-100 p-4 text-sm space-y-4 shadow-sm">
        {/* CATEGORY */}
        <div>
          <h3 className="font-semibold mb-2">Danh mục</h3>
          {["", "Baby Deals", "Best Sellers", "Baby Toys", "Toddler Clothing"].map(
            (c) => (
              <button
                key={c || "all"}
                onClick={() => dispatch(setCategory(c))}
                className={`block w-full text-left px-2 py-1 rounded-lg mb-1 ${
                  category === c
                    ? "bg-pink-100 text-pink-600"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                {c || "Tất cả"}
              </button>
            )
          )}
        </div>

        {/* SORT */}
        <div>
          <h3 className="font-semibold mb-2">Sắp xếp</h3>

          <select
            value={sort}
            onChange={(e) => dispatch(setSort(e.target.value))}
            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs"
          >
            <option value="createdAt">Mới nhất</option>
            <option value="price">Giá</option>
          </select>

          <select
            value={order}
            onChange={(e) => dispatch(setOrder(e.target.value))}
            className="mt-2 w-full border border-slate-200 rounded-lg px-2 py-1 text-xs"
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>

        {/* PRICE */}
        <div>
          <h3 className="font-semibold mb-2">Khoảng giá</h3>

          <input
            type="number"
            value={priceMin}
            onChange={(e) => dispatch(setPriceMin(Number(e.target.value)))}
            className="w-full border rounded-lg px-2 py-1 mb-2"
            placeholder="Giá tối thiểu"
          />

          <input
            type="number"
            value={priceMax}
            onChange={(e) => dispatch(setPriceMax(Number(e.target.value)))}
            className="w-full border rounded-lg px-2 py-1"
            placeholder="Giá tối đa"
          />
        </div>

        {/* RATING */}
        <div>
          <h3 className="font-semibold mb-2">Đánh giá</h3>

          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => dispatch(setRating(r))}
              className={`block w-full text-left px-2 py-1 rounded-lg mb-1 ${
                rating === r
                  ? "bg-yellow-100 text-yellow-700"
                  : "hover:bg-slate-50"
              }`}
            >
              ⭐ {r} sao trở lên
            </button>
          ))}
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <section>
        <h1 className="text-lg font-semibold mb-4">Cửa hàng</h1>

        {loading && (
          <p className="text-sm text-slate-500 animate-pulse">Đang tải...</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!loading &&
            Array.isArray(products) &&
            products.map((p) => <ProductCard key={p._id} product={p} />)}

          {!loading && Array.isArray(products) && products.length === 0 && (
            <p className="text-sm text-slate-500">Không tìm thấy sản phẩm.</p>
          )}
        </div>

        {/* PAGINATION */}
        <Pagination />
      </section>
    </div>
  );
}
