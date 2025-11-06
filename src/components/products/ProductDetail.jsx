import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Star,
  StarHalf,
  Leaf,
  Flame,
  ShoppingCart,
  ChevronLeft,
  Package,
  Shield,
  RotateCcw,
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartFromServer } from "../../state/Cart/Action";
import { productApi } from "../../utils/api/product.api";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Add this helper function to safely render HTML content
const renderHTMLContent = (content) => {
  if (!content) return null;
  
  return (
    <div 
      className="text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await productApi.getById(id);
        if (response?.data) {
          setProduct(response.data);
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

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product) {
        try {
          let related = [];

          if (product?.typeProduct?.name) {
            const response = await productApi.getAll(1, 20, "createdDate", "desc", "");
            if (response?.data?.content) {
              related = response.data.content
                .filter((p) => p.typeProduct?.name === product.typeProduct.name && p.id !== product.id)
                .slice(0, 4);
            }
          }

          if (related.length < 4) {
            const response = await productApi.getAll(1, 20, "createdDate", "desc", "");
            if (response?.data?.content) {
              const additional = response.data.content
                .filter((p) => p.id !== product.id)
                .slice(0, 4 - related.length);
              related = [...related, ...additional];
            }
          }

          setRelatedProducts(related);
        } catch (error) {
          console.error("Failed to fetch related products:", error);
          setRelatedProducts([]);
        }
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const renderStars = (rating, totalRate) => {
    const numericRating = Number(rating);
    const safeRating = Number.isFinite(numericRating) ? Math.max(0, Math.min(5, numericRating)) : 0;
    const full = Math.floor(safeRating);
    const half = safeRating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {full > 0 &&
          Array(full)
            .fill(0)
            .map((_, i) => <Star key={`f-${i}`} className="w-4 h-4 fill-green-400 text-green-400" />)}
        {half && <StarHalf className="w-4 h-4 fill-green-400 text-green-400" />}
        {empty > 0 &&
          Array(empty)
            .fill(0)
            .map((_, i) => <Star key={`e-${i}`} className="w-4 h-4 text-gray-300" />)}
        <span className="ml-1.5 text-sm font-medium text-gray-700">{safeRating.toFixed(1)}</span>
        {totalRate !== undefined && <span className="text-sm text-gray-400">({totalRate})</span>}
      </div>
    );
  };

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
      alert("Sản phẩm đã hết hàng!");
    } else {
      dispatch(addToCartFromServer(product));
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
  };

  const handleAddRelatedToCart = (item) => {
    if (!item) return;
    if (item.stock === 0) {
      alert("Sản phẩm đã hết hàng!");
    } else {
      dispatch(addToCartFromServer(item));
      alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Check if comment has content (not just whitespace or empty HTML tags)
    const strippedContent = newComment.replace(/<[^>]*>/g, '').trim();
    if (!strippedContent || userRating === 0) {
      alert("Vui lòng nhập bình luận và đánh giá sao!");
      return;
    }

    if (!accessToken) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm!");
      return;
    }

    (async () => {
      try {
        const ratingData = {
          productId: id,
          rateValue: userRating,
          comment: newComment,
        };

        await productApi.postRating(id, ratingData, accessToken);
        const response = await productApi.getById(id);
        if (response?.data) {
          setProduct(response.data);
          setComments(response.data.rateResponses || []);
        }

        setNewComment("");
        setUserRating(0);
        alert("Đã gửi đánh giá thành công!");
      } catch (error) {
        console.error("Failed to submit rating:", error);
        alert("Không thể gửi đánh giá. Vui lòng thử lại sau!");
      }
    })();
  };

  const startEditingComment = (comment) => {
    if (user && comment.userId === user.id) {
      setEditingCommentId(comment.id);
      setEditingCommentText(comment.comment);
    }
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const saveEditedComment = () => {
    // Check if comment has content (not just whitespace or empty HTML tags)
    const strippedContent = editingCommentText.replace(/<[^>]*>/g, '').trim();
    if (!strippedContent) {
      alert("Bình luận không được để trống!");
      return;
    }

    (async () => {
      try {
        const commentToEdit = comments.find((comment) => comment.id === editingCommentId);

        if (!commentToEdit) {
          alert("Không tìm thấy bình luận để chỉnh sửa!");
          return;
        }

        const updatedRatingData = {
          productId: id,
          rateValue: commentToEdit.rating,
          comment: editingCommentText,
        };

        await productApi.updateRating(editingCommentId, updatedRatingData, accessToken);
        const response = await productApi.getById(id);
        if (response?.data) {
          setProduct(response.data);
          setComments(response.data.rateResponses || []);
        }

        setEditingCommentId(null);
        setEditingCommentText("");
        alert("Đã cập nhật bình luận thành công!");
      } catch (error) {
        console.error("Failed to update comment:", error);
        alert("Không thể cập nhật bình luận. Vui lòng thử lại sau!");
      }
    })();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Leaf className="animate-spin text-green-400 w-12 h-12 mx-auto mb-4" />
          <p className="text-base text-gray-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="text-red-500 w-12 h-12 mx-auto mb-4" />
          <p className="text-base text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Leaf className="animate-spin text-green-400 w-12 h-12" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* PRODUCT DETAIL */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* IMAGE */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {product.salePrice > 0 && product.price && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-400 text-black font-bold text-sm px-3 py-1.5 rounded-lg">
                      -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                    </div>
                  </div>
                )}
                {product.active && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-black text-white font-medium text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Flame className="w-4 h-4" />
                      HOT
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                  <Package className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-black">Miễn phí</p>
                  <p className="text-xs text-gray-500">vận chuyển</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                  <RotateCcw className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-black">Đổi trả</p>
                  <p className="text-xs text-gray-500">7 ngày</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                  <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-black">Bảo hành</p>
                  <p className="text-xs text-gray-500">chính hãng</p>
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="space-y-6">
              <div>
                <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-3">
                  {product.typeProduct?.name}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {renderStars(product.statisticsRate?.averageRate, product.statisticsRate?.totalRate)}
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">{product.statisticsRate?.totalSale || 0} đã bán</span>
                  </div>
                </div>
                <p className="text-base text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="border-y border-gray-200 py-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-5xl font-bold text-black">
                    {(product.salePrice || product.price || 0).toLocaleString("vi-VN")}₫
                  </span>
                  {product.salePrice > 0 && product.price && (
                    <span className="text-xl text-gray-400 line-through">
                      {product.price.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>
                {product.salePrice > 0 && product.price && (
                  <p className="text-sm text-green-400 font-medium mt-2">
                    Tiết kiệm {(product.price - product.salePrice).toLocaleString("vi-VN")}₫
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {product.stock === 0 ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-semibold text-red-600">Hết hàng</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">Còn hàng</span>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all ${
                    product.stock === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-400 text-black hover:bg-green-500 active:scale-[0.98]"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                  </span>
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-4 rounded-xl border-2 border-gray-200 text-black font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ChevronLeft className="w-5 h-5" />
                    Quay lại
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-400" />
              Có thể bạn thích
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <div
                  key={rp.id}
                  className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {rp.active && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-black text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          HOT
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      onClick={() => navigate(`/product/${rp.id}`)}
                      className="font-semibold text-black mb-2 truncate cursor-pointer hover:text-green-400 transition-colors"
                    >
                      {rp.name}
                    </h3>
                    <div className="mb-3">{renderStars(rp.statisticsRate?.averageRate, rp.statisticsRate?.totalRate)}</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-black">
                          {(rp.salePrice > 0 ? rp.salePrice : rp.price || 0).toLocaleString("vi-VN")}₫
                        </div>
                        {rp.salePrice > 0 && (
                          <div className="text-sm text-gray-400 line-through">
                            {(rp.price || 0).toLocaleString("vi-VN")}₫
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddRelatedToCart(rp)}
                        className="p-2.5 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-green-400" />
            Đánh giá & bình luận
          </h2>
          <div className="space-y-6">
            {comments.length > 0 && (
              <div className="space-y-4">
                {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {comment.avatar ? (
                          <img
                            src={comment.avatar || "/placeholder.svg"}
                            alt={comment.fullName || comment.productName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center border-2 border-white">
                            <span className="text-black font-bold text-base">
                              {getInitials(comment.fullName || comment.productName)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-black">{comment.fullName || "Người dùng"}</p>
                              {user && comment.userId === user.id && (
                                <span className="text-xs bg-green-400 text-black px-2 py-0.5 rounded-full font-medium">
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) =>
                                i < comment.rating ? (
                                  <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                                ) : (
                                  <Star key={i} className="w-4 h-4 text-gray-300" />
                                )
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {comment.createdDate ? new Date(comment.createdDate).toLocaleDateString("vi-VN") : ""}
                            </span>
                            {user && comment.userId === user.id && (
                              <button
                                onClick={() => startEditingComment(comment)}
                                className="text-gray-400 hover:text-green-400 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="mt-3">
                            <ReactQuill
                              value={editingCommentText}
                              onChange={setEditingCommentText}
                              modules={{
                                toolbar: [
                                  [{ 'header': [2, 3, false] }],
                                  ['bold', 'italic', 'underline'],
                                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                  ['link'],
                                  ['clean']
                                ]
                              }}
                              formats={[
                                'header',
                                'bold', 'italic', 'underline',
                                'list', 'bullet',
                                'link'
                              ]}
                              className="bg-white text-black"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={cancelEditing}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
                              >
                                <X className="inline w-4 h-4 mr-1" /> Hủy
                              </button>
                              <button
                                onClick={saveEditedComment}
                                className="px-3 py-1.5 text-sm bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors font-medium"
                              >
                                <Save className="inline w-4 h-4 mr-1" /> Lưu
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-gray-700 leading-relaxed">
                            {renderHTMLContent(comment.comment)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length > 3 && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowAllComments(!showAllComments)}
                      className="flex items-center gap-2 text-black hover:text-green-400 font-medium transition-colors"
                    >
                      <span>{showAllComments ? "Thu gọn" : `Xem thêm ${comments.length - 3} bình luận`}</span>
                      {showAllComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            )}

            {comments.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có đánh giá nào – hãy là người đầu tiên!</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-black mb-4">Viết đánh giá của bạn</h3>
              {!accessToken ? (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    Vui lòng{" "}
                    <a href="/login" className="font-semibold text-green-400 hover:underline">
                      đăng nhập
                    </a>{" "}
                    để đánh giá sản phẩm.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-2">Đánh giá của bạn</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          {star <= (hoverRating || userRating) ? (
                            <Star className="w-8 h-8 fill-green-400 text-green-400" />
                          ) : (
                            <Star className="w-8 h-8 text-gray-300" />
                          )}
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {userRating > 0 ? `${userRating} sao` : "Chọn số sao"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-black mb-2">
                      Bình luận của bạn
                    </label>
                    <ReactQuill
                      value={newComment}
                      onChange={setNewComment}
                      modules={{
                        toolbar: [
                          [{ 'header': [2, 3, false] }],
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link'],
                          ['clean']
                        ]
                      }}
                      formats={[
                        'header',
                        'bold', 'italic', 'underline',
                        'list', 'bullet',
                        'link'
                      ]}
                      className="bg-white text-black"
                      placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-400 text-black font-semibold rounded-lg hover:bg-green-500 transition-colors"
                  >
                    Gửi đánh giá
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}