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
  AiOutlineEnvironment,
  AiOutlineTrophy,
  AiOutlineExclamationCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible
} from "react-icons/ai";
import { FaMale, FaFemale } from "react-icons/fa";
import { updateProfile, getProfileByUserId, clearProfileError } from "../../state/Profile/Action";
import { logout } from "../../state/Authentication/Action";
import { profileApi } from "../../utils/api/profile.api";
import { cartItemApi } from "../../utils/api/cart-item.api";
import { addressApi } from "../../utils/api/Address.api";

const SearchableDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled,
  loading
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div
        className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all duration-200 text-gray-900 bg-white cursor-pointer flex justify-between items-center ${
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-green-300'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-gray-500 text-center text-sm">Đang tải...</div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-3 cursor-pointer transition-colors text-sm ${
                    option.value === value
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-gray-500 text-center text-sm">Không tìm thấy kết quả</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileState = useSelector((state) => {
    return state.profile || { loading: false, error: null, profile: null };
  });

  const { loading, error, profile } = profileState;

  const profileData = useSelector((state) => {
    return state.profile?.profile?.payload || {};
  });

  const authState = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("personal");
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
  const [points, setPoints] = useState(0);

  const [currentVoucherPage, setCurrentVoucherPage] = useState(1);
  const vouchersPerPage = 4;
  const [totalVoucherPages, setTotalVoucherPages] = useState(1);

  const lastAddTimeRef = useRef(0);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    console.log("userData state updated:", userData);
  }, [userData]);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const userId = sessionStorage.getItem("userId");
    if (token && userId && userId !== "currentUserId") {
      console.log("Dispatching getProfileByUserId with userId:", userId);
      dispatch(getProfileByUserId(userId, token))
        .then(() => console.log("Profile action dispatched successfully"))
        .catch((error) => {
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

      fetchPointDetails(token);
    } else {
      console.warn("No token or userId found in sessionStorage");
    }
  }, [dispatch]);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (authState?.accessToken && userId) {
      fetchUserVouchers();
    }
  }, [authState?.accessToken]);

  useEffect(() => {
    setTotalVoucherPages(Math.ceil(userVouchers.length / vouchersPerPage) || 1);
    setCurrentVoucherPage(1);
  }, [userVouchers]);

  const fetchUserVouchers = async () => {
    const userId = sessionStorage.getItem("userId");

    if (authState?.accessToken && userId) {
      setLoadingVouchers(true);
      try {
        const response = await cartItemApi.getUserVouchers(
          1, 1000, "createdDate", "desc", userId, authState.accessToken
        );

        const contentArray = response?.data?.content;
        if (!contentArray || !Array.isArray(contentArray)) {
          setUserVouchers([]);
          return;
        }

        const vouchers = contentArray
          .filter(item => {
            return item && item.used === false;
          })
          .map(item => {
            if (!item.voucher) {
              return null;
            }

            const voucherData = {
              code: item.voucher.code || "",
              label: item.voucher.code || "",
              discountPercentage: item.voucher.percentage ? (item.voucher.discountValue / 100) : 0,
              ...item.voucher
            };

            return voucherData;
          })
          .filter(voucher => voucher !== null);

        setUserVouchers(vouchers);
      } catch (error) {
        console.error("Error fetching user vouchers:", error);
        setUserVouchers([]);
      } finally {
        setLoadingVouchers(false);
      }
    }
  };

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

  const getCurrentVouchers = () => {
    const startIndex = (currentVoucherPage - 1) * vouchersPerPage;
    const endIndex = startIndex + vouchersPerPage;
    return userVouchers.slice(startIndex, endIndex);
  };

  useEffect(() => {
    if (profile && profile.data) {
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
              provinceId: addr.provinceId || null,
              provinceName: addr.provinceName || "",
              districtId: addr.districtId || null,
              districtName: addr.districtName || "",
              wardCode: addr.wardCode || "",
              wardName: addr.wardName || "",
            }))
          : [],
        avatar: profile.data.avatar || "",
        vouchers: Array.isArray(profile.data.vouchers)
          ? profile.data.vouchers
          : [],
      };

      console.log("New user data:", newUserData);
      setUserData(newUserData);

      if (profile.data.avatar) {
        sessionStorage.setItem('userAvatar', profile.data.avatar);
      }
    } else {
      console.log("No profile data available");
    }
  }, [profile]);

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

  const handleAddressChange = (index, field, value) => {
    setUserData((prev) => {
      const newAddresses = [...prev.addresses];
      newAddresses[index] = { ...newAddresses[index], [field]: value };
      return { ...prev, addresses: newAddresses };
    });
  };

  const addNewAddress = () => {
    const now = Date.now();
    if (now - lastAddTimeRef.current < 500) {
      return;
    }
    lastAddTimeRef.current = now;

    setUserData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, {
        addressLine: "",
        isDefault: false,
        provinceId: null,
        provinceName: "",
        districtId: null,
        districtName: "",
        wardCode: "",
        wardName: ""
      }],
    }));
  };

  const removeAddress = (index) => {
    setUserData((prev) => {
      const newAddresses = prev.addresses.filter((_, i) => i !== index);
      return { ...prev, addresses: newAddresses };
    });
  };

  const handleSetDefaultAddress = (index) => {
    setUserData((prev) => {
      const newAddresses = prev.addresses.map((address, i) => ({
        ...address,
        isDefault: i === index,
      }));
      return { ...prev, addresses: newAddresses };
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

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
      const avatarFileInput = document.getElementById("avatar-upload");
      const avatarFile = avatarFileInput?.files[0];

      const updateProfileData = async () => {
        let avatarUrl = userData.avatar;

        if (avatarFile && avatarPreview) {
          try {
            const uploadResponse = await profileApi.uploadAvatar(avatarFile, token);
            avatarUrl = uploadResponse.data;

            sessionStorage.setItem('userAvatar', avatarUrl);
          } catch (error) {
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
            return;
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
            address: address.addressLine || `${address.provinceName}, ${address.districtName}, ${address.wardName}`,
            other: "",
            default: address.isDefault || false,
            provinceId: address.provinceId || null,
            districtId: address.districtId || null,
            wardCode: address.wardCode || "",
            provinceName: address.provinceName || "",
            districtName: address.districtName || "",
            wardName: address.wardName || "",
          })),
          avatar: avatarUrl || "",
        };

        try {
          await dispatch(updateProfile(profileData, token));
          console.log("Profile updated successfully");
          setAvatarPreview(null);
          setIsEditing(false);
        } catch (error) {
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
        }
      };

      updateProfileData();
    } else {
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
              provinceId: addr.provinceId || null,
              provinceName: addr.provinceName || "",
              districtId: addr.districtId || null,
              districtName: addr.districtName || "",
              wardCode: addr.wardCode || "",
              wardName: addr.wardName || "",
            }))
          : [],
        avatar: profile.data.avatar || "",
        vouchers: profile.data.vouchers || [],
      });
    }
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
    dispatch(logout());
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      console.log("Avatar file selected:", file);
    }
  };

  const getVoucherIcon = () => "";
  const getVoucherColor = () => "bg-gradient-to-r from-green-400 to-green-500";

  const TabButton = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsEditing(false);
        setPasswordSuccess("");
      }}
      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-medium transition-all duration-200 ${
        isActive
          ? "bg-green-400 text-white shadow-md"
          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-100"
      }`}
    >
      {icon}
      <span className="hidden sm:block">{label}</span>
    </button>
  );

  const getAvatarSource = () => {
    return avatarPreview || userData.avatar || "https://i.pinimg.com/736x/3e/ef/7a/3eef7adafb89a18819b0c3d3b9c93da8.jpg";
  };

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await addressApi.getProvinces();
        setProvinces(response.data || response || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (index, provinceId) => {
    setUserData((prev) => {
      const newAddresses = [...prev.addresses];
      const selectedProvince = provinces.find(p => p.ProvinceID === parseInt(provinceId));
      const provinceName = selectedProvince ? selectedProvince.ProvinceName : "";

      // Cập nhật addressLine khi thay đổi tỉnh
      const updatedAddressLine = `${provinceName}, ${newAddresses[index].districtName || ''}, ${newAddresses[index].wardName || ''}`.replace(/, \s*$/, '').replace(/^, |, $/g, '');

      newAddresses[index] = {
        ...newAddresses[index],
        provinceId: parseInt(provinceId),
        provinceName,
        districtId: null,
        districtName: "",
        wardCode: "",
        wardName: "",
        addressLine: updatedAddressLine // Cập nhật addressLine
      };
      return { ...prev, addresses: newAddresses };
    });

    if (provinceId) {
      try {
        setLoadingDistricts(true);
        const response = await addressApi.getDistricts(provinceId);
        setDistricts(response.data || response || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoadingDistricts(false);
      }
    } else {
      setDistricts([]);
    }

    setWards([]);
  };

  const handleDistrictChange = async (index, districtId) => {
    setUserData((prev) => {
      const newAddresses = [...prev.addresses];
      const selectedDistrict = districts.find(d => d.DistrictID === parseInt(districtId));
      const districtName = selectedDistrict ? selectedDistrict.DistrictName : "";

      // Cập nhật addressLine khi thay đổi huyện
      const updatedAddressLine = `${newAddresses[index].provinceName || ''}, ${districtName}, ${newAddresses[index].wardName || ''}`.replace(/, \s*$/, '').replace(/^, |, $/g, '');

      newAddresses[index] = {
        ...newAddresses[index],
        districtId: parseInt(districtId),
        districtName,
        wardCode: "",
        wardName: "",
        addressLine: updatedAddressLine // Cập nhật addressLine
      };
      return { ...prev, addresses: newAddresses };
    });

    if (districtId) {
      try {
        setLoadingWards(true);
        const response = await addressApi.getWards(districtId);
        setWards(response.data || response || []);
      } catch (error) {
        console.error("Error fetching wards:", error);
      } finally {
        setLoadingWards(false);
      }
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (index, wardCode) => {
    setUserData((prev) => {
      const newAddresses = [...prev.addresses];
      const selectedWard = wards.find(w => w.WardCode === wardCode);
      const wardName = selectedWard ? selectedWard.WardName : "";

      // Cập nhật addressLine khi thay đổi xã
      const updatedAddressLine = `${newAddresses[index].provinceName || ''}, ${newAddresses[index].districtName || ''}, ${wardName}`.replace(/, \s*$/, '').replace(/^, |, $/g, '');

      newAddresses[index] = {
        ...newAddresses[index],
        wardCode,
        wardName,
        addressLine: updatedAddressLine // Cập nhật addressLine
      };
      return { ...prev, addresses: newAddresses };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hồ Sơ Cá Nhân
          </h1>
          <p className="text-gray-500">
            Quản lý thông tin và cài đặt tài khoản của bạn
          </p>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">
              Đang tải thông tin...
            </p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                <div className="bg-gradient-to-br from-green-400 to-green-500 p-6 text-center">
                  <div className="relative inline-block">
                    <img
                      src={getAvatarSource()}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover mx-auto mb-3"
                    />
                    {isEditing && (
                      <div className="absolute bottom-3 right-0 bg-white rounded-full p-1.5 shadow-md">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="avatar-upload"
                          onChange={handleAvatarChange}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer flex items-center justify-center w-7 h-7 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          <AiOutlineEdit className="text-white text-sm" />
                        </label>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {userData.fullName || userData.nickName || "N/A"}
                  </h3>
                </div>
                <div className="p-5 bg-gray-50">
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {points}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Điểm</div>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {userVouchers.length}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Vouchers</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <TabButton
                  id="personal"
                  label="Thông tin"
                  icon={<AiOutlineUser size={18} />}
                  isActive={activeTab === "personal"}
                />
                <TabButton
                  id="security"
                  label="Bảo mật"
                  icon={<AiOutlineLock size={18} />}
                  isActive={activeTab === "security"}
                />
                <TabButton
                  id="rewards"
                  label="Phần thưởng"
                  icon={<AiOutlineGift size={18} />}
                  isActive={activeTab === "rewards"}
                />
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 border border-gray-900"
              >
                <AiOutlineLogout size={18} />
                <span className="hidden sm:block font-medium">Đăng xuất</span>
              </button>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === "personal" && (
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-100">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          Thông Tin Cá Nhân
                        </h2>
                        <p className="text-sm text-gray-500">
                          Quản lý thông tin cá nhân của bạn
                        </p>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-all duration-200 font-medium"
                        >
                          <AiOutlineEdit size={18} />
                          <span className="hidden sm:inline">Chỉnh sửa</span>
                        </button>
                      )}
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                        <div className="w-1 h-5 bg-green-400 rounded-full"></div>
                        Thông tin cơ bản
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Biệt danh
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="nickName"
                              value={userData.nickName || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all text-gray-900"
                              placeholder="Nhập biệt danh"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-100">
                              {userData.nickName || (
                                <span className="text-gray-400">Chưa cập nhật</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Họ và tên
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="fullName"
                              value={userData.fullName || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all text-gray-900"
                              placeholder="Nhập họ và tên"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-100">
                              {userData.fullName || (
                                <span className="text-gray-400">Chưa cập nhật</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Số điện thoại
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={userData.phoneNumber || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all text-gray-900"
                              placeholder="Nhập số điện thoại"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-100">
                              {userData.phoneNumber || (
                                <span className="text-gray-400">Chưa cập nhật</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Giới tính
                          </label>
                          {isEditing ? (
                            <select
                              name="gender"
                              value={userData.gender || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all text-gray-900 bg-white"
                            >
                              <option value="">Chọn giới tính</option>
                              <option value="Nam">Nam</option>
                              <option value="Nữ">Nữ</option>
                              <option value="Khác">Khác</option>
                            </select>
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-100">
                              {userData.gender || (
                                <span className="text-gray-400">Chưa cập nhật</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ngày sinh
                          </label>
                          {isEditing ? (
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={userData.dateOfBirth || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all text-gray-900"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 border border-gray-100">
                              {formatDate(userData.dateOfBirth) || (
                                <span className="text-gray-400">Chưa cập nhật</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <div className="w-1 h-5 bg-green-400 rounded-full"></div>
                          Địa chỉ
                        </h3>
                        {isEditing && (
                          <button
                            onClick={addNewAddress}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
                          >
                            <AiOutlineEnvironment size={16} />
                            Thêm địa chỉ
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {userData.addresses.map((address, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                            {isEditing ? (
                              <div className="space-y-4">
                                {address.addressLine && (
                                  <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                                    <div className="text-xs text-gray-500 mb-1">Địa chỉ hiện tại:</div>
                                    <div className="font-medium text-gray-900 text-sm">
                                      {address.addressLine}
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <SearchableDropdown
                                    label="Tỉnh/Thành phố"
                                    options={provinces.map(province => ({
                                      value: province.ProvinceID,
                                      label: province.ProvinceName
                                    }))}
                                    value={address.provinceId || ""}
                                    onChange={(value) => handleProvinceChange(index, value)}
                                    placeholder="Chọn tỉnh/thành"
                                    disabled={loadingProvinces}
                                    loading={loadingProvinces}
                                  />

                                  <SearchableDropdown
                                    label="Quận/Huyện"
                                    options={districts.map(district => ({
                                      value: district.DistrictID,
                                      label: district.DistrictName
                                    }))}
                                    value={address.districtId || ""}
                                    onChange={(value) => handleDistrictChange(index, value)}
                                    placeholder="Chọn quận/huyện"
                                    disabled={loadingDistricts || !address.provinceId}
                                    loading={loadingDistricts}
                                  />

                                  <SearchableDropdown
                                    label="Phường/Xã"
                                    options={wards.map(ward => ({
                                      value: ward.WardCode,
                                      label: ward.WardName
                                    }))}
                                    value={address.wardCode || ""}
                                    onChange={(value) => handleWardChange(index, value)}
                                    placeholder="Chọn phường/xã"
                                    disabled={loadingWards || !address.districtId}
                                    loading={loadingWards}
                                  />
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={address.isDefault || false}
                                      onChange={() => handleSetDefaultAddress(index)}
                                      className="w-4 h-4 text-green-400 border-gray-300 rounded focus:ring-green-400"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">Đặt làm mặc định</span>
                                  </label>
                                  <button
                                    onClick={() => removeAddress(index)}
                                    className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="text-gray-900 font-medium mb-1">
                                    {address.addressLine || `${address.provinceName}, ${address.districtName}, ${address.wardName}` || (
                                      <span className="text-gray-400">Chưa cập nhật</span>
                                    )}
                                  </div>
                                </div>
                                {address.isDefault && (
                                  <span className="px-3 py-1 bg-green-400 text-white text-xs font-medium rounded-full">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {userData.addresses.length === 0 && (
                          <div className="text-center py-8 border border-gray-200 border-dashed rounded-lg">
                            <AiOutlineEnvironment size={32} className="text-gray-300 mx-auto mb-2" />
                            <span className="text-gray-400 text-sm">Chưa có địa chỉ nào</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 justify-end pt-5 border-t border-gray-100">
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                        >
                          <AiOutlineClose size={18} />
                          Hủy
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-6 py-2.5 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-all duration-200 font-medium"
                        >
                          <AiOutlineSave size={18} />
                          Lưu thay đổi
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="p-6 sm:p-8">
                    <div className="mb-8 pb-5 border-b border-gray-100">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <AiOutlineLock className="text-green-400" size={24} />
                        Bảo Mật Tài Khoản
                      </h2>
                      <p className="text-sm text-gray-500">
                        Thay đổi mật khẩu để bảo vệ tài khoản
                      </p>
                    </div>

                    <div className="max-w-lg mx-auto">
                      <form onSubmit={handlePasswordSubmit} className="space-y-5">
                        {passwordSuccess && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-700 text-sm font-medium">
                              {passwordSuccess}
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mật khẩu cũ
                          </label>
                          <div className="relative">
                            <input
                              type={showOldPassword ? "text" : "password"}
                              name="oldPassword"
                              value={passwordData.oldPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all"
                              placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showOldPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                              ) : (
                                <AiOutlineEye size={20} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all"
                              placeholder="Nhập mật khẩu mới"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                              ) : (
                                <AiOutlineEye size={20} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Xác nhận mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all"
                              placeholder="Nhập lại mật khẩu mới"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
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
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-all duration-200 font-medium mt-6"
                        >
                          <AiOutlineSave size={18} />
                          Đổi mật khẩu
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === "rewards" && (
                  <div className="p-6 sm:p-8">
                    <div className="mb-8 pb-5 border-b border-gray-100">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <AiOutlineGift className="text-green-400" size={24} />
                        Phần Thưởng & Ưu Đãi
                      </h2>
                      <p className="text-sm text-gray-500">
                        Quản lý điểm thưởng và voucher của bạn
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                      <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <AiOutlineTrophy size={24} />
                          </div>
                          <div>
                            <div className="text-3xl font-bold">
                              {points}
                            </div>
                            <div className="text-sm opacity-90">
                              Điểm hiện tại
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white bg-opacity-10 rounded-lg flex items-center justify-center">
                            <AiOutlineGift size={24} />
                          </div>
                          <div>
                            <div className="text-3xl font-bold">
                              {userVouchers.length}
                            </div>
                            <div className="text-sm opacity-90">
                              Voucher khả dụng
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                        <div className="w-1 h-5 bg-green-400 rounded-full"></div>
                        Voucher của bạn
                      </h3>
                      {loadingVouchers ? (
                        <div className="text-center py-16">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
                          <p className="text-gray-600 mt-4">
                            Đang tải voucher...
                          </p>
                        </div>
                      ) : userVouchers.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {getCurrentVouchers().map((voucher, index) => (
                              <div
                                key={(currentVoucherPage - 1) * vouchersPerPage + index}
                                className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                              >
                                <div
                                  className="relative h-full w-full"
                                  style={{
                                    backgroundImage: voucher.image ? `url(${voucher.image})` : 'none',
                                    backgroundColor: voucher.image ? 'transparent' : '#9ca3af',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '180px'
                                  }}
                                >
                                  {voucher.image && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                                  )}

                                  <div className="relative z-10 p-5 text-white h-full flex flex-col justify-between">
                                    <div>
                                      <div className="mb-3">
                                        <div className="font-bold text-base">
                                          {voucher.code}
                                        </div>
                                        <div className="text-xs opacity-90">
                                          Mã voucher
                                        </div>
                                      </div>

                                      <div className="space-y-1.5 text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="opacity-90">
                                            Giảm giá:
                                          </span>
                                          <span className="font-bold">
                                            {voucher.discountValue?.toLocaleString("vi-VN") || 0}{voucher.percentage ? '%' : '₫'}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="opacity-90">
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
                                        className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
                                        onClick={() => navigate("/search")}
                                      >
                                        Sử dụng ngay
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {totalVoucherPages > 1 && (
                            <nav className="flex justify-center items-center gap-2 mt-8">
                              <button
                                onClick={() => setCurrentVoucherPage((x) => Math.max(x - 1, 1))}
                                disabled={currentVoucherPage === 1}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition
                                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                                  bg-green-400 text-white hover:bg-green-500"
                              >
                                Trước
                              </button>

                              {Array.from({ length: totalVoucherPages }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentVoucherPage(i + 1)}
                                  className={`w-9 h-9 rounded-lg text-sm font-bold transition
                                    ${
                                      currentVoucherPage === i + 1
                                        ? "bg-green-400 text-white"
                                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
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
                                className="px-4 py-2 rounded-lg text-sm font-medium transition
                                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                                  bg-green-400 text-white hover:bg-green-500"
                              >
                                Sau
                              </button>
                            </nav>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-16 border border-gray-200 border-dashed rounded-xl">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AiOutlineGift size={28} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium mb-1">
                            Chưa có voucher nào
                          </p>
                          <p className="text-gray-400 text-sm">
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

        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-50 rounded-full mb-4">
                  <AiOutlineExclamationCircle className="text-red-500 text-2xl" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Lỗi</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {errorMessage}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
                  onClick={handleCloseErrorModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
