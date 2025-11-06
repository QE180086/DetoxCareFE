import { useEffect } from "react";
import HeroSection from "./HeroSection";
import ComboOffers from "./ComboOffers";
import ProductGrid from "./ProductGrid";
import VoucherExchange from "./VoucherExchange";
import Testimonials from "./Testimonials";

export default function Home() {
  useEffect(() => {
    // Scroll to section if URL contains a hash
    const scrollToSection = () => {
      const hash = window.location.hash;
      if (hash) {
        // Remove the # character
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          // Scroll to the element with smooth behavior
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Scroll immediately if page is already loaded
    if (document.readyState === 'loading') {
      // Page is still loading, wait for it to complete
      window.addEventListener('load', scrollToSection);
    } else {
      // Page has already loaded
      scrollToSection();
    }

    // Cleanup event listener
    return () => {
      window.removeEventListener('load', scrollToSection);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full width and height */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl space-y-12">
          <ComboOffers />
          {/* VoucherExchange will be moved outside the constrained container */}
        </div>
      </div>
      
      {/* Voucher Exchange - Full width */}
      <div id="voucher-exchange">
        <VoucherExchange />
      </div>

      {/* Remaining Content */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl space-y-12">
          <ProductGrid />
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}