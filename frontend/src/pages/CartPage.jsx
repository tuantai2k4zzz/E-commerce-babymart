import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../lib/api";
import { setCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, subtotal } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/cart")
      .then((res) => dispatch(setCart(res.data)))
      .catch(() => {});
  }, [dispatch]);

  const shipping = subtotal > 75 ? 0 : 10;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  const updateQuantity = async (productId, quantity) => {
    const res = await api.put("/cart/update", { productId, quantity });
    dispatch(setCart(res.data));
  };

  const removeItem = async (productId) => {
    const res = await api.delete(`/cart/item/${productId}`);
    dispatch(setCart(res.data));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Giỏ hàng</h1>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          <div className="bg-white rounded-2xl border border-slate-100">
            {items.map((item) => (
              <div
                key={item.product}
                className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0"
              >
                <img
                  src={item.image || "https://via.placeholder.com/64"}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    ${(item.price ?? 0).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.product)}
                    className="text-xs text-red-500 mt-1"
                  >
                    Xoá
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-7 h-7 border rounded-full"
                    onClick={() =>
                      updateQuantity(item.product, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    className="w-7 h-7 border rounded-full"
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="w-20 text-right text-sm font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 h-fit">
            <h2 className="text-sm font-semibold mb-3">Tổng đơn</h2>
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
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 w-full py-2 rounded-full bg-slate-900 text-white text-sm font-semibold"
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
