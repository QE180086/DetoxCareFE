import { FaLeaf, FaAppleAlt, FaCarrot, FaGlassWhiskey, FaListAlt, FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ComboOffers = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-green-50">
      {/* Navigation Icons */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 mb-12">
          <Link to="/search?query=" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-300 ease-in-out group">
            <div className="bg-green-100 p-4 rounded-full mb-2 group-hover:bg-green-200 group-hover:shadow-md transition-all duration-300">
              <FaGlassWhiskey className="text-2xl sm:text-3xl text-green-600" />
            </div>
            <span className="text-sm sm:text-base font-medium">Nước Detox</span>
          </Link>
          <Link to="/search?query=" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-300 ease-in-out group">
            <div className="bg-green-100 p-4 rounded-full mb-2 group-hover:bg-green-200 group-hover:shadow-md transition-all duration-300">
              <FaAppleAlt className="text-2xl sm:text-3xl text-green-600" />
            </div>
            <span className="text-sm sm:text-base font-medium">Trái Cây</span>
          </Link>
          <Link to="/search?query=" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-300 ease-in-out group">
            <div className="bg-green-100 p-4 rounded-full mb-2 group-hover:bg-green-200 group-hover:shadow-md transition-all duration-300">
              <FaCarrot className="text-2xl sm:text-3xl text-green-600" />
            </div>
            <span className="text-sm sm:text-base font-medium">Rau Củ</span>
          </Link>
          <Link to="/search?query=" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-300 ease-in-out group">
            <div className="bg-gren-100 p-4 rounded-full mb-2 group-hover:bg-green-200 group-hover:shadow-md transition-all duration-300">
              <FaLeaf className="text-2xl sm:text-3xl text-green-600" />
            </div>
            <span className="text-sm sm:text-base font-medium">Combo Detox</span>
          </Link>
          <Link to="/menu" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-300 ease-in-out group">
            <div className="bg-green-100 p-4 rounded-full mb-2 group-hover:bg-green-200 group-hover:shadow-md transition-all duration-300">
              <FaListAlt className="text-2xl sm:text-3xl text-green-600" />
            </div>
            <span className="text-sm sm:text-base font-medium">Thực Đơn</span>
          </Link>
          <Link to="/support" className="flex flex-col items-center text-green-700 hover:text-green-900 transition duration-300 ease-in-out group">
            <div className="bg-green-100 p-4 rounded-full mb-2 group-hover:bg-green-200 group-hover:shadow-md transition-all duration-300">
              <FaHeadset className="text-2xl sm:text-3xl text-green-600" />
            </div>
            <span className="text-sm sm:text-base font-medium">Tư Vấn</span>
          </Link>
        </div>
      </div>

      {/* Combo Offer Cards */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center flex items-center justify-center gap-2">
          <FaLeaf className="text-green-600" /> Ưu Đãi Đặc Biệt
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-3">COMBO DETOX MỚI</h3>
            <p className="text-gray-600 mb-4">Tiết kiệm 30% - Chỉ còn 250.000 VNĐ</p>
            <Link
              to="/products?category=combo"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 text-sm sm:text-base font-semibold shadow-md"
            >
              Mua ngay
            </Link>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-3">GIẢM 50% ĐỒ ĂN DETOX</h3>
            <p className="text-gray-600 mb-4">Áp dụng từ 15/06 - 30/06/2025</p>
            <Link
              to="/products?category=do-an"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 text-sm sm:text-base font-semibold shadow-md"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComboOffers;