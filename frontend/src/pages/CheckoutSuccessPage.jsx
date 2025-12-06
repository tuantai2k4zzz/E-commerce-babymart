import { useSearchParams, Link } from "react-router-dom";

export default function CheckoutSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Thanh toán thành công 🎉</h1>
        <p className="text-sm text-slate-600 mb-4">
          Cảm ơn bạn đã mua hàng tại Babymart. Đơn hàng của bạn đang được xử lý.
        </p>
        {orderId && (
          <p className="text-[11px] text-slate-500 mb-6">
            Mã đơn: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <div className="flex gap-3 justify-center text-sm">
          <Link
            to="/orders"
            className="px-4 py-2 rounded-full bg-slate-900 text-white"
          >
            Xem đơn hàng
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-full bg-slate-100 text-slate-800"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
