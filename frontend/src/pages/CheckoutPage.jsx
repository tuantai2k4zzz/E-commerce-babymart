import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../lib/api";
import { resetCart } from "../features/cart/cartSlice";

export default function CheckoutPage() {
  const { items, subtotal } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    country: "",
    postalCode: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const shipping = subtotal > 75 ? 0 : 10;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  const onChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // tạo order
      const orderRes = await api.post("/orders", {
        shippingAddress: address
      });
      // tạo stripe session
      const payRes = await api.post("/payments/create-checkout-session", {
        orderId: orderRes.data._id
      });
      dispatch(resetCart());
      window.location.href = payRes.data.url;
    } catch (err) {
      setError(err.response?.data?.message || "Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500">
        Giỏ hàng trống, hãy thêm sản phẩm trước khi thanh toán.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[2fr_1fr] gap-6 items-start">
      <form
        onSubmit={handleCheckout}
        className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 text-sm"
      >
        <h1 className="text-lg font-semibold mb-2">Địa chỉ giao hàng</h1>
        {["fullName", "street", "city", "country", "postalCode"].map((field) => (
          <div key={field}>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              {field === "fullName"
                ? "Tên người nhận"
                : field === "street"
                ? "Địa chỉ"
                : field === "city"
                ? "Thành phố"
                : field === "country"
                ? "Quốc gia"
                : "Mã bưu điện"}
            </label>
            <input
              name={field}
              value={address[field]}
              onChange={onChange}
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        ))}
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-2 rounded-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Thanh toán với Stripe"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-3">Tóm tắt đơn hàng</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Vận chuyển</span>
            <span>{shipping === 0 ? "Miễn phí" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Thuế</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Tổng cộng</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
