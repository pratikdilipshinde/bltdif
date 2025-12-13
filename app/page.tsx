import CategoriesSection from "./components/CategoriesSection";
import CategoryMarquee from "./components/CategoryMarquee";
import Hero from "./components/Hero";
import ProductsSection from "./components/ProductsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryMarquee />
      <CategoriesSection />
      <ProductsSection />
      {/* later: product grid, etc. */}
    </>
  );
}
