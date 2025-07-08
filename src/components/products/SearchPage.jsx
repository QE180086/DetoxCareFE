import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Giả lập danh sách sản phẩm mở rộng
const allProducts = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  name: ['Detox Juice', 'Smoothie', 'Trà thải độc'][i % 3] + ' ' + (i + 1),
  category: ['Nước ép', 'Sinh tố', 'Trà detox'][i % 3],
  price: 8 + (i % 5),
  image: `https://th.bing.com/th/id/OIP.QBx5_pvYNd-u9gUk0GT6wgHaE8?w=226&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7`,
  rating: (Math.random() * 4 + 1).toFixed(1), // Đánh giá ngẫu nhiên từ 1.0 đến 5.0
  purchases: Math.floor(Math.random() * 1000) + 100, // Số lượt mua ngẫu nhiên từ 100 đến 1100
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
    setCurrentPage(1); // Reset trang đầu khi lọc
  }, [query, categoryFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ['Tất cả', 'Nước ép', 'Sinh tố', 'Trà detox'];

  const handleAddToCart = (product) => {
    // Giả lập thêm vào giỏ hàng
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
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.418 8.251L12 18.943l-7.417 3.298 1.418-8.251-6.001-5.822 8.332-1.151z" />
          </svg>
        ))}
        {halfStar && (
          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.5l2.834 5.743 6.166.851-4.5 4.366.667 6.085L12 17.174l-5.167 2.371.667-6.085-4.5-4.366 6.166-.851z" />
          </svg>
        )}
        {Array(emptyStars).fill().map((_, i) => (
          <svg key={i + fullStars + (halfStar ? 1 : 0)} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.822 1.418 8.251L12 18.943l-7.417 3.298 1.418-8.251-6.001-5.822 8.332-1.151z" />
          </svg>
        ))}
        <span className="ml-1 text-gray-600 text-sm">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-16">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Kết quả cho từ khóa: <span className="underline">{query}</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar danh mục */}
        <div className="md:w-1/4">
          <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setCategoryFilter(cat === 'Tất cả' ? '' : cat)}
                  className={`block w-full text-left px-4 py-2 rounded-lg ${
                    categoryFilter === cat || (cat === 'Tất cả' && categoryFilter === '')
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-green-100'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Product grid */}
        <div className="md:w-3/4 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
                >
                  {/* Link đến chi tiết */}
                  <div
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-lg font-semibold text-green-700 hover:underline">
                      {product.name}
                    </h3>
                    {renderStars(product.rating)}
                    <p className="text-gray-600 text-sm mt-1">Đã bán: {product.purchases}</p>
                  </div>
                  <p className="text-gray-600">{product.category}</p>
                  <p className="text-green-800 font-bold mt-1">${product.price}</p>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-semibold w-full md:w-auto"
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full">Không tìm thấy sản phẩm nào phù hợp.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-700 hover:bg-green-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}