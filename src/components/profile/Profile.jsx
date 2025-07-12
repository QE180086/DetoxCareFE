import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineEdit, AiOutlineLock, AiOutlineShopping, AiOutlineGift, AiOutlineSave, AiOutlineClose, AiOutlineLogout } from 'react-icons/ai';
import { FaLeaf } from 'react-icons/fa';
import { getProfileByUserId, updateProfile } from '../../state/Profile/Action';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Safely handle undefined state.profile with fallback values
  const profileState = useSelector((state) => state.profile || { loading: false, error: null, profile: null });
  const { loading, error, profile } = profileState;
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Thuong Nguyen',
    email: 'thuong@example.com',
    phone: '0901234567',
    gender: 'Nam',
    birthday: '1998-12-20',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    avatar: 'https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg',
    joined: '2023-01-15',
    points: 1250,
    membershipLevel: 'Green Diamond',
    vouchers: [
      { code: 'DETOX10', discount: '10%', expiry: '2025-12-31' },
      { code: 'FREESHIP', discount: 'Free Shipping', expiry: '2025-11-30' },
      { code: 'DETOX20', discount: '20%', expiry: '2025-10-15' },
    ],
    lastOrder: '2025-07-01',
    preferredDetox: 'Green Juice Cleanse',
  });

  // Fetch profile on component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId') || 'currentUserId';
    if (token && userId) {
      dispatch(getProfileByUserId(userId, token));
    } else {
      console.warn('No token or userId found in localStorage');
    }
  }, [dispatch]);

  // Update userData when profile data is fetched
  useEffect(() => {
    if (profile) {
      setUserData((prev) => ({
        ...prev,
        name: profile.fullName || null,
        email: profile.username || null,
        phone: profile.phoneNumber || null,
        gender: profile.gender ? (profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : null) : null,
        birthday: profile.dateOfBirth || null,
        address: profile.addresses?.[0]?.addressLine || null,
        avatar: profile.avatar || null,
        joined: profile.createdDate?.split('T')[0] || null,
        points: profile.points !== undefined ? profile.points : null,
        membershipLevel: profile.membershipLevel || null,
        vouchers: profile.vouchers || null,
        lastOrder: profile.lastOrder || null,
        preferredDetox: profile.preferredDetox || null,
      }));
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId') || 'currentUserId'; // Replace with actual userId logic
    if (token && userId) {
      const profileData = {
        userId,
        fullName: userData.name,
        username: userData.email,
        phoneNumber: userData.phone,
        gender: userData.gender === 'Nam' ? 'MALE' : userData.gender === 'Nữ' ? 'FEMALE' : userData.gender,
        dateOfBirth: userData.birthday,
        addresses: userData.address ? [{ addressLine: userData.address }] : [],
        avatar: userData.avatar,
        preferredDetox: userData.preferredDetox,
      }; // Adjust based on API requirements
      dispatch(updateProfile(profileData, token));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert to original data (from profile or default)
    setUserData({
      name: profile?.fullName || 'Thuong Nguyen',
      email: profile?.username || 'thuong@example.com',
      phone: profile?.phoneNumber || '0901234567',
      gender: profile?.gender ? (profile?.gender === 'MALE' ? 'Nam' : profile?.gender === 'FEMALE' ? 'Nữ' : null) : 'Nam',
      birthday: profile?.dateOfBirth || '1998-12-20',
      address: profile?.addresses?.[0]?.addressLine || '123 Đường ABC, Quận 1, TP.HCM',
      avatar: profile?.avatar || 'https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg',
      joined: profile?.createdDate?.split('T')[0] || '2023-01-15',
      points: profile?.points !== undefined ? profile.points : 1250,
      membershipLevel: profile?.membershipLevel || 'Green Diamond',
      vouchers: profile?.vouchers || [
        { code: 'DETOX10', discount: '10%', expiry: '2025-12-31' },
        { code: 'FREESHIP', discount: 'Free Shipping', expiry: '2025-11-30' },
        { code: 'DETOX20', discount: '20%', expiry: '2025-10-15' },
      ],
      lastOrder: profile?.lastOrder || '2025-07-01',
      preferredDetox: profile?.preferredDetox || 'Green Juice Cleanse',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const ChangePasswordPopup = () => {
    const [formData, setFormData] = useState({
      oldPassword: '',
      newPassword: '',
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError('');
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.oldPassword || !formData.newPassword) {
        setError('Vui lòng nhập cả mật khẩu cũ và mật khẩu mới');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }
      // Simulate API call to change password
      console.log('Changing password:', formData);
      setShowChangePassword(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
            <FaLeaf className="text-green-600" /> Đổi Mật Khẩu
          </h2>

          <div className="space-y-6">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Mật khẩu cũ
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-2 pl-10 pr-4"
                  placeholder="Nhập mật khẩu cũ"
                />
                <AiOutlineLock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-2 pl-10 pr-4"
                  placeholder="Nhập mật khẩu mới"
                />
                <AiOutlineLock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 justify-center">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-md"
            >
              <AiOutlineSave /> Lưu
            </button>
            <button
              onClick={() => setShowChangePassword(false)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md"
            >
              <AiOutlineClose /> Hủy
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-green-800 text-center mb-10 flex items-center justify-center gap-2">
          <FaLeaf className="text-green-600" /> Hồ Sơ Detox Của Bạn
        </h2>

        {loading && (
          <div className="text-center">
            <p className="text-green-600 font-medium">Đang tải thông tin...</p>
          </div>
        )}
        {error && (
          <div className="text-center">
            <p className="text-red-500 font-medium">Lỗi: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 text-white">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={userData.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                />
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="text-2xl font-bold bg-transparent border-b border-white focus:outline-none text-white"
                      />
                    ) : (
                      <h3 className="text-2xl font-bold">{userData.name || 'N/A'}</h3>
                    )}
                    {isEditing && <AiOutlineEdit className="text-white" />}
                  </div>
                  <p className="text-sm opacity-80">Thành viên từ {userData.joined || 'N/A'}</p>
                  <p className="text-sm font-medium mt-1">Cấp độ: {userData.membershipLevel || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Thông tin cá nhân */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                    Thông Tin Cá Nhân
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={userData.email || ''}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-1"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{userData.email || 'N/A'}</p>
                        )}
                      </div>
                      {isEditing && <AiOutlineEdit className="text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={userData.phone || ''}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-1"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{userData.phone || 'N/A'}</p>
                        )}
                      </div>
                      {isEditing && <AiOutlineEdit className="text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600">Giới tính</label>
                        {isEditing ? (
                          <select
                            name="gender"
                            value={userData.gender || ''}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-1"
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 font-medium">{userData.gender || 'N/A'}</p>
                        )}
                      </div>
                      {isEditing && <AiOutlineEdit className="text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600">Ngày sinh</label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="birthday"
                            value={userData.birthday || ''}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-1"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{userData.birthday || 'N/A'}</p>
                        )}
                      </div>
                      {isEditing && <AiOutlineEdit className="text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600">Địa chỉ</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            value={userData.address || ''}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-1"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{userData.address || 'N/A'}</p>
                        )}
                      </div>
                      {isEditing && <AiOutlineEdit className="text-green-500" />}
                    </div>
                  </div>
                </div>

                {/* Thông tin detox */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                    Thông Tin Detox
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Điểm tích lũy</label>
                      <p className="text-green-600 font-bold text-lg">{userData.points !== null ? `${userData.points} điểm` : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Đơn hàng gần nhất</label>
                      <p className="text-gray-900 font-medium">{userData.lastOrder || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600">Loại Detox ưa thích</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="preferredDetox"
                            value={userData.preferredDetox || ''}
                            onChange={handleInputChange}
                            className="w-full border-b border-gray-300 focus:border-green-500 focus:outline-none py-1"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{userData.preferredDetox || 'N/A'}</p>
                        )}
                      </div>
                      {isEditing && <AiOutlineEdit className="text-green-500" />}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Vouchers</label>
                      {userData.vouchers ? (
                        userData.vouchers.length > 0 ? (
                          <ul className="space-y-2">
                            {userData.vouchers.map((voucher, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-900">
                                <AiOutlineGift className="text-green-500" />
                                <span>{voucher.code} - {voucher.discount} (Hết hạn: {voucher.expiry})</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">Chưa có voucher nào</p>
                        )
                      ) : (
                        <p className="text-gray-500 italic">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8 justify-center">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-md"
                    >
                      <AiOutlineSave /> Lưu thay đổi
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md"
                    >
                      <AiOutlineClose /> Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md"
                    >
                      <AiOutlineEdit /> Chỉnh sửa hồ sơ
                    </button>
                    <button
                      onClick={() => navigate('/history-order')}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-md"
                    >
                      <AiOutlineShopping /> Lịch sử đơn hàng
                    </button>
                    <button
                      onClick={() => setShowChangePassword(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition shadow-md"
                    >
                      <AiOutlineLock /> Đổi mật khẩu
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md"
                    >
                      <AiOutlineLogout /> Đăng xuất
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-green-600 font-medium hover:text-green-800 transition flex items-center gap-2 mx-auto"
          >
            <FaLeaf /> Quay lại trang chủ
          </button>
        </div>

        {/* Change Password Popup */}
        {showChangePassword && <ChangePasswordPopup />}
      </div>
    </div>
  );
}