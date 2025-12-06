// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";
import { setAuth } from "../features/auth/authSlice";
import { setCart } from "../features/cart/cartSlice";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: ""
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
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      dispatch(setAuth({ user: res.data.user, token: res.data.token }));

      // Sau khi login, lấy giỏ hàng từ server
      try {
        const cartRes = await api.get("/cart");
        dispatch(setCart(cartRes.data));
      } catch {
        // nếu lỗi cart thì bỏ qua, không cần chặn login
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
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
          Đăng nhập Babymart
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          Chào mừng bạn quay lại. Đăng nhập để tiếp tục mua sắm cho bé yêu.
        </p>

        <form onSubmit={onSubmit} className="space-y-3 text-sm">
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

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-500 text-center">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-pink-500 font-semibold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
