import React, { useEffect, useState } from 'react';
import {
  FaEye, FaShoppingCart, FaCheckCircle,
  FaClock, FaTimes, FaLeaf,
  FaBox, FaArrowLeft, FaArrowRight,
  FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaTruck, FaCalendarAlt, FaChevronDown,
  FaChevronUp, FaBoxOpen, FaShippingFast,
  FaSearch
} from 'react-icons/fa';
import { ordersApi } from '../../utils/api/orders.api';

export default function HistoryOrders() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const [ghnOrderDetails, setGhnOrderDetails] = useState({});
  const [showShippingTimeline, setShowShippingTimeline] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Check for hash parameter on component mount and listen for custom event
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#order-search-')) {
        const orderId = hash.replace('#order-search-', '');
        setSearchTerm(orderId);
      }
    };

    const handleSetSearchTerm = (event) => {
      setSearchTerm(event.detail);
    };

    const handleStorageChange = () => {
      const orderId = localStorage.getItem('searchOrderId');
      if (orderId) {
        setSearchTerm(orderId);
        localStorage.removeItem('searchOrderId'); // Clean up
      }
    };

    // Check initial hash
    handleHashChange();

    // Check for searchOrderId in localStorage on mount
    const orderIdFromStorage = localStorage.getItem('searchOrderId');
    if (orderIdFromStorage) {
      setSearchTerm(orderIdFromStorage);
      localStorage.removeItem('searchOrderId'); // Clean up
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Listen for custom event from AI chat
    window.addEventListener('setSearchTerm', handleSetSearchTerm);
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listeners
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('setSearchTerm', handleSetSearchTerm);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Effect to filter orders when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        order.id.toString().includes(searchTerm.trim())
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  // Effect to focus on search input when searchTerm is set
  useEffect(() => {
    if (searchTerm) {
      // Scroll to the search box
      const searchInput = document.querySelector('input[placeholder="Tìm kiếm theo mã đơn hàng..."]');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInput.focus();
      }
    }
  }, [searchTerm]);

  // Function to fetch GHN order details
  const fetchGhnOrderDetails = async (orderCode, orderId) => {
    try {
      const data = await ordersApi.getGhnOrderDetail(orderCode);
      if (data?.success) {
        setGhnOrderDetails(prev => ({
          ...prev,
          [orderId]: data.data
        }));
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng GHN:', error);
    }
  };

  // Status mapping for better display
  const getShippingStatusText = (status) => {
    switch (status) {
      case 'ready_to_pick': return 'Sẵn sàng lấy hàng';
      case 'picking': return 'Đang lấy hàng';
      case 'picked': return 'Đã lấy hàng';
      case 'delivering': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      case 'return': return 'Trả hàng';
      case 'returned': return 'Đã trả hàng';
      default: return status;
    }
  };

  // Status timeline order
  const shippingStatusOrder = [
    'ready_to_pick',
    'picking',
    'picked',
    'delivering',
    'delivered',
    'cancelled',
    'return',
    'returned'
  ];

  // Get current status index
  const getCurrentStatusIndex = (status) => {
    return shippingStatusOrder.indexOf(status);
  };

  // Toggle order details (both products and shipping timeline)
  const toggleOrderDetails = async (orderId, orderCode) => {
    const isCurrentlyExpanded = expandedOrder === orderId;
    
    // If expanding and there's an order code, fetch GHN details
    if (!isCurrentlyExpanded && orderCode) {
      await fetchGhnOrderDetails(orderCode, orderId);
      // Show shipping timeline when expanding
      setShowShippingTimeline(prev => ({
        ...prev,
        [orderId]: true
      }));
    }
    
    // Toggle expanded state
    setExpandedOrder(isCurrentlyExpanded ? null : orderId);
  };

  // Toggle shipping timeline visibility
  const toggleShippingTimeline = async (orderId, orderCode) => {
    const isShowing = showShippingTimeline[orderId];
    
    // If showing for the first time, fetch GHN details
    if (!isShowing && orderCode) {
      await fetchGhnOrderDetails(orderCode, orderId);
    }
    
    setShowShippingTimeline(prev => ({
      ...prev,
      [orderId]: !isShowing
    }));
  };

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
        return <FaClock className="w-5 h-5 text-white" />;
      case 'CANCELLED': 
      case 'CANCELED': 
      case 'CANCEL': 
        return <FaTimes className="w-5 h-5 text-white" />;
      default: 
        return <FaClock className="w-5 h-5 text-white" />;
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

  // Function to format date for display
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to render shipping timeline based on log data
  const renderShippingTimeline = (orderDetails) => {
    const { log, status: currentStatus, leadtime } = orderDetails;
    
    // Filter out any invalid log entries and sort by updated_date
    const validLogs = (log || []).filter(item => item.status && item.updated_date);
    
    if (validLogs.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <FaShippingFast className="w-12 h-12 text-gray-300" />
            <p className="text-sm">Chưa có thông tin vận chuyển</p>
          </div>
        </div>
      );
    }

    // Sort logs by updated_date chronologically
    const sortedLogs = [...validLogs].sort((a, b) => 
      new Date(a.updated_date) - new Date(b.updated_date)
    );

    // Get the latest log entry to determine completion status
    const latestLog = sortedLogs[sortedLogs.length - 1];

    return (
      <div className="relative py-4">
        {/* Timeline line - gradient effect */}
        <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-green-400 to-green-400"></div>
        
        <div className="space-y-4">
          {sortedLogs.map((logItem, index) => {
            const isCurrent = logItem.status === currentStatus;
            const isLatest = logItem === latestLog;
            const isCompleted = true; // All logs in the array are completed events
            
            return (
              <div key={index} className="relative pl-14 pr-4">
                {/* Status dot with shadow */}
                <div className={`absolute left-0 top-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-green-400 to-green-500 scale-110' 
                    : 'bg-white border-2 border-gray-300'
                }`}>
                  {isCompleted && (
                    <FaCheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                
                {/* Status content with hover effect */}
                <div className={`p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${
                  isCurrent 
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300' 
                    : isLatest
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300'
                      : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h5 className={`font-semibold text-base ${
                      isCompleted ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {getShippingStatusText(logItem.status)}
                    </h5>
                    <div className="flex gap-2">
                      {isCurrent && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full whitespace-nowrap shadow-sm">
                          Hiện tại
                        </span>
                      )}
                      {isLatest && !isCurrent && (
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full whitespace-nowrap shadow-sm">
                          Mới nhất
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-sm text-gray-600 font-medium">
                      {formatDateTime(logItem.updated_date)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Expected delivery date if available and not already delivered */}
          {leadtime && currentStatus !== 'delivered' && (
            <div className="relative pl-14 pr-4">
              <div className="absolute left-0 top-4 w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-dashed border-gray-400 shadow-sm">
                <FaCalendarAlt className="w-4 h-4 text-gray-500" />
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h5 className="font-semibold text-base text-gray-700">
                    Dự kiến giao hàng
                  </h5>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full whitespace-nowrap">
                    Ước tính
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-sm text-gray-600 font-medium">
                    {formatDateTime(leadtime)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-green-400 focus:outline-none text-lg shadow-sm transition-all"
              />
              <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </div>
          
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
        ) : filteredOrders?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {filteredOrders.map((order) => (
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

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleOrderDetails(order.id, order.orderCode)}
                        className="flex-1 py-3 px-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-semibold"
                      >
                        {expandedOrder === order.id ? (
                          <>
                            <FaChevronUp className="w-4 h-4" />
                            Ẩn chi tiết
                          </>
                        ) : (
                          <>
                            <FaEye className="w-4 h-4" />
                            Xem chi tiết
                          </>
                        )}
                      </button>
                    </div>

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

                  {/* Shipping Status Timeline */}
                  {expandedOrder === order.id && order.orderCode && ghnOrderDetails[order.id] && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                          <FaTruck className="w-5 h-5 text-green-400" />
                          Quá trình vận chuyển
                        </h4>
                        
                        {renderShippingTimeline(ghnOrderDetails[order.id])}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* Pagination */}
            {searchTerm.trim() === '' && (
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
            )}
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