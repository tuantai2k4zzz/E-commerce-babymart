import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../store/productSlice.js";

import HeroBanner from "../components/home/HeroBanner";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/product/FeaturedProducts";
import NewArrivals from "../components/home/NewArrivals";
import Brands from "../components/home/Brands";
import Testimonials from "../components/home/Testimonials";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroBanner />
      <Categories />
      <FeaturedProducts />
      <NewArrivals />
      <Brands />
      <Testimonials />
    </div>
  );
}
