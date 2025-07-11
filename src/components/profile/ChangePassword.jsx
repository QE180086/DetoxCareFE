import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLock, AiOutlineSave, AiOutlineClose } from 'react-icons/ai';
import { FaLeaf } from 'react-icons/fa';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(true); // Popup is shown by default

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
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
    setShowPopup(false);
    navigate('/profile'); // Redirect back to profile after success
  };

  const handleCancel = () => {
    setShowPopup(false);
    navigate('/profile'); // Redirect back to profile
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {showPopup && (
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
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md"
              >
                <AiOutlineClose /> Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}