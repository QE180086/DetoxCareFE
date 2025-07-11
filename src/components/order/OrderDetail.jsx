import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import { AiOutlineShopping } from 'react-icons/ai';

// Giả lập dữ liệu đơn hàng
const orderData = {
  DH001: {
    id: 'DH001',
    date: '2025-07-01',
    total: 450000,
    status: 'Đã giao',
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    paymentMethod: 'Thanh toán khi nhận hàng',
    items: [
      {
        name: 'Detox Chanh',
        quantity: 2,
        price: 150000,
        image: 'https://file.hstatic.net/200000240163/article/nuoc_detox_chanh_676db881894d48ab9c0fcbdb1c5cdf6c_1024x1024.jpg'

      },
      {
        name: 'Detox Tắc',
        quantity: 1,
        price: 150000,
        image: 'https://i1-suckhoe.vnecdn.net/2025/05/29/tra-quat-mat-ong-1748487492-6164-1748487528.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=A4N3puvncI_bfPCN7OhQzA',
      },
    ],
  },
  DH002: {
    id: 'DH002',
    date: '2025-06-15',
    total: 300000,
    status: 'Đã giao',
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    paymentMethod: 'Thẻ tín dụng',
    items: [
      {
        name: 'Berry Detox Smoothie',
        quantity: 1,
        price: 120000,
        image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=400&auto=format&fit=crop',
      },
      {
        name: 'Herbal Detox Kit',
        quantity: 1,
        price: 180000,
        image: 'https://images.unsplash.com/photo-1624979449433-9fd73c79c0d7?q=80&w=400&auto=format&fit=crop',
      },
    ],
  },
  DH003: {
    id: 'DH003',
    date: '2025-05-20',
    total: 200000,
    status: 'Đang xử lý',
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    paymentMethod: 'Chuyển khoản ngân hàng',
    items: [
      {
        name: 'Lemon Ginger Detox',
        quantity: 2,
        price: 100000,
        image: 'https://images.unsplash.com/photo-1517486430290-35657bdcef51?q=80&w=400&auto=format&fit=crop',
      },
    ],
  },
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = orderData[orderId] || null;

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-green-800 mb-10 flex items-center justify-center gap-2">
            <FaLeaf className="text-green-600" /> Đơn Hàng Không Tồn Tại
          </h2>
          <button
            onClick={() => navigate('/history-order')}
            className="text-green-600 font-medium hover:text-green-800 transition flex items-center gap-2 mx-auto"
          >
            <FaLeaf /> Quay lại lịch sử đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-green-800 text-center mb-10 flex items-center justify-center gap-2">
          <FaLeaf className="text-green-600" /> Chi Tiết Đơn Hàng #{order.id}
        </h2>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                  Thông Tin Đơn Hàng
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Mã đơn hàng</label>
                  <p className="text-gray-900 font-medium">{order.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Ngày đặt hàng</label>
                  <p className="text-gray-900 font-medium">{order.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Trạng thái</label>
                  <p
                    className={`text-sm font-medium ${
                      order.status === 'Đã giao' ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    {order.status}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                  Thông Tin Thanh Toán & Giao Hàng
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Tổng tiền</label>
                  <p className="text-gray-900 font-medium">{order.total.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phương thức thanh toán</label>
                  <p className="text-gray-900 font-medium">{order.paymentMethod}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Địa chỉ giao hàng</label>
                  <p className="text-gray-900 font-medium">{order.shippingAddress}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                Sản Phẩm Đã Đặt
              </h3>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start gap-4 border-b border-green-100 py-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover border border-green-200"
                  />
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    <p className="text-sm text-gray-600">
                      Giá: {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Orders */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/history-order')}
            className="text-green-600 font-medium hover:text-green-800 transition flex items-center gap-2 mx-auto"
          >
            <AiOutlineShopping /> Quay lại lịch sử đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}