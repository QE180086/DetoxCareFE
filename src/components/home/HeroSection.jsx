import { FaLeaf } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-r from-green-200 via-green-100 to-green-50 flex items-center justify-between px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-green-800/10 z-0"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto flex flex-col lg:flex-row items-center gap-8">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-green-800 leading-tight mb-4">
            DETOX SẠCH - SỐNG KHỎE
          </h1>
          <p className="text-lg sm:text-xl text-green-700 mb-6 max-w-md mx-auto lg:mx-0">
            Giải pháp thanh lọc cơ thể từ thiên nhiên, mang lại sức khỏe và năng lượng dồi dào.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <FaLeaf className="w-5 h-5" />
            Khám phá ngay
          </button>
        </div>

        {/* Image Content */}
        <div className="w-full lg:w-1/2">
          <img
            src="https://tpa.edu.vn/wp-content/uploads/2021/06/nuoc-detox-8-2048x1307.jpg"
            alt="Detox Juice"
            className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-xl border border-green-200 transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;