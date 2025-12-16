import CategoriesSection from "./components/CategoriesSection";
import CategoryMarquee from "./components/CategoryMarquee";
import Hero from "./components/Hero";
import HeroSection from "./components/HeroSection";
import PhotosSection from "./components/PhotosSection";
import ProductsSection from "./components/ProductsSection";

export default function HomePage() {
  return (
    <>
      {/* <Hero /> */}
      <HeroSection />
      <CategoryMarquee />
      <CategoriesSection />
      <ProductsSection />
      <PhotosSection />
      {/* later: product grid, etc. */}
    </>
  );
}
