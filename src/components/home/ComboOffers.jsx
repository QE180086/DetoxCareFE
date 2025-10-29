import { FaLeaf, FaAppleAlt, FaCarrot, FaGlassWhiskey, FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ComboOffers = () => {
  return (
    <section className="py-14 bg-white">
      {/* Navigation Icons - Modern Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-16">
          {[
            { icon: <FaGlassWhiskey className="text-xl" />, label: "Sản phẩm Detox", to: "/search?query=" },
            { icon: <FaAppleAlt className="text-xl" />, label: "Gói Liệu Trình", to: "/search?query=" },
            { icon: <FaCarrot className="text-xl" />, label: "Cách dùng Detox", to: "/search?query=" },
            { icon: <FaLeaf className="text-xl" />, label: "Combo Ưu Đãi", to: "/search?query=" },
            { icon: <FaHeadset className="text-xl" />, label: "Tư Vấn", to: "/support" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex flex-col items-center text-gray-800 group p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors duration-200">
                <span className="text-green-400">{item.icon}</span>
              </div>
              <span className="text-sm font-medium text-center text-gray-700 group-hover:text-green-600 transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Combo Offer Section - Clean & Bold */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2.5 mx-auto">
            <FaLeaf className="text-green-400" />
            Ưu Đãi Đặc Biệt
          </h2>
          <div className="w-16 h-1 bg-green-400 mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Offer 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-2">GÓI THANH LỌC 3 NGÀY - RA MẮT</h3>
            <p className="text-gray-600 mb-5">Tiết kiệm 30% – Chỉ còn <span className="font-semibold text-green-600">250.000₫</span></p>
            <Link
              to="/search?query="
              className="inline-flex items-center justify-center px-5 py-2.5 bg-green-400 text-gray-900 font-semibold rounded-lg hover:bg-green-300 transition-colors duration-200 shadow-sm hover:shadow"
            >
              Dùng thử ngay
            </Link>
          </div>

          {/* Offer 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-2">GIẢM 50% NƯỚC UỐNG DETOX</h3>
            <p className="text-gray-600 mb-5">Dành riêng cho đơn hàng đầu tiên</p>
            <Link
              to="/search?query="
              className="inline-flex items-center justify-center px-5 py-2.5 bg-green-400 text-gray-900 font-semibold rounded-lg hover:bg-green-300 transition-colors duration-200 shadow-sm hover:shadow"
            >
              Xem ưu đãi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComboOffers;