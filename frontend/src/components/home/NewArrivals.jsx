import ProductSlider from "./ProductSlider";
import { useSelector } from "react-redux";

export default function NewArrivals() {
  const { products } = useSelector((s) => s.products);
  const sorted = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return <ProductSlider title="New Arrivals" products={sorted.slice(0, 10)} />;
}
