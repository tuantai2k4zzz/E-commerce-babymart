import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../../features/auth/authSlice";
import { FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";

export default function Header() {
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-purple-500 shadow-md" />
          <div className="leading-tight">
            <div className="font-bold text-lg text-slate-900">Babymart</div>
            <div className="text-[11px] text-slate-500">
              Baby care • Toys • Fashion
            </div>
          </div>
        </motion.div>

        <div className="hidden md:flex flex-1 mx-6">
          <input
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/70 shadow-sm"
            placeholder="Tìm kiếm sản phẩm cho bé..."
          />
        </div>

        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/shop"
            className="hidden md:inline-flex px-3 py-1.5 rounded-full hover:bg-slate-100 text-slate-700"
          >
            Shop
          </Link>
          <Link
            to="/wishlist"
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-pink-50 text-pink-500"
          >
            <FiHeart />
          </Link>

          <button
            onClick={() => navigate("/cart")}
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-700"
          >
            <FiShoppingCart />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] rounded-full px-1.5 py-[1px]">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" || user.role === "manager" ? (
                <Link
                  to="/admin"
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 hidden md:inline-flex"
                >
                  Admin
                </Link>
              ) : null}
              <button
                onClick={() => dispatch(logout())}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Đăng xuất ({user.firstName})
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-500 text-white text-xs font-semibold hover:bg-pink-600 shadow-sm"
            >
              <FiUser className="text-[13px]" />
              <span>Đăng nhập</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
