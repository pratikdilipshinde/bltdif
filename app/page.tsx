import AnnouncementBar from "./components/AnnouncementBar";
import CapsSection from "./components/CapsSection";
import CategoriesSection from "./components/CategoriesSection";
import CategoryMarquee from "./components/CategoryMarquee";
import ComingSoonSection from "./components/ComingSoonSection";
import FullWidthImageSection from "./components/FullWidthImageSection";
import Hero from "./components/Hero";
import HeroSection from "./components/HeroSection";
import InfoStrip from "./components/InfoStrip";
import NewsletterSection from "./components/NewsletterSection";
import PhotosSection from "./components/PhotosSection";
import ProductsSection from "./components/ProductsSection";
import PromotionPhoto from "./components/PromotionPhoto";
import TShirtsSection from "./components/TShirtsSection";
import TwoCardSection from "./components/TwoCardSection";


export default function HomePage() {
  return (
    <>
      {/* <Hero /> */}
      <HeroSection />
      {/* <CategoryMarquee /> */}
      <AnnouncementBar />
      <TShirtsSection />
      <CapsSection />
      <PromotionPhoto />
      {/* <CategoriesSection /> */}
      {/* <NewsletterSection /> */}
      {/* <TwoCardSection /> */}
      {/* <PhotosSection /> */}
      {/* <ProductsSection /> */}
      <InfoStrip />
      {/* later: product grid, etc. */}
    </>
  );
}
