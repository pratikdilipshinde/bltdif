import AnnouncementBar from "./components/AnnouncementBar";
import CapsSection from "./components/CapsSection";
import CategoriesSection from "./components/CategoriesSection";
import CategoryMarquee from "./components/CategoryMarquee";
import ComingSoonSection from "./components/ComingSoonSection";
import CustomerReviews from "./components/CustomerReviews";
import FullWidthImageSection from "./components/FullWidthImageSection";
import Hero from "./components/Hero";
import HeroSection from "./components/HeroSection";
import InfoStrip from "./components/InfoStrip";
import NewsletterSection from "./components/NewsletterSection";
import PhotosSection from "./components/PhotosSection";
import ProductsSection from "./components/ProductsSection";
import PromotionPhoto from "./components/PromotionPhoto";
import TshirtPromotion from "./components/TshirtPromotion";
import CapPromotion from "./components/CapPromotion";
import TShirtsSection from "./components/TShirtsSection";
import TwoCardSection from "./components/TwoCardSection";
import HoodiesSection from "./components/HoodiesSection";


export default function HomePage() {
  return (
    <>
      {/* <Hero /> */}
      <AnnouncementBar />
      <HeroSection />
      {/* <CategoryMarquee /> */}
      
      <HoodiesSection />
      <TshirtPromotion />
      <TShirtsSection />
      <CapPromotion />
      <CapsSection />
      {/* <PromotionPhoto /> */}
      {/* <CategoriesSection /> */}
      {/* <NewsletterSection /> */}
      {/* <TwoCardSection /> */}
      {/* <PhotosSection /> */}
      {/* <ProductsSection /> */}
      {/* <CustomerReviews /> */}
      <InfoStrip />
      {/* later: product grid, etc. */}
    </>
  );
}
