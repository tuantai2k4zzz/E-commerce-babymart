// src/pages/AdminDashboardPage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboardPage() {
  const { user } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState("sales");

  // sales
  const [stats, setStats] = useState([]);

  // products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productForm, setProductForm] = useState({
    _id: "",
    name: "",
    slug: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    isOnSale: false,
    stock: "",
    description: "",
    imageUrl: "",
    tags: ""
  });
  const [productError, setProductError] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  // ==== CHECK QUYỀN ADMIN ====
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-slate-600">
        Bạn không có quyền truy cập trang này.  
        Hãy đăng nhập bằng tài khoản admin/manager (hoặc chỉnh role user trong DB).
      </div>
    );
  }

  // ==== LOAD SALES STATS ====
  useEffect(() => {
    api
      .get("/admin/stats/sales")
      .then((res) => setStats(res.data))
      .catch(() => setStats([]));
  }, []);

  const salesData = stats.map((s) => ({
    date: s._id,
    revenue: s.totalSales,
    orders: s.totalOrders
  }));

  // ==== LOAD PRODUCTS ====
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  // ==== FORM HANDLERS ====
  const onProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const resetProductForm = () => {
    setProductForm({
      _id: "",
      name: "",
      slug: "",
      category: "",
      brand: "",
      price: "",
      salePrice: "",
      isOnSale: false,
      stock: "",
      description: "",
      imageUrl: "",
      tags: ""
    });
    setProductError("");
  };

  const handleEditProduct = (p) => {
    setProductForm({
      _id: p._id,
      name: p.name || "",
      slug: p.slug || "",
      category: p.category || "",
      brand: p.brand || "",
      price: p.price?.toString() || "",
      salePrice: p.salePrice?.toString() || "",
      isOnSale: p.isOnSale || false,
      stock: p.stock?.toString() || "",
      description: p.description || "",
      imageUrl: p.images?.[0] || "",
      tags: (p.tags || []).join(",")
    });
    setProductError("");
    setActiveTab("products");
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá sản phẩm này?")) return;
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Xoá sản phẩm thất bại");
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setProductError("");
    setSavingProduct(true);
    try {
      const payload = {
        name: productForm.name,
        slug: productForm.slug,
        category: productForm.category,
        brand: productForm.brand || undefined,
        price: Number(productForm.price),
        salePrice: productForm.salePrice ? Number(productForm.salePrice) : undefined,
        isOnSale: productForm.isOnSale,
        stock: Number(productForm.stock || 0),
        description: productForm.description,
        images: productForm.imageUrl ? [productForm.imageUrl] : [],
        tags: productForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      };

      if (productForm._id) {
        // update
        await api.put(`/products/${productForm._id}`, payload);
      } else {
        // create
        await api.post("/products", payload);
      }

      await fetchProducts();
      resetProductForm();
    } catch (err) {
      setProductError(err.response?.data?.message || "Lưu sản phẩm thất bại");
    } finally {
      setSavingProduct(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Admin dashboard</h1>
          <p className="text-xs text-slate-500">
            Xin chào {user.firstName}, quản lý cửa hàng Babymart tại đây.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-2 py-1 rounded-full bg-slate-900 text-white">
            {user.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
        <button
          onClick={() => setActiveTab("sales")}
          className={
            "px-3 py-1.5 rounded-full " +
            (activeTab === "sales"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500")
          }
        >
          Sales
        </button>
        <button
          onClick={() => {
            setActiveTab("products");
          }}
          className={
            "px-3 py-1.5 rounded-full " +
            (activeTab === "products"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500")
          }
        >
          Products
        </button>
      </div>

      {/* TAB SALES */}
      {activeTab === "sales" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="text-[11px] text-slate-500 mb-1">Ngày gần nhất</div>
              <div className="text-xl font-bold">
                {salesData.length > 0
                  ? `$${salesData[salesData.length - 1].revenue.toFixed(2)}`
                  : "--"}
              </div>
              <div className="text-[11px] text-slate-400">
                Doanh thu từ order đã thanh toán
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="text-[11px] text-slate-500 mb-1">Tổng đơn đã trả</div>
              <div className="text-xl font-bold">
                {salesData.reduce((sum, d) => sum + d.orders, 0)}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="text-[11px] text-slate-500 mb-1">Tổng doanh thu</div>
              <div className="text-xl font-bold">
                $
                {salesData
                  .reduce((sum, d) => sum + d.revenue, 0)
                  .toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 h-64">
            <div className="text-sm font-semibold mb-2">Doanh thu theo ngày</div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB PRODUCTS */}
      {activeTab === "products" && (
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-6 items-start">
          {/* LIST */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-sm font-semibold">Danh sách sản phẩm</h2>
              <button
                onClick={resetProductForm}
                className="text-[11px] px-3 py-1 rounded-full bg-slate-100 text-slate-700"
              >
                + Thêm mới
              </button>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="min-w-full">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Tên</th>
                    <th className="px-3 py-2 text-left">Danh mục</th>
                    <th className="px-3 py-2 text-right">Giá</th>
                    <th className="px-3 py-2 text-center">Kho</th>
                    <th className="px-3 py-2 text-center">Sale</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingProducts && (
                    <tr>
                      <td colSpan={6} className="px-3 py-3 text-center text-slate-400">
                        Đang tải sản phẩm...
                      </td>
                    </tr>
                  )}
                  {!loadingProducts && products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-3 text-center text-slate-400">
                        Chưa có sản phẩm nào.
                      </td>
                    </tr>
                  )}
                  {!loadingProducts &&
                    products.map((p) => (
                      <tr key={p._id} className="border-t">
                        <td className="px-3 py-2">
                          <div className="font-medium text-slate-800">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.slug}</div>
                        </td>
                        <td className="px-3 py-2">{p.category}</td>
                        <td className="px-3 py-2 text-right">
                          ${p.price?.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-center">{p.stock}</td>
                        <td className="px-3 py-2 text-center">
                          {p.isOnSale ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              On sale
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                              Normal
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="text-[11px] text-blue-600 mr-2"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="text-[11px] text-red-500"
                          >
                            Xoá
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 text-xs"
          >
            <h2 className="text-sm font-semibold mb-1">
              {productForm._id ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">
                  Tên sản phẩm
                </label>
                <input
                  name="name"
                  value={productForm.name}
                  onChange={onProductChange}
                  required
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">
                  Slug (URL)
                </label>
                <input
                  name="slug"
                  value={productForm.slug}
                  onChange={onProductChange}
                  required
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="vd: baby-travel-stroller-lite"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">
                  Danh mục
                </label>
                <input
                  name="category"
                  value={productForm.category}
                  onChange={onProductChange}
                  required
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5"
                  placeholder="Baby Deals / Baby Toys / ..."
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">
                  Thương hiệu
                </label>
                <input
                  name="brand"
                  value={productForm.brand}
                  onChange={onProductChange}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">
                  Giá gốc
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={onProductChange}
                  required
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">
                  Giá sale
                </label>
                <input
                  name="salePrice"
                  type="number"
                  step="0.01"
                  value={productForm.salePrice}
                  onChange={onProductChange}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">
                  Số lượng kho
                </label>
                <input
                  name="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={onProductChange}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5"
                />
              </div>
              <div className="flex items-center mt-5">
                <input
                  id="isOnSale"
                  name="isOnSale"
                  type="checkbox"
                  checked={productForm.isOnSale}
                  onChange={onProductChange}
                  className="mr-2"
                />
                <label
                  htmlFor="isOnSale"
                  className="text-[11px] text-slate-600"
                >
                  Đang sale
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-1">
                Ảnh (URL)
              </label>
              <input
                name="imageUrl"
                value={productForm.imageUrl}
                onChange={onProductChange}
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-1">
                Tags (ngăn cách bởi dấu phẩy)
              </label>
              <input
                name="tags"
                value={productForm.tags}
                onChange={onProductChange}
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5"
                placeholder="featured, travel, stroller"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={productForm.description}
                onChange={onProductChange}
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
              />
            </div>

            {productError && (
              <p className="text-[11px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {productError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingProduct}
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-60"
              >
                {savingProduct
                  ? "Đang lưu..."
                  : productForm._id
                  ? "Cập nhật sản phẩm"
                  : "Thêm sản phẩm"}
              </button>
              <button
                type="button"
                onClick={resetProductForm}
                className="px-3 py-2 rounded-full bg-slate-100 text-slate-700 text-xs"
              >
                Reset form
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
