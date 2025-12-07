import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="w-full h-[480px] bg-gradient-to-r from-pink-300 via-rose-200 to-orange-200 rounded-2xl overflow-hidden mb-12">
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Baby essentials for your little angels
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Premium baby products for your everyday needs.
          </p>
          <button className="px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition">
            Shop Now
          </button>
        </motion.div>

        <motion.img
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src="https://www.bing.com/th/id/OIP.e_J6qSjtapAbB10OUIZehQHaHq?w=204&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&pid=3.1&rm=2&ucfimg=1"
          className="h-[390px] object-contain hidden md:block"
        />
      </div>
    </section>
  );
}
