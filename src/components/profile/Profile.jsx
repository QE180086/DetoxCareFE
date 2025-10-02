import React, { useState, useEffect, useRef } from "react";
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
  AiOutlinePhone,
  AiOutlineCalendar,
  AiOutlineEnvironment,
  AiOutlineTrophy,
  AiOutlineExclamationCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible
} from "react-icons/ai";
import { FaMale, FaFemale } from "react-icons/fa";
import { updateProfile, getProfileByUserId, clearProfileError } from "../../state/Profile/Action";
import { logout } from "../../state/Authentication/Action"; // Import logout action
import { profileApi } from "../../utils/api/profile.api";
import { cartItemApi } from "../../utils/api/cart-item.api";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileState = useSelector((state) => {
    return state.profile || { loading: false, error: null, profile: null };
  });

  const { loading, error, profile } = profileState;

  // Add this new selector to get the actual profile data from payload
  const profileData = useSelector((state) => {
    return state.profile?.profile?.payload || {};
  });

  const authState = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("personal"); // 'personal', 'security', 'rewards'
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    nickName: "",
    fullName: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    addresses: [], 
    avatar: "",
    vouchers: [],
  });
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [userVouchers, setUserVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [points, setPoints] = useState(0); // Add state for points
  
  // Add pagination state for vouchers
  const [currentVoucherPage, setCurrentVoucherPage] = useState(1);
  const vouchersPerPage = 4;
  const [totalVoucherPages, setTotalVoucherPages] = useState(1);
  
  const lastAddTimeRef = useRef(0);

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("userData state updated:", userData);
  }, [userData]);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch profile on component mount
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const userId = sessionStorage.getItem("userId");
    if (token && userId && userId !== "currentUserId") {
      console.log("Dispatching getProfileByUserId with userId:", userId);
      dispatch(getProfileByUserId(userId, token))
        .then(() => console.log("Profile action dispatched successfully"))
        .catch((error) => {
          // Show error in modal for failed profile fetching
          let errorMsg = "Có lỗi xảy ra khi tải thông tin hồ sơ. Vui lòng thử lại.";
          if (error && typeof error === 'object') {
            if (error.message) {
              errorMsg = error.message;
            } else if (error.messageDetail) {
              errorMsg = error.messageDetail;
            } else {
              errorMsg = JSON.stringify(error);
            }
          } else if (typeof error === 'string') {
            errorMsg = error;
          }
          
          setErrorMessage(errorMsg);
          setShowErrorModal(true);
          console.error("Error dispatching action:", error);
        });
        
      // Fetch point details
      fetchPointDetails(token);
    } else {
      console.warn("No token or userId found in sessionStorage");
    }
  }, [dispatch]);

  // Fetch user vouchers when component mounts
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    
    if (authState?.accessToken && userId) {
      fetchUserVouchers();
    }
  }, [authState?.accessToken]);

  // Calculate total voucher pages when userVouchers changes
  useEffect(() => {
    setTotalVoucherPages(Math.ceil(userVouchers.length / vouchersPerPage) || 1);
    // Reset to first page when vouchers change
    setCurrentVoucherPage(1);
  }, [userVouchers]);

  // Fetch vouchers from API
  const fetchUserVouchers = async () => {
    const userId = sessionStorage.getItem("userId");
    
    if (authState?.accessToken && userId) {
      setLoadingVouchers(true);
      try {
        // Fetch all vouchers (similar to SearchPage.jsx approach)
        const response = await cartItemApi.getUserVouchers(
          1, 1000, "createdDate", "desc", userId, authState.accessToken
        );
        
        // Check if response has content array
        const contentArray = response?.data?.content;
        if (!contentArray || !Array.isArray(contentArray)) {
          setUserVouchers([]);
          return;
        }
        
        // Transform API response to match existing format
        // Only show vouchers with used: false
        const vouchers = contentArray
          .filter(item => {
            // Check if item and used property exist
            return item && item.used === false; // Only show unused vouchers
          })
          .map(item => {
            // Check if voucher exists
            if (!item.voucher) {
              return null;
            }
            
            const voucherData = {
              code: item.voucher.code || "",
              label: item.voucher.code || "", // Display only the code
              discountPercentage: item.voucher.percentage ? (item.voucher.discountValue / 100) : 0,
              ...item.voucher
            };
            
            return voucherData;
          })
          .filter(voucher => voucher !== null); // Remove any null entries
        
        setUserVouchers(vouchers);
      } catch (error) {
        console.error("Error fetching user vouchers:", error);
        setUserVouchers([]);
      } finally {
        setLoadingVouchers(false);
      }
    }
  };
  
  // Fetch point details from API
  const fetchPointDetails = async (accessToken) => {
    try {
      const response = await profileApi.getPointDetail(accessToken);
      if (response && response.data && response.data.currentPoints !== undefined) {
        setPoints(response.data.currentPoints);
      }
    } catch (error) {
      console.error("Error fetching point details:", error);
    }
  };

  // Calculate current vouchers to display
  const getCurrentVouchers = () => {
    const startIndex = (currentVoucherPage - 1) * vouchersPerPage;
    const endIndex = startIndex + vouchersPerPage;
    return userVouchers.slice(startIndex, endIndex);
  };

  // Update userData when profile data is fetched
  useEffect(() => {
    if (profile && profile.data) {
      // Create a new userData object with proper mapping
      const newUserData = {
        username: profile.data.username || "",
        nickName: profile.data.nickName || "",
        fullName: profile.data.fullName || "",
        phoneNumber: profile.data.phoneNumber || "",
        gender: profile.data.gender
          ? profile.data.gender === "MALE"
            ? "Nam"
            : profile.data.gender === "FEMALE"
            ? "Nữ"
            : ""
          : "",
        dateOfBirth: formatDate(profile.data.dateOfBirth) || "",
        addresses: Array.isArray(profile.data.addresses)
          ? profile.data.addresses.map(addr => ({
              addressLine: addr.address || "",
              isDefault: addr.default || false,
            }))
          : [], // Store all addresses
        avatar: profile.data.avatar || "",
        vouchers: Array.isArray(profile.data.vouchers)
          ? profile.data.vouchers
          : [],
      };

      console.log("New user data:", newUserData);
      setUserData(newUserData);
      
      // Store avatar in sessionStorage for persistence across page reloads
      if (profile.data.avatar) {
        sessionStorage.setItem('userAvatar', profile.data.avatar);
      }
    } else {
      console.log("No profile data available");
    }
  }, [profile]);

  // Show error modal when Redux error state changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowErrorModal(true);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // New function to handle address changes
  const handleAddressChange = (index, field, value) => {
    setUserData((prev) => {
      const newAddresses = [...prev.addresses];
      newAddresses[index] = { ...newAddresses[index], [field]: value };
      return { ...prev, addresses: newAddresses };
    });
  };

  // New function to add a new address
  const addNewAddress = () => {
    // Prevent adding multiple addresses too quickly
    const now = Date.now();
    if (now - lastAddTimeRef.current < 500) {
      return; // Ignore if called within 500ms of last call
    }
    lastAddTimeRef.current = now;
    
    // Always add a new address field
    setUserData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { addressLine: "", isDefault: false }],
    }));
  };

  // New function to remove an address
  const removeAddress = (index) => {
    setUserData((prev) => {
      const newAddresses = prev.addresses.filter((_, i) => i !== index);
      return { ...prev, addresses: newAddresses };
    });
  };

  // New function to set default address
  const handleSetDefaultAddress = (index) => {
    setUserData((prev) => {
      const newAddresses = prev.addresses.map((address, i) => ({
        ...address,
        isDefault: i === index,
      }));
      return { ...prev, addresses: newAddresses };
    });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Check if it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Parse the date and format it as YYYY-MM-DD
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordSuccess("");
  };

  const handleSave = () => {
    const token = sessionStorage.getItem("accessToken");
    const userId = sessionStorage.getItem("userId");
    if (token && userId && userId !== "currentUserId") {
      // Handle avatar upload if a new avatar was selected
      const avatarFileInput = document.getElementById("avatar-upload");
      const avatarFile = avatarFileInput?.files[0];
      
      const updateProfileData = async () => {
        let avatarUrl = userData.avatar;
        
        // Upload new avatar if selected
        if (avatarFile && avatarPreview) {
          try {
            const uploadResponse = await profileApi.uploadAvatar(avatarFile, token);
            avatarUrl = uploadResponse.data; // Get the URL from the response data
            
            // Store the new avatar URL in sessionStorage
            sessionStorage.setItem('userAvatar', avatarUrl);
          } catch (error) {
            // Handle upload error
            let errorMsg = "Có lỗi xảy ra khi tải ảnh đại diện lên. Vui lòng thử lại.";
            if (error && typeof error === 'object') {
              if (error.message) {
                errorMsg = error.message;
              } else if (error.messageDetail) {
                errorMsg = error.messageDetail;
              } else {
                errorMsg = JSON.stringify(error);
              }
            } else if (typeof error === 'string') {
              errorMsg = error;
            }
            
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
            return; // Don't proceed with profile update if avatar upload fails
          }
        }
        
        const profileData = {
          userId,
          username: userData.username,
          nickName: userData.nickName,
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          gender:
            userData.gender === "Nam"
              ? "MALE"
              : userData.gender === "Nữ"
              ? "FEMALE"
              : userData.gender,
          dateOfBirth: userData.dateOfBirth,
          addresses: userData.addresses.map((address, index) => ({
            address: address.addressLine || "",
            other: "",
            default: address.isDefault || false,
          })),
          avatar: avatarUrl || "",
        };
        
        try {
          await dispatch(updateProfile(profileData, token));
          console.log("Profile updated successfully");
          // Only exit editing mode on success
          setAvatarPreview(null);
          setIsEditing(false);
        } catch (error) {
          // Show error in modal instead of inline display
          let errorMsg = "Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.";
          if (error && typeof error === 'object') {
            if (error.message) {
              errorMsg = error.message;
            } else if (error.messageDetail) {
              errorMsg = error.messageDetail;
            } else {
              errorMsg = JSON.stringify(error);
            }
          } else if (typeof error === 'string') {
            errorMsg = error;
          }
          
          setErrorMessage(errorMsg);
          setShowErrorModal(true);
          // Keep editing mode on error so user can fix issues
        }
      };
      
      updateProfileData();
    } else {
      // If no token or userId, still exit editing mode
      setAvatarPreview(null);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile && profile.data) {
      setUserData({
        username: profile.data.username || "",
        nickName: profile.data.nickName || "",
        fullName: profile.data.fullName || "",
        phoneNumber: profile.data.phoneNumber || "",
        gender: profile.data.gender
          ? profile.data.gender === "MALE"
            ? "Nam"
            : profile.data.gender === "FEMALE"
            ? "Nữ"
            : ""
          : "",
        dateOfBirth: formatDate(profile.data.dateOfBirth) || "",
        addresses: Array.isArray(profile.data.addresses)
          ? profile.data.addresses.map(addr => ({
              addressLine: addr.address || "",
              isDefault: addr.default || false,
            }))
          : [],
        avatar: profile.data.avatar || "",
        vouchers: profile.data.vouchers || [],
      });
    }
    // Clear avatar preview and file input
    setAvatarPreview(null);
    const avatarFileInput = document.getElementById("avatar-upload");
    if (avatarFileInput) {
      avatarFileInput.value = "";
    }
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin");
      setShowErrorModal(true);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage("Mật khẩu mới phải có ít nhất 6 ký tự");
      setShowErrorModal(true);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      setShowErrorModal(true);
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      // Use the new changePassword API
      const passwordPayload = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      };

      await profileApi.changePassword(passwordPayload, token);
      
      setPasswordSuccess("Đổi mật khẩu thành công!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      let errorMsg = "Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.";
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMsg = error.message;
        } else if (error.messageDetail) {
          errorMsg = error.messageDetail;
        } else {
          errorMsg = JSON.stringify(error);
        }
      } else if (typeof error === 'string') {
        errorMsg = error;
      }
      
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    }
  };

  const handleLogout = () => {
    // Use the centralized logout action instead of manually removing items
    dispatch(logout());
    // Remove user avatar from sessionStorage on logout
    sessionStorage.removeItem('userAvatar');
    navigate("/login");
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    dispatch(clearProfileError());
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Here you would typically handle the file upload
      console.log("Avatar file selected:", file);
    }
  };

  // Simplified voucher functions - all vouchers use the same green color and have no icons
  const getVoucherIcon = () => "";
  const getVoucherColor = () => "bg-gradient-to-r from-green-500 to-green-600";

  const TabButton = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsEditing(false);
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

  // Get avatar source with fallback
  const getAvatarSource = () => {
    return avatarPreview || userData.avatar || "https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg";
  };

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

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white text-center">
                  <div className="relative inline-block">
                    <img
                      src={getAvatarSource()}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover mx-auto mb-4"
                    />
                    {isEditing && (
                      <div className="absolute bottom-4 right-0 bg-white rounded-full p-1 shadow-lg">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="avatar-upload"
                          onChange={handleAvatarChange}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer flex items-center justify-center w-6 h-6 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </label>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">
                    {userData.fullName || userData.nickName || "N/A"}
                  </h3>
                </div>
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex justify-center items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {points}
                      </div>
                      <div className="text-sm text-gray-600">Điểm tích lũy</div>
                    </div>
                    <div className="w-px h-12 bg-gray-300"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {userVouchers.length}
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
                  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                    <div className="max-w-7xl mx-auto">
                      {/* Header Section */}
                      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <AiOutlineUser className="text-white" size={32} />
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold text-gray-800">
                                Thông Tin Cá Nhân
                              </h2>
                              <p className="text-gray-600 mt-1">
                                Quản lý thông tin cá nhân của bạn
                              </p>
                            </div>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                              <AiOutlineEdit size={20} />
                              Chỉnh sửa
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Combined Personal Information Card */}
                      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                          <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                          Thông tin cá nhân
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {/* Nickname */}
                          <div className="group md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                              <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">
                                <AiOutlineUser
                                  size={14}
                                  className="text-purple-600"
                                />
                              </div>
                              Biệt danh
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="nickName"
                                value={userData.nickName || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 text-gray-900 font-medium placeholder-gray-400"
                                placeholder="Nhập biệt danh"
                              />
                            ) : (
                              <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 font-semibold border border-gray-200">
                                {userData.nickName || (
                                  <span className="text-gray-400 italic">
                                    Chưa cập nhật
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Full Name */}
                          <div className="group md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                              <div className="w-5 h-5 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <AiOutlineUser
                                  size={14}
                                  className="text-emerald-600"
                                />
                              </div>
                              Họ và tên
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="fullName"
                                value={userData.fullName || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 text-gray-900 font-medium placeholder-gray-400"
                                placeholder="Nhập họ và tên đầy đủ"
                              />
                            ) : (
                              <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 font-semibold border border-gray-200">
                                {userData.fullName || (
                                  <span className="text-gray-400 italic">
                                    Chưa cập nhật
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Phone Number */}
                          <div className="group md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                              <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                                <AiOutlinePhone
                                  size={14}
                                  className="text-green-600"
                                />
                              </div>
                              Số điện thoại
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                name="phoneNumber"
                                value={userData.phoneNumber || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 text-gray-900 font-medium placeholder-gray-400"
                                placeholder="Nhập số điện thoại"
                              />
                            ) : (
                              <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 font-semibold border border-gray-200">
                                {userData.phoneNumber || (
                                  <span className="text-gray-400 italic">
                                    Chưa cập nhật
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Gender */}
                          <div className="group md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                              <div className="w-5 h-5 bg-pink-100 rounded-lg flex items-center justify-center">
                                {userData.gender === "Nam" ? (
                                  <FaMale size={14} className="text-blue-600" />
                                ) : userData.gender === "Nữ" ? (
                                  <FaFemale
                                    size={14}
                                    className="text-pink-600"
                                  />
                                ) : (
                                  <AiOutlineUser
                                    size={14}
                                    className="text-gray-600"
                                  />
                                )}
                              </div>
                              Giới tính
                            </label>
                            {isEditing ? (
                              <select
                                name="gender"
                                value={userData.gender || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 text-gray-900 font-medium bg-white"
                              >
                                <option value="" className="text-gray-400">
                                  Chọn giới tính
                                </option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                              </select>
                            ) : (
                              <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 font-semibold border border-gray-200">
                                {userData.gender || (
                                  <span className="text-gray-400 italic">
                                    Chưa cập nhật
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Date of Birth */}
                          <div className="group md:col-span-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                              <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center">
                                <AiOutlineCalendar
                                  size={14}
                                  className="text-orange-600"
                                />
                              </div>
                              Ngày sinh
                            </label>
                            {isEditing ? (
                              <input
                                type="date"
                                name="dateOfBirth"
                                value={userData.dateOfBirth || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 text-gray-900 font-medium"
                              />
                            ) : (
                              <div className="px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-900 font-semibold border border-gray-200">
                                {formatDate(userData.dateOfBirth) || (
                                  <span className="text-gray-400 italic">
                                    Chưa cập nhật
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Address Section */}
                      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <div className="w-2 h-6 bg-gradient-to-b from-teal-500 to-blue-500 rounded-full"></div>
                            Địa chỉ
                          </h3>
                          {isEditing && (
                            <button
                              onClick={addNewAddress}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              <AiOutlineEnvironment size={16} />
                              Thêm địa chỉ
                            </button>
                          )}
                        </div>

                        {/* Address Table */}
                        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                                <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Địa chỉ</th>
                                <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 w-32">Mặc định</th>
                                {isEditing && (
                                  <th className="border-b border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 w-32">Hành động</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {userData.addresses.map((address, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                  <td className="border-b border-gray-200 px-4 py-3">
                                    {isEditing ? (
                                      <textarea
                                        value={address.addressLine || ""}
                                        onChange={(e) => handleAddressChange(index, "addressLine", e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:outline-none transition-all duration-300 resize-none text-gray-900 placeholder-gray-400 text-sm"
                                        placeholder="Nhập địa chỉ đầy đủ..."
                                      />
                                    ) : (
                                      <div className="px-3 py-2 text-gray-900 text-sm min-h-[40px] flex items-center">
                                        {address.addressLine || (
                                          <span className="text-gray-400 italic">
                                            Chưa cập nhật
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="border-b border-gray-200 px-4 py-3 text-center">
                                    {isEditing ? (
                                      <input
                                        type="checkbox"
                                        checked={address.isDefault || false}
                                        onChange={() => handleSetDefaultAddress(index)}
                                        className="w-4 h-4 text-teal-600 border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                      />
                                    ) : (
                                      <div className="flex justify-center">
                                        {address.isDefault ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                            Mặc định
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Phụ
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  {isEditing && (
                                    <td className="border-b border-gray-200 px-4 py-3 text-center">
                                      <button
                                        onClick={() => removeAddress(index)}
                                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg text-xs transition-all duration-300"
                                      >
                                        Xóa
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                              {isEditing && userData.addresses.length === 0 && (
                                <tr>
                                  <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                      <AiOutlineEnvironment size={24} className="text-gray-400 mb-2" />
                                      <span>Chưa có địa chỉ nào</span>
                                      <button
                                        onClick={addNewAddress}
                                        className="mt-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 text-sm"
                                      >
                                        <AiOutlineEnvironment size={14} />
                                        Thêm địa chỉ đầu tiên
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                              {!isEditing && userData.addresses.length === 0 && (
                                <tr>
                                  <td colSpan="2" className="px-4 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                      <AiOutlineEnvironment size={24} className="text-gray-400 mb-2" />
                                      <span>Chưa có địa chỉ nào</span>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {isEditing && (
                        <div className="flex gap-4 justify-end mt-8">
                          <button
                            onClick={handleCancel}
                            className="flex items-center gap-3 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                          >
                            <AiOutlineClose size={20} />
                            Hủy bỏ
                          </button>
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                          >
                            <AiOutlineSave size={20} />
                            Lưu thay đổi
                          </button>
                        </div>
                      )}
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
                          <div className="relative">
                            <input
                              type={showOldPassword ? "text" : "password"}
                              name="oldPassword"
                              value={passwordData.oldPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition pr-12"
                              placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                              {showOldPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                              ) : (
                                <AiOutlineEye size={20} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <AiOutlineLock size={16} />
                            Mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition pr-12"
                              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                              {showNewPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                              ) : (
                                <AiOutlineEye size={20} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <AiOutlineLock size={16} />
                            Xác nhận mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition pr-12"
                              placeholder="Nhập lại mật khẩu mới"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                              ) : (
                                <AiOutlineEye size={20} />
                              )}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-medium"
                        >
                          <AiOutlineSave size={16} />
                          Đổi mật khẩu
                        </button>
                      </form>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3">
                          <AiOutlineTrophy size={24} />
                          <div>
                            <div className="text-2xl font-bold">
                              {points}
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
                              {userVouchers.length}
                            </div>
                            <div className="text-sm opacity-90">
                              Voucher khả dụng
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
                      {loadingVouchers ? (
                        <div className="text-center py-12">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                          <p className="text-green-600 font-medium mt-4">
                            Đang tải voucher...
                          </p>
                        </div>
                      ) : userVouchers.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {getCurrentVouchers().map((voucher, index) => (
                              <div
                                key={(currentVoucherPage - 1) * vouchersPerPage + index}
                                className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                              >
                                {/* Background container */}
                                <div 
                                  className="relative h-full w-full"
                                  style={{
                                    backgroundImage: voucher.image ? `url(${voucher.image})` : 'none',
                                    backgroundColor: voucher.image ? 'transparent' : '#9ca3af', // gray-400
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '200px'
                                  }}
                                >
                                  {/* Dark overlay for text readability (only when there's an image) */}
                                  {voucher.image && (
                                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                                  )}
                                  
                                  {/* Voucher content */}
                                  <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                                    <div>
                                      <div className="mb-3">
                                        <div className="font-bold text-lg">
                                            {voucher.code}
                                          </div>
                                          <div className="text-sm opacity-90">
                                            Mã voucher
                                          </div>
                                      </div>

                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm opacity-90">
                                            Giảm giá:
                                          </span>
                                          <span className="font-bold">
                                            {voucher.discountValue?.toLocaleString("vi-VN") || 0}{voucher.percentage ? '%' : '₫'}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm opacity-90">
                                            Đơn tối thiểu:
                                          </span>
                                          <span className="font-bold">
                                            {voucher.minOrderValue?.toLocaleString("vi-VN") || 0} ₫
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mt-4">
                                      <button 
                                        className="bg-white text-gray-800 bg-opacity-90 hover:bg-opacity-100 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                        onClick={() => navigate("/search")}
                                      >
                                        Sử dụng
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Pagination */}
                          {totalVoucherPages > 1 && (
                            <nav className="flex justify-center items-center gap-2 mt-8">
                              <button
                                onClick={() => setCurrentVoucherPage((x) => Math.max(x - 1, 1))}
                                disabled={currentVoucherPage === 1}
                                className="px-4 py-2 rounded-full text-sm font-semibold transition
                                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                                  bg-green-600 text-white hover:bg-green-700 shadow"
                              >
                                Trước
                              </button>

                              {Array.from({ length: totalVoucherPages }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentVoucherPage(i + 1)}
                                  className={`w-9 h-9 rounded-full text-sm font-bold transition
                                    ${
                                      currentVoucherPage === i + 1
                                        ? "bg-green-700 text-white scale-110 shadow-md"
                                        : "bg-white text-green-700 border border-green-300 hover:bg-green-100"
                                    }`}
                                >
                                  {i + 1}
                                </button>
                              ))}

                              <button
                                onClick={() =>
                                  setCurrentVoucherPage((x) => Math.min(x + 1, totalVoucherPages))
                                }
                                disabled={currentVoucherPage === totalVoucherPages}
                                className="px-4 py-2 rounded-full text-sm font-semibold transition
                                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                                  bg-green-600 text-white hover:bg-green-700 shadow"
                              >
                                Sau
                              </button>
                            </nav>
                          )}
                        </>
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
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                  <AiOutlineExclamationCircle className="text-red-600 text-2xl" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Lỗi</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {errorMessage}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium"
                    onClick={handleCloseErrorModal}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}