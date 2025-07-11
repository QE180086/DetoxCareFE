import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaLeaf } from 'react-icons/fa';

// Giả lập danh sách sản phẩm mở rộng
const allProducts = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  name: ['Detox Juice', 'Smoothie', 'Trà thải độc'][i % 3] + ' ' + (i + 1),
  category: ['Nước ép', 'Sinh tố', 'Trà detox'][i % 3],
  price: (8 + (i % 5)) * 23000, // Convert USD to VNĐ (1 USD ~ 23,000 VNĐ)
  image: `https://file.hstatic.net/200000240163/article/nuoc_detox_chanh_676db881894d48ab9c0fcbdb1c5cdf6c_1024x1024.jpg`,
  rating: (Math.random() * 4 + 1).toFixed(1),
  purchases: Math.floor(Math.random() * 1000) + 100,
}));

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query')?.toLowerCase() || '';

  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    let result = allProducts.filter((p) =>
      p.name.toLowerCase().includes(query)
    );
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [query, categoryFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ['Tất cả', 'Nước ép', 'Sinh tố', 'Trà detox'];

  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Hàm tạo sao đánh giá
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {Array(fullStars).fill().map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.418 8.251L12 18.943l-7.417 3.298 1.418-8.251-6.001-5.822 8.332-1.151z" />
          </svg>
        ))}
        {halfStar && (
          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.5l2.834 5.743 6.166.851-4.5 4.366.667 6.085L12 17.174l-5.167 2.371.667-6.085-4.5-4.366 6.166-.851z" />
          </svg>
        )}
        {Array(emptyStars).fill().map((_, i) => (
          <svg key={i + fullStars + (halfStar ? 1 : 0)} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.418 8.251L12 18.943l-7.417 3.298 1.418-8.251-6.001-5.822 8.332-1.151z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600 text-sm">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-green-800 mb-8 flex items-center gap-2">
          <FaLeaf className="text-green-600" />
          Kết quả tìm kiếm: <span className="underline decoration-green-500">{query || 'Tất cả'}</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar danh mục */}
          <div className="lg:w-1/4 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Danh Mục Sản Phẩm</h2>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategoryFilter(cat === 'Tất cả' ? '' : cat)}
                    className={`w-full text-left px-4 py-2 rounded-full text-sm font-medium transition ${
                      categoryFilter === cat || (cat === 'Tất cả' && categoryFilter === '')
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product grid */}
          <div className="lg:w-3/4 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1"
                  >
                    <div
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4 border border-green-200"
                      />
                      <h3 className="text-xl font-semibold text-green-700 hover:underline mb-2">
                        {product.name}
                      </h3>
                      {renderStars(product.rating)}
                      <p className="text-gray-600 text-sm mt-2">Đã bán: {product.purchases}</p>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{product.category}</p>
                    <p className="text-green-800 font-bold text-lg mt-2">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all text-sm font-semibold shadow-md"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center text-lg">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    currentPage === 1
                      ? 'bg-green-200 text-green-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      currentPage === i + 1
                        ? 'bg-green-700 text-white'
                        : 'bg-white text-green-700 border border-green-500 hover:bg-green-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    currentPage === totalPages
                      ? 'bg-green-200 text-green-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}