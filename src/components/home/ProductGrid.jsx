import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

const ProductGrid = () => {
  const products = [
    {
      name: "Nước Detox Táo Xanh",
      price: 45000,
      image: "https://file.hstatic.net/200000342937/file/cach-lam-nuoc-ep-can-tay-va-tao_5c4f1de76ead47fcb48938416aca2e17_grande.jpg",
    },
    {
      name: "Nước Detox Chanh Leo",
      price: 45000,
      image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/cach-pha-che-detox-chanh-dua-leo.jpg",
    },
    {
      name: "Combo 3 Ngày Detox",
      price: 85000,
      image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg",
    },
    {
      name: "Nước Detox Dứa",
      price: 30000,
      image: "https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2025/1/20/nuoc-ep-dua-gung-1-17373457424951710380999.png",
    },
    {
      name: "Nước Detox Tắc",
      price: 25000,
      image: "https://sieuthiyte.com.vn/blog/wp-content/uploads/2024/12/detox-chanh-dua-leo-nen-uong-bua-sang.jpg",
    },
    {
      name: "Nước Detox Cà Rốt",
      price: 30000,
      image: "https://magic.com.vn/wp-content/uploads/2023/04/Artboard-57-2048x1152.png",
    },
    {
      name: "Combo detox 7 ngày",
      price: 189000,
      image: "https://tiki.vn/blog/wp-content/uploads/2023/01/detox-giam-can-1024x734.png",
    },
    {
      name: "Nước Detox Cần Tây",
      price: 30000,
      image: "https://th.bing.com/th/id/OIP.QBx5_pvYNd-u9gUk0GT6wgHaE8?w=226&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
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