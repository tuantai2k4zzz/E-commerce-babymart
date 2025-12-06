import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import api from "../../lib/api";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Chào bạn 👋 Mình là trợ lý Babymart. Bạn muốn tìm sản phẩm hoặc hỏi gì về đơn hàng?"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/chatbot", { message: userMessage.text });
      setMessages((prev) => [...prev, { from: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Xin lỗi, chatbot đang gặp vấn đề, hãy thử lại sau!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-5 right-4 z-40 w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-xl"
      >
        <FiMessageCircle className="text-lg" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-40 w-[320px] max-h-[480px] rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-900 text-white">
              <div className="text-xs">
                <div className="font-semibold">Babymart Assistant</div>
                <div className="text-[10px] text-slate-300">
                  Trợ lý mua sắm thông minh cho mẹ & bé
                </div>
              </div>
              <button onClick={() => setOpen(false)}>
                <FiX className="text-xs" />
              </button>
            </div>

            <div className="flex-1 p-3 space-y-2 overflow-y-auto text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={
                    "flex " + (m.from === "user" ? "justify-end" : "justify-start")
                  }
                >
                  <div
                    className={
                      "max-w-[80%] rounded-2xl px-3 py-2 " +
                      (m.from === "user"
                        ? "bg-pink-500 text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-800 rounded-bl-sm")
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-[10px] text-slate-400">Đang soạn trả lời...</div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="border-t border-slate-100 flex items-center gap-2 px-2 py-1.5 bg-slate-50"
            >
              <input
                className="flex-1 text-xs px-2 py-1 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
                placeholder="Nhập câu hỏi..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center text-[11px]"
              >
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
