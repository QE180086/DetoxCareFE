import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEdit, AiOutlineLock, AiOutlineShopping } from 'react-icons/ai';

export default function Profile() {
  const navigate = useNavigate();

  // Giả lập dữ liệu người dùng
  const user = {
    name: 'Thuong Nguyen',
    email: 'thuong@example.com',
    phone: '0901234567',
    gender: 'Nam', // Hoặc 'Nữ'
    birthday: '1998-12-20',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    avatar: 'https://i.pravatar.cc/150?img=3',
    joined: '2023-01-15',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-green-700 mb-8">Hồ sơ của bạn</h2>

      <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row p-6 gap-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center md:w-1/3">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-green-500 mb-4 object-cover"
          />
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">Thành viên từ {user.joined}</p>
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-800">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
              <p className="text-gray-800">{user.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Giới tính</label>
              <p className="text-gray-800">{user.gender}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Ngày sinh</label>
              <p className="text-gray-800">{user.birthday}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">Địa chỉ</label>
              <p className="text-gray-800">{user.address}</p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap mt-4">
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              <AiOutlineEdit /> Chỉnh sửa hồ sơ
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              <AiOutlineShopping /> Lịch sử đơn hàng
            </button>
            <button
              onClick={() => navigate('/change-password')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              <AiOutlineLock /> Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Quay lại */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate('/')}
          className="text-green-600 hover:underline"
        >
          ← Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}
