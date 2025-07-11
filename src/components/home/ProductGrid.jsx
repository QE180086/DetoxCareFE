import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

const ProductGrid = () => {
  const products = [
    {
      name: "Nước Detox Táo Xanh",
      price: 45000,
      image: "https://file.hstatic.net/200000240163/article/nuoc_detox_chanh_676db881894d48ab9c0fcbdb1c5cdf6c_1024x1024.jpg",
    },
    {
      name: "Nước Detox Chanh Leo",
      price: 45000,
      image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/cach-pha-che-detox-chanh-dua-leo.jpg",
    },
    {
      name: "Combo 3 Ngày Detox",
      price: 280000,
      image: "https://i1-suckhoe.vnecdn.net/2025/05/29/tra-quat-mat-ong-1748487492-6164-1748487528.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=A4N3puvncI_bfPCN7OhQzA",
    },
    {
      name: "Nước Detox Cà Mướp",
      price: 45000,
      image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg",
    },
    {
      name: "Combo 7 Ngày Thanh Lọc",
      price: 280000,
      image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/cach-pha-che-detox-chanh-dua-leo.jpg",
    },
    {
      name: "Nước Detox Cà Đen",
      price: 45000,
      image: "https://i1-suckhoe.vnecdn.net/2025/05/29/tra-quat-mat-ong-1748487492-6164-1748487528.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=A4N3puvncI_bfPCN7OhQzA",
    },
    {
      name: "Combo Rau Củ Detox",
      price: 280000,
      image: "https://i1-suckhoe.vnecdn.net/2025/05/29/tra-quat-mat-ong-1748487492-6164-1748487528.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=A4N3puvncI_bfPCN7OhQzA",
    },
    {
      name: "Nước Detox Cà Rốt",
      price: 45000,
      image: "https://i1-suckhoe.vnecdn.net/2025/05/29/tra-quat-mat-ong-1748487492-6164-1748487528.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=A4N3puvncI_bfPCN7OhQzA",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white to-green-50">
      <h2 className="text-3xl font-extrabold text-green-800 text-center mb-8 flex items-center justify-center gap-2">
        <FaLeaf className="text-green-600" /> Sản Phẩm Nổi Bật
      </h2>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 border border-green-100"
          >
            <Link to={`/product/${index + 1}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4 border border-green-200"
              />
              <h3 className="text-lg font-semibold text-green-700 hover:underline mb-2">{product.name}</h3>
            </Link>
            <p className="text-green-800 font-bold text-lg mb-3">{product.price.toLocaleString('vi-VN')} VNĐ</p>
            <Link
              to={`/product/${index + 1}`}
              className="block w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all text-sm font-semibold text-center shadow-md"
            >
              Thêm vào giỏ
            </Link>
          </div>
        ))}
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center mt-8">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl"
        >
          <FaLeaf className="w-5 h-5" /> Xem thêm
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;