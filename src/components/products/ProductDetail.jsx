import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaLeaf,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaFire,
  FaEdit,
  FaSave,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCartFromServer } from "../../state/Cart/Action";
import Notification from "../common/Nontification";
import { productApi } from "../../utils/api/product.api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("info");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for comment editing
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  // State for comment visibility
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await productApi.getById(id);
        if (response?.data) {
          setProduct(response.data);
          // Use actual rate responses from API instead of mock data
          setComments(response.data.rateResponses || []);
        } else {
          setError("Sản phẩm không tồn tại");
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (apiError) {
        console.error("Failed to fetch product:", apiError);
        setError("Không thể tải thông tin sản phẩm");
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const renderStars = (rating, totalRate) => {
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
        {full > 0 &&
          Array(full)
            .fill()
            .map((_, i) => (
              <FaStar key={`f-${i}`} className="w-5 h-5 text-yellow-400" />
            ))}
        {half && <FaStarHalfAlt className="w-5 h-5 text-yellow-400" />}
        {empty > 0 &&
          Array(empty)
            .fill()
            .map((_, i) => (
              <FaRegStar key={`e-${i}`} className="w-5 h-5 text-yellow-400" />
            ))}
        <span className="ml-1 text-sm text-gray-500">({safeRating})</span>
        {totalRate !== undefined && (
          <span className="ml-1 text-sm text-gray-400">[{totalRate}]</span>
        )}
      </div>
    );
  };

  // Tạo initials từ tên để hiển thị avatar chữ cái
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((w) => w.trim()[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) {
      setNotificationType("error");
      setNotificationMessage("Sản phẩm đã hết hàng!");
    } else {
      dispatch(addToCartFromServer(product));
      setNotificationType("success");
      setNotificationMessage(`Đã thêm “${product.name}” vào giỏ hàng!`);
    }
    setShowNotification(true);
  };

  const handleAddRelatedToCart = (item) => {
    if (!item) return;
    if (item.stock === 0) {
      setNotificationType("error");
      setNotificationMessage("Sản phẩm đã hết hàng!");
    } else {
      dispatch(addToCartFromServer(item));
      setNotificationType("success");
      setNotificationMessage(`Đã thêm “${item.name}” vào giỏ hàng!`);
    }
    setShowNotification(true);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || userRating === 0) {
      setShowNotification(true);
      setNotificationType("error");
      setNotificationMessage("Vui lòng nhập bình luận và đánh giá sao!");
      return;
    }

    // Check if user is logged in
    if (!accessToken) {
      setShowNotification(true);
      setNotificationType("error");
      setNotificationMessage("Vui lòng đăng nhập để đánh giá sản phẩm!");
      return;
    }

    try {
      // Prepare rating data according to API requirements
      const ratingData = {
        productId: id,
        rateValue: userRating,
        comment: newComment,
      };

      // Submit rating using the new postRating API
      await productApi.postRating(id, ratingData, accessToken);

      // After successful submission, fetch the updated product data to get the new comment
      const response = await productApi.getById(id);
      if (response?.data) {
        setProduct(response.data);
        // Update comments with the actual data from the server
        setComments(response.data.rateResponses || []);
      }

      // Reset form
      setNewComment("");
      setUserRating(0);
      setShowNotification(true);
      setNotificationType("success");
      setNotificationMessage("Đã gửi đánh giá thành công!");
    } catch (error) {
      console.error("Failed to submit rating:", error);
      setShowNotification(true);
      setNotificationType("error");
      setNotificationMessage("Không thể gửi đánh giá. Vui lòng thử lại sau!");
    }
  };

  // Function to start editing a comment
  const startEditingComment = (comment) => {
    // Check if the comment belongs to the current user
    if (user && comment.userId === user.id) {
      setEditingCommentId(comment.id);
      setEditingCommentText(comment.comment);
    }
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  // Function to save edited comment
  const saveEditedComment = async () => {
    if (!editingCommentText.trim()) {
      setShowNotification(true);
      setNotificationType("error");
      setNotificationMessage("Bình luận không được để trống!");
      return;
    }

    try {
      // Find the comment being edited
      const commentToEdit = comments.find(
        (comment) => comment.id === editingCommentId
      );

      if (!commentToEdit) {
        setShowNotification(true);
        setNotificationType("error");
        setNotificationMessage("Không tìm thấy bình luận để chỉnh sửa!");
        return;
      }

      // Prepare updated rating data
      const updatedRatingData = {
        productId: id,
        rateValue: commentToEdit.rating,
        comment: editingCommentText,
      };

      // Update rating using the updateRating API
      await productApi.updateRating(
        editingCommentId,
        updatedRatingData,
        accessToken
      );

      // Fetch updated product data
      const response = await productApi.getById(id);
      if (response?.data) {
        setProduct(response.data);
        setComments(response.data.rateResponses || []);
      }

      // Reset editing state
      setEditingCommentId(null);
      setEditingCommentText("");

      setShowNotification(true);
      setNotificationType("success");
      setNotificationMessage("Đã cập nhật bình luận thành công!");
    } catch (error) {
      console.error("Failed to update comment:", error);
      setShowNotification(true);
      setNotificationType("error");
      setNotificationMessage(
        "Không thể cập nhật bình luận. Vui lòng thử lại sau!"
      );
    }
  };

  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch related products from API
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product) {
        try {
          // First, try to get products of the same type
          let related = [];

          if (product?.typeProduct?.name) {
            const response = await productApi.getAll(
              1,
              20,
              "createdDate",
              "desc"
            );
            if (response?.data?.content) {
              related = response.data.content
                .filter(
                  (p) =>
                    p.typeProduct?.name === product.typeProduct.name &&
                    p.id !== product.id
                )
                .slice(0, 4);
            }
          }

          // If we don't have enough related products, fetch some additional products
          if (related.length < 4) {
            const response = await productApi.getAll(
              1,
              20,
              "createdDate",
              "desc"
            );
            if (response?.data?.content) {
              const additional = response.data.content
                .filter((p) => p.id !== product.id) // Exclude current product
                .slice(0, 4 - related.length);
              related = [...related, ...additional];
            }
          }

          setRelatedProducts(related);
        } catch (error) {
          console.error("Failed to fetch related products:", error);
          // Even if there's an error, we still want to show something
          setRelatedProducts([]);
        }
      }
    };

    fetchRelatedProducts();
  }, [product]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <FaLeaf className="animate-spin text-green-600 text-4xl mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            Đang tải thông tin sản phẩm...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <FaLeaf className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <FaLeaf className="animate-spin text-green-600 text-4xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">
        {/* HERO SECTION */}
