import React from 'react';
import { useNavigate } from 'react-router-dom';
import {  AiOutlineEye } from 'react-icons/ai';
import { FaLeaf } from 'react-icons/fa';

export default function HistoryOrders() {
  const navigate = useNavigate();

  // Giả lập dữ liệu lịch sử đơn hàng
  const orders = [
    {
      id: 'DH001',
      date: '2025-07-01',
      total: 450000,
      status: 'Đã giao',
      items: [
        { name: 'Green Juice Cleanse', quantity: 2, price: 150000 },
        { name: 'Detox Tea Blend', quantity: 1, price: 150000 },
      ],
    },
    {
      id: 'DH002',
      date: '2025-06-15',
      total: 300000,
      status: 'Đã giao',
      items: [
        { name: 'Berry Detox Smoothie', quantity: 1, price: 120000 },
        { name: 'Herbal Detox Kit', quantity: 1, price: 180000 },
      ],
    },
    {
      id: 'DH003',
      date: '2025-05-20',
      total: 200000,
      status: 'Đang xử lý',
      items: [
        { name: 'Lemon Ginger Detox', quantity: 2, price: 100000 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-green-800 text-center mb-10 flex items-center justify-center gap-2">
          <FaLeaf className="text-green-600" /> Lịch Sử Đơn Hàng
        </h2>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-green-700">
                          Đơn hàng #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">Ngày đặt: {order.date}</p>
                        <p className="text-sm text-gray-600">
                          Tổng tiền: {order.total.toLocaleString('vi-VN')} VNĐ
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            order.status === 'Đã giao'
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          Trạng thái: {order.status}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-md"
                      >
                        <AiOutlineEye /> Xem chi tiết
                      </button>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-600">Sản phẩm:</h4>
                      <ul className="mt-2 space-y-2">
                        {order.items.map((item, index) => (
                          <li key={index} className="text-gray-900 text-sm">
                            {item.name} x {item.quantity} -{' '}
                            {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">
                Bạn chưa có đơn hàng nào.
              </p>
            )}
          </div>
        </div>

        {/* Back to Profile */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/profile')}
            className="text-green-600 font-medium hover:text-green-800 transition flex items-center gap-2 mx-auto"
          >
            <FaLeaf /> Quay lại hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
}