import { motion } from "framer-motion";

const categories = [
  { title: "Baby Boy", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScFudJd4ABwzchAB74Fl8z9rDCLp0feGLX-Jnzq7WktuN0_96_xIIWEL_v-GHLthMSME8&usqp=CAU" },
  { title: "Baby Girl", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWeA0H9TbrxcNpFz1cwUjDT1ILAUU6idTvhWymP19tu6RF-vrNZiOX9FqBhRs5dJmB2o8&usqp=CAU" },
  { title: "New Born", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx-CmamRLS0X6Z8e9Elf6JtBFHaiJEce318iKB5ZxsESSRI3fEhl-JJqDQJvafz2QYF9g&usqp=CAU" },
  { title: "Toys", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlH8IoIE0FCRlXqHYjXEvTkJJ6_hEBr9MQ9LyGcTjh7Dlnj9_oxj_7VHu1gRWteRweXo0&usqp=CAU" },
];

export default function Categories() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.06 }}
            className="p-5 bg-white rounded-2xl shadow-sm cursor-pointer text-center border"
          >
            <img src={cat.image} className="h-60 mx-auto mb-3h-60 w-full object-contain mx-auto mb-3" />
            <p className="font-semibold">{cat.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
