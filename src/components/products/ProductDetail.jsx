import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaLeaf, FaStar, FaRegStar, FaStarHalfAlt, FaFire } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart, addToCartFromServer } from '../../state/Cart/Action';
import Notification from '../common/Nontification';
import { productApi } from '../../utils/api/product.api';

// Giả lập danh sách bình luận và đánh giá
const initialComments = {
  1: [
    { id: 1, user: 'Minh Phương', text: 'Sản phẩm rất tuyệt, giúp tôi cảm thấy nhẹ nhàng hơn!', date: '2025-07-10', rating: 5 },
    { id: 2, user: 'Ngọc Hiếu', text: 'Hương vị ngon, nhưng giao hàng hơi chậm.', date: '2025-07-09', rating: 4 },
  ],
  2: [{ id: 1, user: 'Văn Thương', text: 'Sinh tố này rất dễ uống, sẽ mua lại!', date: '2025-07-08', rating: 5 }],
  4: [
    { id: 1, user: 'Lan Anh', text: 'Rất thích hợp cho mùa hè, uống mát lắm!', date: '2025-07-12', rating: 4 },
  ],
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('info');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await productApi.getById(id);
        if (response?.data) {
          setProduct(response.data);
          setComments(initialComments[id] || []);
        } else {
          setError('Sản phẩm không tồn tại');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (apiError) {
        console.error('Failed to fetch product:', apiError);
        setError('Không thể tải thông tin sản phẩm');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const renderStars = (rating) => {
    // Validate and sanitize rating value
    const numericRating = Number(rating);
    const safeRating = Number.isFinite(numericRating) 
      ? Math.max(0, Math.min(5, numericRating)) 
      : 0;
    
    const full = Math.floor(safeRating);
    const half = safeRating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {full > 0 && Array(full).fill().map((_, i) => <FaStar key={`f-${i}`} className="w-5 h-5 text-yellow-400" />)}
        {half && <FaStarHalfAlt className="w-5 h-5 text-yellow-400" />}
        {empty > 0 && Array(empty).fill().map((_, i) => <FaRegStar key={`e-${i}`} className="w-5 h-5 text-yellow-400" />)}
      </div>
    );
  };

  // Tạo initials từ tên để hiển thị avatar chữ cái
  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((w) => w.trim()[0])
      .filter(Boolean)
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) {
      setNotificationType('error');
      setNotificationMessage('Sản phẩm đã hết hàng!');
    } else {
      dispatch(addToCartFromServer(product));
      setNotificationType('success');
      setNotificationMessage(`Đã thêm “${product.name}” vào giỏ hàng!`);
    }
    setShowNotification(true);
  };

  const handleAddRelatedToCart = (item) => {
    if (!item) return;
    if (item.stock === 0) {
      setNotificationType('error');
      setNotificationMessage('Sản phẩm đã hết hàng!');
    } else {
      dispatch(addToCartFromServer(item));
      setNotificationType('success');
      setNotificationMessage(`Đã thêm “${item.name}” vào giỏ hàng!`);
    }
    setShowNotification(true);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || userRating === 0) {
      setShowNotification(true);
      setNotificationType('error');
      setNotificationMessage('Vui lòng nhập bình luận và đánh giá sao!');
      return;
    }

    const comment = {
      id: comments.length + 1,
      user: 'Khách hàng',
      text: newComment,
      date: new Date().toISOString().split('T')[0],
      rating: userRating,
    };

    setComments([...comments, comment]);
    setNewComment('');
    setUserRating(0);
    setShowNotification(true);
    setNotificationType('success');
    setNotificationMessage('Đã gửi bình luận và đánh giá thành công!');
  };

  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch related products from API
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product?.category) {
        try {
          const response = await productApi.getAll(1, 8, 'createdDate', 'desc');
          if (response?.data?.content) {
            const related = response.data.content
              .filter((p) => p.category === product.category && p.id !== product.id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        } catch (error) {
          console.error('Failed to fetch related products:', error);
          setRelatedProducts([]);
        }
      }
    };

    fetchRelatedProducts();
  }, [product]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="text-center">
        <FaLeaf className="animate-spin text-green-600 text-4xl mx-auto mb-4" />
        <p className="text-lg text-gray-600">Đang tải thông tin sản phẩm...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="text-center">
        <FaLeaf className="text-red-500 text-4xl mx-auto mb-4" />
        <p className="text-lg text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <FaLeaf className="animate-spin text-green-600 text-4xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">

        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-10">
          {/* Ảnh (đơn giản, không overlay/hover scale) */}
          <div className="relative rounded-2xl overflow-hidden leading-[0]">
            <img
              src={product.image}
              alt={product.name}
              className="block w-full h-[450px] object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Nội dung */}
          <div className="flex flex-col justify-center gap-5">
            <span className="text-sm font-semibold text-green-600 tracking-widest uppercase">{product.category}</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3">
              {renderStars(product.rating)}
              <span className="text-gray-500">·</span>
              <span className="text-sm text-gray-500">{product.purchases} đã bán</span>
            </div>

            <p className="text-gray-600 text-base leading-relaxed max-w-lg">{product.description}</p>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-green-700">{product.price.toLocaleString('vi-VN')}₫</span>
              <span className="text-2xl text-red-500 line-through font-medium">{(product.price * 1.3).toLocaleString('vi-VN')}₫</span>
            </div>

            <p className="text-sm text-gray-500">Tồn kho: <span className="font-medium text-gray-800">{product.stock}</span></p>

            <div className="flex flex-col sm:flex-row gap-4 mt-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full sm:w-auto flex-1 px-8 py-3 rounded-full font-semibold shadow-lg transition-all
                  ${product.stock === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl'}`}
              >
                {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-gray-100 text-gray-800 font-semibold shadow-lg hover:bg-gray-200 transition-all"
              >
                Quay lại
              </button>
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <FaLeaf className="text-green-600" /> Có thể bạn thích
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <article
                  key={rp.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group relative"
                >
                  {/* Badge HOT */}
                  {rp.hot && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <FaFire className="text-sm" />
                        HOT
                      </div>
                    </div>
                  )}

                  {/* Ảnh (hover đơn giản) */}
                  <div className="relative rounded-2xl overflow-hidden leading-[0]">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="block w-full h-52 object-cover transition-opacity duration-200 hover:opacity-95"
                    />
                  </div>

                  {/* Thông tin */}
                  <div className="p-5">
                    <h3
                      onClick={() => navigate(`/product/${rp.id}`)}
                      className="text-lg font-bold text-green-800 truncate cursor-pointer hover:text-green-600 transition"
                    >
                      {rp.name}
                    </h3>
                    {rp.description && (
                      <p className="text-xs text-gray-500 mt-1 mb-2 truncate">{rp.description}</p>
                    )}
                    <p className="text-sm text-green-600 font-medium">{rp.category}</p>

                    <div className="mt-3 mb-3">{renderStars(rp.rating)}</div>

                    <p className="text-sm text-gray-500">Đã bán: {rp.purchases}</p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex flex-col">
                        <span className="text-lg text-red-500 line-through font-medium">
                          {(rp.price * 1.3).toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-2xl font-bold text-green-800">
                          {rp.price.toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddRelatedToCart(rp)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                        title="Thêm vào giỏ hàng"
                      >
                        <FiShoppingCart />
                        <span className="text-xs font-semibold">Thêm</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* REVIEWS */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaLeaf className="text-green-600" /> Đánh giá & bình luận
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {comments.length ? (
              <div className="space-y-5">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                          <span className="text-green-800 font-semibold text-lg">
                            {getInitials(comment.user)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">{comment.user}</p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                i < comment.rating ? 
                                  <FaStar key={i} className="w-5 h-5 text-yellow-400" /> : 
                                  <FaRegStar key={i} className="w-5 h-5 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                        <p className="mt-3 text-gray-700 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Chưa có đánh giá nào – hãy là người đầu tiên!</p>
            )}

            <form onSubmit={handleCommentSubmit} className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Viết đánh giá của bạn</h4>
                
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {star <= (hoverRating || userRating) ? (
                        <FaStar className="w-8 h-8 text-yellow-400" />
                      ) : (
                        <FaRegStar className="w-8 h-8 text-gray-300" />
                      )}
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {userRating > 0 ? `${userRating} sao` : 'Chọn số sao'}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Bình luận của bạn
                </label>
                <div>
                  <textarea
                    rows={4}
                    name="comment"
                    id="comment"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* Notification */}
      <Notification
        isOpen={showNotification}
        type={notificationType}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
        action={[{ label: 'OK', onClick: () => setShowNotification(false) }]}
      />
    </div>
  );
}