<section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/40 py-12">
  <div className="max-w-4xl mx-auto px-4 lg:px-8">
    <div className="flex flex-col gap-8">
      
      {/* IMAGE SECTION */}
      <div className="w-full">
        <div className="relative group max-w-2xl mx-auto">
          {/* Decorative background */}
          <div className="absolute -inset-4 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-3xl blur-xl"></div>
          
          {/* Main image container */}
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl shadow-black/10">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Image overlay info */}
            <div className="absolute top-10 left-10">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <span className="text-sm font-semibold text-green-600">
                  {product.typeProduct?.name}
                </span>
              </div>
            </div>
            
            {/* Sale badge */}
            {product.salePrice && product.price && (
              <div className="absolute top-10 right-10">
                <div className="bg-red-500 text-white rounded-xl px-4 py-2 shadow-lg transform rotate-3">
                  <span className="text-sm font-bold">
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className="w-full">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {product.name}
              </span>
            </h1>
            
            {/* Rating & Sales */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4">
              <div className="flex items-center justify-center gap-2">
                {renderStars(product.statisticsRate?.averageRate, product.statisticsRate?.totalRate)}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="w-1 h-1 bg-gray-400 rounded-full hidden sm:block"></div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-sm font-medium">{product.statisticsRate?.totalSale || 0} đã bán</span>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="prose prose-gray max-w-none text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
          
          {/* Price Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 text-center">
            <div className="space-y-3">
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {(product.salePrice || product.price || 0).toLocaleString('vi-VN')}₫
                </span>
                {product.salePrice && product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                )}
              </div>
              
              {product.salePrice && product.price && (
                <p className="text-sm text-green-700 font-medium">
                  Tiết kiệm {(product.price - product.salePrice).toLocaleString('vi-VN')}₫
                </p>
              )}
            </div>
          </div>
          
          {/* Stock Status */}
          <div className="flex items-center justify-center gap-3">
            <div className={`w-3 h-3 rounded-full ${product.stock === 0 ? 'bg-red-400' : 'bg-green-400'}`}></div>
            <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>
              {product.stock === 0 ? 'Hết hàng' : 'Còn hàng'}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                ${product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl shadow-green-200/50'}`}
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8l1.25 5H19M7 13v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 17h6" />
                </svg>
                {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
              </span>
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-8 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </span>
            </button>
          </div>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 max-w-lg mx-auto">
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Miễn phí</span>
              <span className="text-xs text-gray-500">vận chuyển</span>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Đổi trả</span>
              <span className="text-xs text-gray-500">7 ngày</span>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Bảo hành</span>
              <span className="text-xs text-gray-500">chính hãng</span>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  </div>
</section>

        {/* RELATED PRODUCTS */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaLeaf className="text-green-600" /> Có thể bạn thích
          </h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <article
                  key={rp.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group relative"
                >
                  {/* Badge HOT */}
                  {rp.active && (
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
                      <p className="text-xs text-gray-500 mt-1 mb-2 truncate">
                        {rp.description}
                      </p>
                    )}
                    <p className="text-sm text-green-600 font-medium">
                      {rp.typeProduct?.name}
                    </p>

                    <div className="mt-3 mb-3">
                      {renderStars(
                        rp.statisticsRate?.averageRate,
                        rp.statisticsRate?.totalRate
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      Đã bán: {rp.statisticsRate?.totalSale || 0}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex flex-col">
                        <span className="text-lg text-red-500 line-through font-medium">
                          {(rp.price || 0).toLocaleString("vi-VN")}₫
                        </span>
                        <span className="text-2xl font-bold text-green-800">
                          {(rp.salePrice || rp.price || 0).toLocaleString(
                            "vi-VN"
                          )}
                          ₫
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Không có sản phẩm liên quan để hiển thị.
              </p>
            </div>
          )}
        </section>

        {/* REVIEWS */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaLeaf className="text-green-600" /> Đánh giá & bình luận
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {comments.length ? (
              <div className="space-y-5">
                {/* Show only first 3 comments or all comments based on showAllComments state */}
                {(showAllComments ? comments : comments.slice(0, 3)).map(
                  (comment) => (
                    <div
                      key={comment.id}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {comment.avatar ? (
                            <img
                              src={comment.avatar}
                              alt={comment.fullName || comment.productName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                              <span className="text-green-800 font-semibold text-lg">
                                {getInitials(
                                  comment.fullName || comment.productName
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">
                                  {comment.fullName || "Người dùng"}
                                </p>
                                {/* Show edit indicator for user's own comments */}
                                {user && comment.userId === user.id && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Bạn
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) =>
                                  i < comment.rating ? (
                                    <FaStar
                                      key={i}
                                      className="w-5 h-5 text-yellow-400"
                                    />
                                  ) : (
                                    <FaRegStar
                                      key={i}
                                      className="w-5 h-5 text-yellow-400"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {comment.createdDate
                                  ? new Date(
                                      comment.createdDate
                                    ).toLocaleDateString("vi-VN")
                                  : ""}
                              </span>
                              {/* Edit button for user's own comments */}
                              {user && comment.userId === user.id && (
                                <button
                                  onClick={() => startEditingComment(comment)}
                                  className="text-gray-500 hover:text-green-600 transition-colors"
                                  title="Chỉnh sửa bình luận"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Comment content - Editable */}
                          {editingCommentId === comment.id ? (
                            <div className="mt-3">
                              <textarea
                                rows={3}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                value={editingCommentText}
                                onChange={(e) =>
                                  setEditingCommentText(e.target.value)
                                }
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={cancelEditing}
                                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                  <FaTimes className="inline mr-1" /> Hủy
                                </button>
                                <button
                                  onClick={saveEditedComment}
                                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                  <FaSave className="inline mr-1" /> Lưu
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-3 text-gray-700 leading-relaxed">
                              {comment.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* Show expand/collapse button if there are more than 3 comments */}
                {comments.length > 3 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowAllComments(!showAllComments)}
                      className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
                    >
                      {showAllComments ? (
                        <>
                          <span>Thu gọn</span>
                          <FaChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Xem thêm {comments.length - 3} bình luận</span>
                          <FaChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Chưa có đánh giá nào – hãy là người đầu tiên!
              </p>
            )}

            <form
              onSubmit={handleCommentSubmit}
              className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Viết đánh giá của bạn
              </h4>

              {/* Show login prompt if user is not logged in */}
              {!accessToken ? (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800">
                    Vui lòng{" "}
                    <a
                      href="/login"
                      className="font-semibold text-green-600 hover:underline"
                    >
                      đăng nhập
                    </a>{" "}
                    để đánh giá sản phẩm.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Đánh giá của bạn
                    </p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          disabled={!accessToken}
                        >
                          {star <= (hoverRating || userRating) ? (
                            <FaStar className="w-8 h-8 text-yellow-400" />
                          ) : (
                            <FaRegStar className="w-8 h-8 text-gray-300" />
                          )}
                        </button>
                      ))}
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {userRating > 0 ? `${userRating} sao` : "Chọn số sao"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                        disabled={!accessToken}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-colors duration-200 ${
                        !accessToken
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      }`}
                      disabled={!accessToken}
                    >
                      Gửi đánh giá
                    </button>
                  </div>
                </>
              )}
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
        action={[{ label: "OK", onClick: () => setShowNotification(false) }]}
      />
    </div>
  );
}
