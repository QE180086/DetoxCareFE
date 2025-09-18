import HeroSection from "./HeroSection";
import ComboOffers from "./ComboOffers";
import ProductGrid from "./ProductGrid";
import VoucherExchange from "./VoucherExchange";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full width and height */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl space-y-12">
          <VoucherExchange />
          <ComboOffers />
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}