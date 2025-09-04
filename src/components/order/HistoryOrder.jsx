import React, { useState } from 'react';
import { FaEye, FaCalendarAlt, FaShoppingCart, FaBox, FaCheckCircle, FaClock, FaDollarSign, FaLeaf, FaCreditCard, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

export default function HistoryOrders() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 'DH001',
      date: '2025-07-01',
      total: 85000,
      status: 'Đã giao',
      paymentMethod: 'Thanh toán khi nhận hàng',
      shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
      items: [
        { name: 'Detox Chanh', quantity: 2, price: 30000 },
        { name: 'Detox Tắc', quantity: 1, price: 25000 },
      ],
    },
    {
      id: 'DH002',
      date: '2025-06-15',
      total: 50000,
      status: 'Đã giao',
      paymentMethod: 'Thẻ tín dụng',
      shippingAddress: '456 Đường XYZ, Quận 3, TP.HCM',
      items: [
        { name: 'Detox Chanh Leo', quantity: 1, price: 25000 },
        { name: 'Detox Táo', quantity: 1, price: 25000 },
      ],
    },
    {
      id: 'DH003',
      date: '2025-05-20',
      total: 30000,
      status: 'Đang xử lý',
      paymentMethod: 'Chuyển khoản ngân hàng',
      shippingAddress: '789 Đường MNP, Quận 7, TP.HCM',
      items: [
        { name: 'Detox Chanh + Cà rốt', quantity: 2, price: 30000 },
      ],
    },
    {
      id: 'DH004',
      date: '2025-05-10',
      total: 75000,
      status: 'Đã giao',
      paymentMethod: 'Ví điện tử MoMo',
      shippingAddress: '321 Đường KLM, Quận 2, TP.HCM',
      items: [
        { name: 'Detox Dâu tây', quantity: 1, price: 35000 },
        { name: 'Detox Kiwi', quantity: 2, price: 40000 },
      ],
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Đã giao':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'Đang xử lý':
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'Đã hủy':
        return <FaTimes className="w-4 h-4 text-red-500" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã giao':
        return 'bg-green-100 text-green-800';
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelOrder = (orderId) => {
    const confirmCancel = window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không?`);
    if (confirmCancel) {
      // Cập nhật trạng thái đơn hàng thành 'Đã hủy'
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'Đã hủy' }
            : order
        )
      );
      alert(`Đơn hàng #${orderId} đã được hủy thành công!`);
      // Trong ứng dụng thật, bạn sẽ gọi API call để cập nhật trạng thái
      console.log(`Order ${orderId} cancelled and status updated to 'Đã hủy'`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaBox className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                <p className="text-gray-600">Tổng đơn hàng</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FaCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter(order => order.status === 'Đã giao').length}
                </p>
                <p className="text-gray-600">Đã giao</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FaTimes className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter(order => order.status === 'Đã hủy').length}
                </p>
                <p className="text-gray-600">Đã hủy</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <FaDollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter(order => order.status !== 'Đã hủy').reduce((sum, order) => sum + order.total, 0).toLocaleString('vi-VN')}đ
                </p>
                <p className="text-gray-600">Tổng chi tiêu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaLeaf className="w-6 h-6" /> Danh Sách Đơn Hàng
            </h2>
          </div>

          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                            <span className="font-semibold text-green-700">#{order.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                            {new Date(order.date).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-lg text-emerald-600">
                            {order.total.toLocaleString('vi-VN')}đ
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => toggleOrderDetails(order.id)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                            >
                              <FaEye className="w-4 h-4" />
                              {expandedOrder === order.id ? 'Ẩn' : 'Xem'}
                            </button>
                            {order.status === 'Đang xử lý' && (
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                              >
                                <FaTimes className="w-4 h-4" />
                                Hủy đơn
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {expandedOrder === order.id && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50">
                            <div className="bg-white rounded-xl p-6 shadow-inner">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Order Information */}
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaCreditCard className="w-4 h-4 text-blue-500" />
                                    Thông tin đơn hàng:
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <FaCreditCard className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-600">Thanh toán:</span>
                                      <span className="font-medium">{order.paymentMethod}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <FaMapMarkerAlt className="w-3 h-3 text-gray-400 mt-0.5" />
                                      <span className="text-gray-600">Địa chỉ:</span>
                                      <span className="font-medium">{order.shippingAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FaBox className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-600">Số sản phẩm:</span>
                                      <span className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Quick Stats */}
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaDollarSign className="w-4 h-4 text-green-500" />
                                    Tổng quan:
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-600">Ngày đặt:</span>
                                      <span className="font-medium">{new Date(order.date).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FaDollarSign className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-600">Tổng tiền:</span>
                                      <span className="font-bold text-green-600">{order.total.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(order.status)}
                                      <span className="text-gray-600">Trạng thái:</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <FaBox className="w-4 h-4 text-green-500" />
                                Chi tiết sản phẩm:
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {order.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                        <FaLeaf className="w-5 h-5 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-medium text-gray-800">{item.name}</h5>
                                        <div className="flex justify-between items-center mt-1">
                                          <span className="text-sm text-gray-600">SL: {item.quantity}</span>
                                          <span className="font-semibold text-green-600">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào.</p>
              <p className="text-gray-400 mt-2">Hãy bắt đầu đặt hàng để theo dõi lịch sử mua hàng của bạn!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}