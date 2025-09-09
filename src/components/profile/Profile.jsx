import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineEdit,
  AiOutlineLock,
  AiOutlineGift,
  AiOutlineSave,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineCalendar,
  AiOutlineEnvironment,
  AiOutlineTrophy,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaLeaf, FaMale, FaFemale } from "react-icons/fa";
import { updateProfile } from "../../state/Profile/Action";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileState = useSelector(
    (state) => state.profile || { loading: false, error: null, profile: null }
  );
  const { loading, error, profile } = profileState;

  const [activeTab, setActiveTab] = useState("personal"); // 'personal', 'security', 'rewards'
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Thuong Nguyen",
    email: "thuong@example.com",
    phone: "0901234567",
    gender: "Nam",
    birthday: "1998-12-20",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    avatar:
      "https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg",
    joined: "2023-01-15",
    points: 1250,
    membershipLevel: "Green Diamond",
    vouchers: [
      {
        code: "DETOX10",
        discount: "10%",
        expiry: "2025-12-31",
        type: "percentage",
      },
      {
        code: "FREESHIP",
        discount: "Free Shipping",
        expiry: "2025-11-30",
        type: "shipping",
      },
      {
        code: "DETOX20",
        discount: "20%",
        expiry: "2025-10-15",
        type: "percentage",
      },
      {
        code: "SUMMER50",
        discount: "50.000đ",
        expiry: "2025-09-30",
        type: "fixed",
      },
    ],
    lastOrder: "2025-07-01",
    preferredDetox: "Green Juice Cleanse",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Fetch profile on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId") || "currentUserId";
    if (token && userId) {
      // dispatch(getProfileByUserId(userId, token));
    } else {
      console.warn("No token or userId found in localStorage");
    }
  }, [dispatch]);

  // Update userData when profile data is fetched
  useEffect(() => {
    if (profile) {
      setUserData((prev) => ({
        ...prev,
        name: profile.fullName || prev.name,
        email: profile.username || prev.email,
        phone: profile.phoneNumber || prev.phone,
        gender: profile.gender
          ? profile.gender === "MALE"
            ? "Nam"
            : profile.gender === "FEMALE"
            ? "Nữ"
            : prev.gender
          : prev.gender,
        birthday: profile.dateOfBirth || prev.birthday,
        address: profile.addresses?.[0]?.addressLine || prev.address,
        avatar: profile.avatar || prev.avatar,
        joined: profile.createdDate?.split("T")[0] || prev.joined,
        points: profile.points !== undefined ? profile.points : prev.points,
        membershipLevel: profile.membershipLevel || prev.membershipLevel,
        vouchers: profile.vouchers || prev.vouchers,
        lastOrder: profile.lastOrder || prev.lastOrder,
        preferredDetox: profile.preferredDetox || prev.preferredDetox,
      }));
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleSave = () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId") || "currentUserId";
    if (token && userId) {
      const profileData = {
        userId,
        fullName: userData.name,
        username: userData.email,
        phoneNumber: userData.phone,
        gender:
          userData.gender === "Nam"
            ? "MALE"
            : userData.gender === "Nữ"
            ? "FEMALE"
            : userData.gender,
        dateOfBirth: userData.birthday,
        addresses: userData.address ? [{ addressLine: userData.address }] : [],
        avatar: userData.avatar,
        preferredDetox: userData.preferredDetox,
      };
      dispatch(updateProfile(profileData, token));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUserData({
      name: profile?.fullName || "Thuong Nguyen",
      email: profile?.username || "thuong@example.com",
      phone: profile?.phoneNumber || "0901234567",
      gender: profile?.gender
        ? profile?.gender === "MALE"
          ? "Nam"
          : profile?.gender === "FEMALE"
          ? "Nữ"
          : "Nam"
        : "Nam",
      birthday: profile?.dateOfBirth || "1998-12-20",
      address:
        profile?.addresses?.[0]?.addressLine || "123 Đường ABC, Quận 1, TP.HCM",
      avatar:
        profile?.avatar ||
        "https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg",
      joined: profile?.createdDate?.split("T")[0] || "2023-01-15",
      points: profile?.points !== undefined ? profile.points : 1250,
      membershipLevel: profile?.membershipLevel || "Green Diamond",
      vouchers: profile?.vouchers || [
        {
          code: "DETOX10",
          discount: "10%",
          expiry: "2025-12-31",
          type: "percentage",
        },
        {
          code: "FREESHIP",
          discount: "Free Shipping",
          expiry: "2025-11-30",
          type: "shipping",
        },
        {
          code: "DETOX20",
          discount: "20%",
          expiry: "2025-10-15",
          type: "percentage",
        },
      ],
      lastOrder: profile?.lastOrder || "2025-07-01",
      preferredDetox: profile?.preferredDetox || "Green Juice Cleanse",
    });
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Simulate API call
    console.log("Changing password:", passwordData);
    setPasswordSuccess("Đổi mật khẩu thành công!");
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const getVoucherIcon = (type) => {
    switch (type) {
      case "percentage":
        return "%";
      case "shipping":
        return "🚚";
      case "fixed":
        return "₫";
      default:
        return "🎁";
    }
  };

  const getVoucherColor = (type) => {
    switch (type) {
      case "percentage":
        return "bg-gradient-to-r from-red-400 to-red-600";
      case "shipping":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      case "fixed":
        return "bg-gradient-to-r from-purple-400 to-purple-600";
      default:
        return "bg-gradient-to-r from-green-400 to-green-600";
    }
  };

  const TabButton = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsEditing(false);
        setPasswordError("");
        setPasswordSuccess("");
      }}
      className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
        isActive
          ? "bg-green-600 text-white shadow-lg transform scale-105"
          : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 shadow-md"
      }`}
    >
      {icon}
      <span className="hidden sm:block">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
            Hồ Sơ Detox Của Bạn
          </h1>
          <p className="text-gray-600 text-lg">
            Quản lý thông tin cá nhân và theo dõi hành trình detox của bạn
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="text-green-600 font-medium mt-4">
              Đang tải thông tin...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
              <p className="text-red-500 font-medium">Lỗi: {error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white text-center">
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold">
                    {userData.name || "N/A"}
                  </h3>
                  <p className="text-sm opacity-90 mt-1">
                    Thành viên từ {userData.joined || "N/A"}
                  </p>
                  <div className="mt-3 px-3 py-1 bg-white bg-opacity-20 rounded-full inline-block">
                    <span className="text-sm font-medium">
                      {userData.membershipLevel || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex justify-center items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {userData.points !== null ? userData.points : "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">Điểm tích lũy</div>
                    </div>
                    <div className="w-px h-12 bg-gray-300"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {userData.vouchers?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Vouchers</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="space-y-3">
                <TabButton
                  id="personal"
                  label="Thông tin cá nhân"
                  icon={<AiOutlineUser size={20} />}
                  isActive={activeTab === "personal"}
                />
                <TabButton
                  id="security"
                  label="Bảo mật"
                  icon={<AiOutlineLock size={20} />}
                  isActive={activeTab === "security"}
                />
                <TabButton
                  id="rewards"
                  label="Phần thưởng"
                  icon={<AiOutlineGift size={20} />}
                  isActive={activeTab === "rewards"}
                />
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg"
              >
                <AiOutlineLogout size={20} />
                <span className="hidden sm:block">Đăng xuất</span>
              </button>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Personal Information Tab */}
                {activeTab === "personal" && (
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <AiOutlineUser className="text-green-600" size={28} />
                        Thông Tin Cá Nhân
                      </h2>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          <AiOutlineEdit size={16} />
                          Chỉnh sửa
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Họ và tên */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <AiOutlineUser size={16} />
                          Họ và tên
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={userData.name || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                            placeholder="Nhập họ và tên"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {userData.name || "N/A"}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <AiOutlineMail size={16} />
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={userData.email || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                            placeholder="Nhập email"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {userData.email || "N/A"}
                          </div>
                        )}
                      </div>

                      {/* Số điện thoại */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <AiOutlinePhone size={16} />
                          Số điện thoại
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={userData.phone || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                            placeholder="Nhập số điện thoại"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {userData.phone || "N/A"}
                          </div>
                        )}
                      </div>

                      {/* Giới tính */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          {userData.gender === "Nam" ? (
                            <FaMale size={16} />
                          ) : (
                            <FaFemale size={16} />
                          )}
                          Giới tính
                        </label>
                        {isEditing ? (
                          <select
                            name="gender"
                            value={userData.gender || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                          </select>
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {userData.gender || "N/A"}
                          </div>
                        )}
                      </div>

                      {/* Ngày sinh */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <AiOutlineCalendar size={16} />
                          Ngày sinh
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="birthday"
                            value={userData.birthday || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {userData.birthday || "N/A"}
                          </div>
                        )}
                      </div>

                      {/* Loại detox ưa thích */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <FaLeaf size={16} />
                          Loại Detox ưa thích
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="preferredDetox"
                            value={userData.preferredDetox || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                            placeholder="Nhập loại detox ưa thích"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                            {userData.preferredDetox || "N/A"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Địa chỉ - Full width */}
                    <div className="mt-6 space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <AiOutlineEnvironment size={16} />
                        Địa chỉ
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={userData.address || ""}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition resize-none"
                          placeholder="Nhập địa chỉ đầy đủ"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                          {userData.address || "N/A"}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for Editing */}
                    {isEditing && (
                      <div className="flex gap-4 mt-8 justify-end">
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                          <AiOutlineClose size={16} />
                          Hủy
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <AiOutlineSave size={16} />
                          Lưu thay đổi
                        </button>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <AiOutlineShoppingCart size={20} />
                        Thông Tin Mua Sắm
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="px-4 py-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600">
                            Đơn hàng gần nhất
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            {userData.lastOrder || "N/A"}
                          </div>
                        </div>
                        <div className="px-4 py-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-gray-600">
                            Cấp độ thành viên
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            {userData.membershipLevel || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                      <AiOutlineLock className="text-green-600" size={28} />
                      Bảo Mật Tài Khoản
                    </h2>

                    <div className="max-w-md mx-auto">
                      <form
                        onSubmit={handlePasswordSubmit}
                        className="space-y-6"
                      >
                        {passwordError && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm font-medium">
                              {passwordError}
                            </p>
                          </div>
                        )}

                        {passwordSuccess && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-600 text-sm font-medium">
                              {passwordSuccess}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <AiOutlineLock size={16} />
                            Mật khẩu cũ
                          </label>
                          <input
                            type="password"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                            placeholder="Nhập mật khẩu hiện tại"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <AiOutlineLock size={16} />
                            Mật khẩu mới
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                            placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <AiOutlineLock size={16} />
                            Xác nhận mật khẩu mới
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition"
                            placeholder="Nhập lại mật khẩu mới"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-medium"
                        >
                          <AiOutlineSave size={16} />
                          Đổi mật khẩu
                        </button>
                      </form>

                      {/* Security Tips */}
                      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">
                          💡 Mẹo bảo mật:
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Sử dụng mật khẩu mạnh với ít nhất 6 ký tự</li>
                          <li>
                            • Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
                          </li>
                          <li>• Không chia sẻ mật khẩu với người khác</li>
                          <li>• Đổi mật khẩu định kỳ để bảo mật tài khoản</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rewards Tab */}
                {activeTab === "rewards" && (
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                      <AiOutlineGift className="text-green-600" size={28} />
                      Phần Thưởng & Ưu Đãi
                    </h2>

                    {/* Points Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3">
                          <AiOutlineTrophy size={24} />
                          <div>
                            <div className="text-2xl font-bold">
                              {userData.points !== null
                                ? userData.points
                                : "N/A"}
                            </div>
                            <div className="text-sm opacity-90">
                              Điểm hiện tại
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3">
                          <AiOutlineGift size={24} />
                          <div>
                            <div className="text-2xl font-bold">
                              {userData.vouchers?.length || 0}
                            </div>
                            <div className="text-sm opacity-90">
                              Voucher khả dụng
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3">
                          <FaLeaf size={24} />
                          <div>
                            <div className="text-lg font-bold">
                              {userData.membershipLevel || "N/A"}
                            </div>
                            <div className="text-sm opacity-90">
                              Cấp thành viên
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vouchers Grid */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        Voucher của bạn
                      </h3>
                      {userData.vouchers && userData.vouchers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {userData.vouchers.map((voucher, index) => (
                            <div
                              key={index}
                              className={`${getVoucherColor(
                                voucher.type
                              )} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
                                      {getVoucherIcon(voucher.type)}
                                    </div>
                                    <div>
                                      <div className="font-bold text-lg">
                                        {voucher.code}
                                      </div>
                                      <div className="text-sm opacity-90">
                                        Mã voucher
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm opacity-90">
                                        Giảm giá:
                                      </span>
                                      <span className="font-bold">
                                        {voucher.discount}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <AiOutlineCalendar size={14} />
                                      <span className="text-sm opacity-90">
                                        Hết hạn: {voucher.expiry}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="ml-4">
                                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                                    Sử dụng
                                  </button>
                                </div>
                              </div>

                              {/* Decorative elements */}
                              <div className="absolute top-4 right-4 w-20 h-20 bg-white bg-opacity-5 rounded-full"></div>
                              <div className="absolute bottom-4 left-4 w-12 h-12 bg-white bg-opacity-5 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AiOutlineGift
                              size={32}
                              className="text-gray-400"
                            />
                          </div>
                          <p className="text-gray-500 text-lg font-medium">
                            Chưa có voucher nào
                          </p>
                          <p className="text-gray-400 text-sm mt-2">
                            Tích điểm để nhận voucher hấp dẫn!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Points Usage Guide */}
                    <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <AiOutlineTrophy className="text-green-600" />
                        Cách tích điểm
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold">
                              +10
                            </span>
                          </div>
                          <span className="text-gray-700">
                            Mỗi đơn hàng thành công
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">+5</span>
                          </div>
                          <span className="text-gray-700">
                            Chia sẻ sản phẩm
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold">
                              +20
                            </span>
                          </div>
                          <span className="text-gray-700">
                            Đánh giá sản phẩm
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-bold">
                              +50
                            </span>
                          </div>
                          <span className="text-gray-700">
                            Giới thiệu bạn bè
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-medium rounded-xl hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaLeaf size={18} />
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
