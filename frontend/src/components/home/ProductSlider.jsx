import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { motion } from "framer-motion";
import ProductCard from "../product/ProductCard"; // Bé nhớ có file này

export default function ProductSlider({ title, products }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <Swiper slidesPerView={2} spaceBetween={15} breakpoints={{
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}>
        {products?.map((p) => (
          <SwiperSlide key={p._id}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <ProductCard product={p} />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
