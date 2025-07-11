import HeroSection from "./HeroSection";
import ComboOffers from "./ComboOffers";
import ProductGrid from "./ProductGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-green-50 to-white">
      {/* Main Content */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl space-y-12">
          <HeroSection />
          <ComboOffers />
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}