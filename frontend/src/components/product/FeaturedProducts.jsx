import ProductSlider from "../home/ProductSlider";
import { useSelector } from "react-redux";

export default function FeaturedProducts() {
  const { products } = useSelector((s) => s.products);
  const featured = products.filter((p) => p.tags?.includes("featured"));

  return <ProductSlider title="Featured Products" products={featured} />;
}
