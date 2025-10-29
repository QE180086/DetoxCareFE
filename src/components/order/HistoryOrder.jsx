import React, { useEffect, useState } from 'react';
import {
  FaEye, FaShoppingCart, FaCheckCircle,
  FaClock, FaTimes, FaLeaf,
  FaBox, FaArrowLeft, FaArrowRight,
  FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaTruck, FaCalendarAlt, FaChevronDown,
  FaChevronUp, FaBoxOpen
} from 'react-icons/fa';
import { ordersApi } from '../../utils/api/orders.api';

export default function HistoryOrders() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const data = await ordersApi.getAll(page, pageSize, 'createdDate', 'desc');
      console.log('Đơn hàng nhận được:', data);
      setOrders(data?.data?.content ?? []);
      setTotalPages(Math.ceil((data?.data?.totalElement ?? 0) / pageSize));
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const getStatusIcon = (status) => {
    // Normalize status to uppercase for comparison
    const normalizedStatus = status?.toUpperCase();
    
    switch (normalizedStatus) {
      case 'COMPLETED': 
      case 'COMPLETE': 
        return <FaCheckCircle className="w-5 h-5 text-white" />;
      case 'PENDING': 
      case 'PROCESSING': 
        return <FaClock className="w-5 h-5 text-gray-400" />;
      case 'CANCELLED': 
      case 'CANCELED': 
      case 'CANCEL': 
        return <FaTimes className="w-5 h-5 text-white" />;
      default: 
        return <FaClock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-400 text-white';
      case 'PENDING': return 'bg-gray-400 text-white';
      case 'CANCELLED': return 'bg-red-500 text-white';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Hoàn thành';
      case 'PENDING': return 'Đang xử lý';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-green-400 rounded-2xl shadow-lg">
              <FaShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-black">
              Lịch Sử Đơn Hàng
            </h1>
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-6">
            Theo dõi và quản lý tất cả đơn hàng detox của bạn một cách dễ dàng
          </p>
          <div className="mt-6 p-5 bg-gray-50 rounded-2xl max-w-3xl mx-auto border border-gray-200">
            <div className="flex items-start gap-3">
              <FaTruck className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-gray-700 text-sm text-left">
                <span className="font-semibold text-black">Lưu ý:</span> Các đơn hàng đã được xác nhận sẽ có mã vận đơn để bạn có thể theo dõi tình trạng giao hàng trên website <span className="font-semibold">ghn.vn</span>
              </p>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
              <p className="mt-4 text-gray-500">Đang tải đơn hàng...</p>
            </div>
          </div>
        ) : orders?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white border-2 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    order.status === 'CANCELLED'
                      ? 'border-red-500 bg-red-50 bg-stripes'
                      : 'border-gray-200'
                  }`}
                  style={order.status === 'CANCELLED' ? {
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(239, 68, 68, 0.1) 10px, rgba(239, 68, 68, 0.1) 20px)'
                  } : {}}
                >
                  {/* Order Header */}
                  <div className={`p-6 border-b ${
                    order.status === 'CANCELLED'
                      ? 'bg-red-100 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          order.status === 'CANCELLED'
                            ? 'bg-red-500'
                            : 'bg-green-400'
                        }`}>
                          <FaBox className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-black">
                            Đơn hàng #{order.id}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            {order.createdDate
                              ? new Date(order.createdDate).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : '---'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Tổng tiền hàng</p>
                        <p className="text-lg font-bold text-black">
                          {order.totalAmount?.toLocaleString('vi-VN')}đ
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Phí vận chuyển</p>
                        <p className="text-lg font-bold text-green-400">
                          {order.shippingFee > 0 ? `+${order.shippingFee?.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                        </p>
                      </div>

                      <div className="bg-green-400 p-4 rounded-xl">
                        <p className="text-xs text-white mb-1">Tổng thanh toán</p>
                        <p className="text-lg font-bold text-white">
                          {(order.totalAmount + (order.shippingFee || 0))?.toLocaleString('vi-VN')}đ
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Mã vận đơn</p>
                        <p className="text-lg font-bold text-black">
                          {order.orderCode ? `#${order.orderCode}` : 'Chưa có'}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <FaEnvelope className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-semibold text-black truncate">{order.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <FaPhone className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500">Số điện thoại</p>
                          <p className="text-sm font-semibold text-black">{order.numberPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <FaMapMarkerAlt className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500">Địa chỉ</p>
                          <p className="text-sm font-semibold text-black line-clamp-1">{order.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Notice */}
                    {order.orderCode && (
                      <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-start gap-3">
                          <FaTruck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold text-black">Theo dõi đơn hàng:</span> Sử dụng mã vận đơn <span className="font-bold text-green-400">#{order.orderCode}</span> để tra cứu trên <span className="font-semibold">ghn.vn</span> hoặc ứng dụng GHN Express
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Toggle Details Button */}
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="w-full py-3 px-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      {expandedOrder === order.id ? (
                        <>
                          <FaChevronUp className="w-4 h-4" />
                          Ẩn chi tiết
                        </>
                      ) : (
                        <>
                          <FaEye className="w-4 h-4" />
                          Xem chi tiết sản phẩm
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order.id && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                          <FaBoxOpen className="w-5 h-5 text-green-400" />
                          Sản phẩm trong đơn hàng
                        </h4>

                        {order.orderItems?.length > 0 ? (
                          <div className="space-y-3">
                            {order.orderItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-400 transition-colors"
                              >
                                <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                                  <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-black mb-1">{item.productName}</h5>
                                  <p className="text-sm text-gray-500 mb-2">{item.typeProductName}</p>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">
                                      SL: <span className="font-semibold text-black">{item.quantity}</span>
                                    </span>
                                    {parseFloat(item.salePrice) > 0 ? (
                                      <>
                                        <span className="text-xs text-gray-400 line-through">
                                          {parseFloat(item.priceProduct).toLocaleString('vi-VN')}đ
                                        </span>
                                        <span className="text-sm font-bold text-green-400">
                                          {parseFloat(item.salePrice).toLocaleString('vi-VN')}đ
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-sm font-bold text-green-400">
                                        {parseFloat(item.priceProduct).toLocaleString('vi-VN')}đ
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                  <p className="text-xs text-gray-500 mb-1">Thành tiền</p>
                                  <p className="text-lg font-bold text-black">
                                    {(parseFloat(item.salePrice) > 0
                                      ? parseFloat(item.salePrice) * item.quantity
                                      : parseFloat(item.priceProduct) * item.quantity).toLocaleString('vi-VN')}đ
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-center py-8">Không có sản phẩm nào trong đơn hàng.</p>
                        )}

                        {/* Additional Info */}
                        {order.expectedDeliveryTime && (
                          <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-4">
                              <FaCalendarAlt className="w-6 h-6 text-green-400" />
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Dự kiến giao hàng</p>
                                <p className="text-xl font-bold text-black">
                                  {new Date(order.expectedDeliveryTime).toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="text-gray-600 font-semibold">
                Trang <span className="text-black">{currentPage}</span> / <span className="text-black">{totalPages}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <FaArrowLeft className="w-4 h-4" /> Trước
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-400 text-white hover:bg-green-500'
                  }`}
                >
                  Tiếp <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-50 rounded-3xl mb-6">
              <FaShoppingCart className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">Chưa có đơn hàng</h3>
            <p className="text-gray-500">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
          </div>
        )}
      </div>
    </div>
  );
}
