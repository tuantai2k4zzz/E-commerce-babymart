import { useEffect, useState } from "react";
import api from "../lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold mb-4">Đơn hàng của tôi</h1>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="py-2 px-3 text-left">Mã</th>
              <th className="py-2 px-3 text-left">Ngày</th>
              <th className="py-2 px-3 text-center">Sản phẩm</th>
              <th className="py-2 px-3 text-right">Tổng</th>
              <th className="py-2 px-3 text-center">Trạng thái</th>
              <th className="py-2 px-3 text-center">Thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="py-2 px-3 font-mono text-[11px]">
                  {o._id.slice(-8)}
                </td>
                <td className="py-2 px-3">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-3 text-center">{o.items.length}</td>
                <td className="py-2 px-3 text-right font-semibold">
                  ${o.total.toFixed(2)}
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5">
                    {o.status}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={
                      "inline-flex rounded-full px-2 py-0.5 " +
                      (o.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700")
                    }
                  >
                    {o.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 px-3 text-sm text-slate-500">
                  Bạn chưa có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
