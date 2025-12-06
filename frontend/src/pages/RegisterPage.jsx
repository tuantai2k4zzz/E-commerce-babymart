// src/pages/RegisterPage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import { setAuth } from "../features/auth/authSlice";
import { setCart } from "../features/cart/cartSlice";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      };
      const res = await api.post("/auth/register", payload);
      dispatch(setAuth({ user: res.data.user, token: res.data.token }));

      // Sau khi đăng ký, lấy giỏ hàng (mới) từ server
      try {
        const cartRes = await api.get("/cart");
        dispatch(setCart(cartRes.data));
      } catch {
        // bỏ qua nếu lỗi
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm p-6"
      >
        <h1 className="text-xl font-semibold mb-1 text-slate-900">
          Tạo tài khoản Babymart
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          Đăng ký tài khoản để lưu giỏ hàng, đơn hàng và wishlist của bạn.
        </p>

        <form onSubmit={onSubmit} className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Tên
              </label>
              <input
                name="firstName"
                required
                value={form.firstName}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Họ
              </label>
              <input
                name="lastName"
                required
                value={form.lastName}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={onChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={onChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={onChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 rounded-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 disabled:opacity-60"
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-500 text-center">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-pink-500 font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
