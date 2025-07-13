import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaLeaf } from 'react-icons/fa';
import Notification from '../common/Nontification';
// Danh sách sản phẩm mở rộng
const allProducts = [
  {
    id: 1,
    name: 'Củ dền + Cà rốt + Táo + Dưa leo',
    category: 'Nước ép',
    price: 30000,
    image: 'https://www.bartender.edu.vn/wp-content/uploads/2021/12/nuoc-ep-cu-den-nhieu-cong-dung.jpg',
    description: 'Nước ép chanh giúp thanh lọc cơ thể, cung cấp vitamin C và hỗ trợ giảm cân hiệu quả.',
    stock: 12,
    rating: '4.5',
    purchases: 342,
  },
  {
    id: 2,
    name: 'Nước Detox Chanh',
    category: 'Sinh tố',
    price: 30000,
    image: 'https://file.hstatic.net/200000240163/article/nuoc_detox_chanh_676db881894d48ab9c0fcbdb1c5cdf6c_1024x1024.jpg',
    description: 'Sinh tố dâu tươi giàu chất chống oxy hóa, hỗ trợ làm đẹp da và tăng sức đề kháng.',
    stock: 8,
    rating: '4.8',
    purchases: 450,
  },
  {
    id: 3,
    name: 'Cần tây = Táo + Dưa leo',
    category: 'Trà detox',
    price: 30000,
    image: 'https://omegajuicers.vn/wp-content/uploads/2023/11/nuoc-ep-can-tay-dua-tao-dua-chuot.jpg',
    description: 'Trà gừng ấm áp giúp kích thích tiêu hóa và đào thải độc tố ra khỏi cơ thể.',
    stock: 5,
    rating: '4.2',
    purchases: 290,
  },
  {
    id: 4,
    name: 'Detox Dưa Hấu',
    category: 'Nước ép',
    price: 30000,
    image: 'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/5_cach_lam_detox_dua_hau_sieu_don_gian_chi_voi_2_buoc_thu_ngay_3_3f7df3b5f2.jpg',
    description: 'Nước ép dưa hấu giúp cấp nước, giải nhiệt, thích hợp cho mùa hè.',
    stock: 10,
    rating: '4.6',
    purchases: 378,
  },
  {
    id: 5,
    name: 'Nước ép Cam + Gừng',
    category: 'Nước ép',
    price: 30000,
    image: 'https://thucphamsachgreenhouse.com/upload/images/Orange-Ginger-Juice-2-of-2-1365x2048.jpg',
    description: 'Nước ép cam và gừng tăng cường miễn dịch, hỗ trợ tiêu hóa.',
    stock: 15,
    rating: '4.7',
    purchases: 400,
  },
  {
    id: 6,
    name: 'Nước ép Kiwi + Dứa',
    category: 'Nước ép',
    price: 31000,
    image: 'https://cdn.tgdd.vn//News/0//goi-y-cach-lam-nuoc-ep-kiwi-don-gian-845x564.jpg',
    description: 'Nước ép kiwi và dứa giàu vitamin C, làm đẹp da.',
    stock: 10,
    rating: '4.4',
    purchases: 350,
  },
];

// Giả lập danh sách bình luận
const initialComments = {
  1: [
    { id: 1, user: 'Minh Phương', text: 'Sản phẩm rất tuyệt, giúp tôi cảm thấy nhẹ nhàng hơn!', date: '2025-07-10' },
    { id: 2, user: 'Ngọc Hiếu', text: 'Hương vị ngon, nhưng giao hàng hơi chậm.', date: '2025-07-09' },
  ],
  2: [{ id: 1, user: 'Văn Thương', text: 'Sinh tố này rất dễ uống, sẽ mua lại!', date: '2025-07-08' }],
  4: [
    { id: 1, user: 'Lan Anh', text: 'Rất thích hợp cho mùa hè, uống mát lắm!', date: '2025-07-12' },
  ],
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('info');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const foundProduct = allProducts.find((p) => p.id === parseInt(id));
    if (!foundProduct) {
      navigate('/'); // Chuyển về trang chủ nếu không tìm thấy
    } else {
      setProduct(foundProduct);
      setComments(initialComments[id] || []);
    }
  }, [id, navigate]);

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

  const handleAddToCart = () => {
    if (product) {
      if (product.stock === 0) {
        setNotificationType('error');
        setNotificationMessage('Sản phẩm đã hết hàng!');
      } else {
        setNotificationType('success');
        setNotificationMessage(`Đã thêm "${product.name}" vào giỏ hàng!`);
      }
      setShowNotification(true);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newCommentObj = {
      id: comments.length + 1,
      user: 'Người dùng ẩn danh',
      text: newComment,
      date: new Date().toISOString().split('T')[0],
    };
    setComments([...comments, newCommentObj]);
    setNewComment('');
    setNotificationType('success');
    setNotificationMessage('Bình luận của bạn đã được gửi thành công!');
    setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  // Tìm sản phẩm liên quan (cùng danh mục, loại trừ sản phẩm hiện tại)
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 3);

  if (!product) return <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 py-8 px-4 text-center text-gray-600">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="lg:w-1/2 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 lg:h-96 object-cover rounded-xl border border-green-200 shadow-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-green-800 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                {renderStars(product.rating)}
                <p className="text-gray-600 text-sm">Đã bán: {product.purchases}</p>
              </div>
              <p className="text-gray-600 mb-2">Danh mục: <span className="font-medium">{product.category}</span></p>
              <p className="text-2xl text-green-800 font-bold mb-4">{product.price.toLocaleString('vi-VN')} VNĐ</p>
              <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>
              <p className="text-gray-600 mb-6">Số lượng tồn kho: <span className="font-medium">{product.stock}</span></p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                }`}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full px-6 py-3 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-all text-lg font-semibold shadow-md"
              >
                <FaLeaf className="inline mr-2" /> Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-green-800 mb-6 flex items-center gap-2">
              <FaLeaf className="text-green-600" /> Sản Phẩm Liên Quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1"
                >
                  <div
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    className="cursor-pointer"
                  >
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover rounded-lg mb-4 border border-green-200"
                    />
                    <h3 className="text-xl font-semibold text-green-700 hover:underline mb-2">
                      {relatedProduct.name}
                    </h3>
                    {renderStars(relatedProduct.rating)}
                    <p className="text-gray-600 text-sm mt-2">Đã bán: {relatedProduct.purchases}</p>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{relatedProduct.category}</p>
                  <p className="text-green-800 font-bold text-lg mt-2">{relatedProduct.price.toLocaleString('vi-VN')} VNĐ</p>
                  <button
                    onClick={() => handleAddToCart(relatedProduct)}
                    className={`mt-4 w-full px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      relatedProduct.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
                    }`}
                    disabled={relatedProduct.stock === 0}
                  >
                    {relatedProduct.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-green-800 mb-6 flex items-center gap-2">
            <FaLeaf className="text-green-600" /> Bình Luận Sản Phẩm
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="w-full p-4 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 resize-none"
                rows="4"
              />
              <button
                type="submit"
                className="mt-3 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all text-sm font-semibold shadow-md"
              >
                Gửi bình luận
              </button>
            </form>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-green-100 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-green-700 font-medium">{comment.user}</p>
                      <p className="text-gray-500 text-sm">{comment.date}</p>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
            )}
          </div>
        </div>

        {/* Notification Component */}
        <Notification
          isOpen={showNotification}
          type={notificationType}
          message={notificationMessage}
          onClose={handleCloseNotification}
          action={[{ label: 'OK', onClick: handleCloseNotification }]}
        />
      </div>
    </div>
  );
}