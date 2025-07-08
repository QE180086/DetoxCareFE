import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Giả lập danh sách sản phẩm mở rộng
const allProducts = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  name: ['Detox Juice', 'Smoothie', 'Trà thải độc'][i % 3] + ' ' + (i + 1),
  category: ['Nước ép', 'Sinh tố', 'Trà detox'][i % 3],
  price: 8 + (i % 5),
  image: `https://th.bing.com/th/id/OIP.QBx5_pvYNd-u9gUk0GT6wgHaE8?w=226&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7`,
  description: `Mô tả sản phẩm ${['Detox Juice', 'Smoothie', 'Trà thải độc'][i % 3]} ${i + 1}. Sản phẩm này giúp thanh lọc cơ thể và cung cấp dinh dưỡng tự nhiên.`,
  stock: 10 + (i % 5),
}));

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = allProducts.find((p) => p.id === parseInt(id));
    if (!foundProduct) {
      navigate('/'); // Chuyển về trang chủ nếu không tìm thấy
    } else {
      setProduct(foundProduct);
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
  };

  if (!product) return <div className="min-h-screen bg-gray-50 py-8 px-4 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-16">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Hình ảnh sản phẩm */}
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl shadow-md hover:shadow-lg transition"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-2">Danh mục: {product.category}</p>
            <p className="text-2xl text-green-800 font-bold mb-4">${product.price}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-gray-600 mb-4">Số lượng tồn kho: {product.stock}</p>
          </div>
          <div>
            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-lg font-semibold shadow-md hover:shadow-lg"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-lg font-semibold"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}