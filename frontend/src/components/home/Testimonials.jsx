import { motion } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    { name: "Sarah", text: "Amazing baby products! Highly recommended." },
    { name: "Alex", text: "Fast delivery and premium quality." },
    { name: "Mia", text: "My kids love everything from this shop!" },
  ];

  return (
    <section className="my-12">
      <h2 className="text-xl font-bold mb-6">What Customers Say</h2>

      <div className="grid gap-5 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-xl shadow border"
          >
            <p className="italic mb-3">{r.text}</p>
            <h4 className="font-bold">{r.name}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
