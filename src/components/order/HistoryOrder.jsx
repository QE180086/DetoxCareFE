import React, { useEffect, useState } from 'react';
import {
  FaEye, FaShoppingCart, FaCheckCircle,
  FaClock, FaTimes, FaLeaf,
  FaBox, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import { ordersApi } from '../../utils/api/orders.api';

export default function HistoryOrders() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const pageSize = 8; // Number of orders per page

  // Fetch orders based on current page
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

  // Fetch orders when component mounts or currentPage changes
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'PENDING': return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'CANCELED': return <FaTimes className="w-4 h-4 text-red-500" />;
      default: return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Handle page navigation
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

  // if (loading && orders.length === 0) return <p>Đang tải đơn hàng...</p>;

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
              <FaShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Lịch Sử Đơn Hàng
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Theo dõi và quản lý tất cả đơn hàng detox của bạn một cách dễ dàng
          </p>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaLeaf className="w-6 h-6" /> Danh Sách Đơn Hàng
            </h2>
          </div>

          {orders?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">Mã đơn hàng</th>
                      <th className="px-6 py-4 text-left">Ngày đặt</th>
                      <th className="px-6 py-4 text-left">Tổng tiền</th>
                      <th className="px-6 py-4 text-left">Trạng thái</th>
                      <th className="px-6 py-4 text-left">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <React.Fragment key={order.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-green-700">#{order.id}</td>
                          <td className="px-6 py-4 text-gray-600">
                            {order.createdDate
                              ? new Date(order.createdDate).toLocaleDateString('vi-VN')
                              : '---'}
                          </td>
                          <td className="px-6 py-4 font-bold text-lg text-emerald-600">
                            {order.totalAmount?.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleOrderDetails(order.id)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm"
                            >
                              <FaEye className="w-4 h-4" />
                              {expandedOrder === order.id ? 'Ẩn' : 'Xem'}
                            </button>
                          </td>
                        </tr>

                        {expandedOrder === order.id && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 bg-gray-50">
                              <div className="p-6 bg-white rounded-xl shadow-inner border border-gray-100">
                                <h4 className="font-semibold text-lg text-gray-800 mb-6 flex items-center gap-2">
                                  <FaBox className="w-5 h-5 text-green-600" /> Chi tiết đơn hàng
                                </h4>
                                {order.orderItems?.length > 0 ? (
                                  <div className="space-y-4">
                                    {order.orderItems.map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200"
                                      >
                                        {/* Hình ảnh sản phẩm */}
                                        <div className="w-16 h-16 flex-shrink-0">
                                          <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-full h-full object-cover rounded-md border border-gray-200"
                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/64')} // Hình ảnh dự phòng nếu lỗi
                                          />
                                        </div>

                                        {/* Thông tin sản phẩm */}
                                        <div className="flex-1">
                                          <p className="font-semibold text-gray-800">{item.productName}</p>
                                          <p className="text-sm text-gray-500">Loại: {item.typeProductName}</p>
                                          <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <p className="text-sm text-gray-500">
                                              Giá gốc: <span className="line-through">{parseFloat(item.priceProduct).toLocaleString('vi-VN')}đ</span>
                                            </p>
                                            <p className="text-sm font-semibold text-green-600">
                                              Giá khuyến mãi: {parseFloat(item.salePrice).toLocaleString('vi-VN')}đ
                                            </p>
                                          </div>
                                        </div>

                                        {/* Tổng tiền */}
                                        <div className="text-right">
                                          <p className="text-green-600 font-semibold">
                                            {(parseFloat(item.salePrice) * item.quantity).toLocaleString('vi-VN')}đ
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-center">Không có sản phẩm nào trong đơn hàng.</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="px-8 py-6 flex justify-between items-center border-t border-gray-200">
                <div className="text-gray-600">
                  Trang {currentPage} / {totalPages}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                  >
                    <FaArrowLeft className="w-4 h-4" /> Trước
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                  >
                    Tiếp <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-500">Bạn chưa có đơn hàng nào.</div>
          )}
        </div>
      </div>
    </div>
  );
}